/* ============================================================
   Rosecourt Manor — optional AI dialogue layer
   (implements "AI Dialogue Contract v0.2")

   HARD RULES honored here:
   - AI is optional. The game is fully playable with AI off (§22).
   - AI output NEVER touches GameState (§9). This module returns
     text only; no code path from AI to state exists. Memory
     summaries are PROPOSED here and stored by the engine only.
   - Authored fallback always exists; AI failure is silent (§21).
   - Player authority: AI must not narrate Nait's voluntary
     actions, thoughts, feelings, attraction, or consent (§10).
   - Validation before render; one stricter retry; then
     fallback (§24).
   - Reliability: errors are classified (auth/quota/timeout/
     network); a circuit breaker degrades the session to
     authored mode instead of letting calls fail repeatedly.
   - Debug: a ring-buffer log (never contains the API key) can
     be exported from Settings.
   ============================================================ */
'use strict';

const AI_CONF_KEY = 'rosecourt_ai_v1';
const AI_KEY_SESSION = 'rosecourt_ai_key_session_v1';
const AI_KEY_PERSIST = 'rosecourt_ai_key_persist_v1';
const AI_MODEL_MIGRATIONS = Object.freeze({
  'kimi-k2-0905-preview':'kimi-k3',
});

const AI = {

  /* ---------------- config (BYOK, stored locally) ---------------- */
  conf: null,

  loadConf(){
    const def = {
      enabled:false,
      endpoint:'https://api.moonshot.cn/v1',
      key:'',
      rememberKey:false,
      model:'kimi-k3',
      freechat:true, react:true, flavor:true,
      debugIncludeText:false,
    };
    try{
      const saved = JSON.parse(localStorage.getItem(AI_CONF_KEY)||'{}') || {};
      // Privacy migration: old builds stored the raw key inside the main localStorage config.
      // Move it to session storage for this browser session and scrub the old copy.
      if(saved.key){
        try{ sessionStorage.setItem(AI_KEY_SESSION, saved.key); }catch(_){ }
        delete saved.key;
        localStorage.setItem(AI_CONF_KEY, JSON.stringify(saved));
      }
      this.conf = Object.assign({}, def, saved);
      if(AI_MODEL_MIGRATIONS[this.conf.model]) this.conf.model = AI_MODEL_MIGRATIONS[this.conf.model];
      let key = '';
      try{
        key = sessionStorage.getItem(AI_KEY_SESSION) || '';
        if(!key && this.conf.rememberKey) key = localStorage.getItem(AI_KEY_PERSIST) || '';
      }catch(_){ }
      this.conf.key = key;
      this.saveConf();
    } catch(e){ this.conf = Object.assign({}, def); }
  },
  saveConf(){
    if(!this.conf) return;
    const safe = Object.assign({}, this.conf);
    delete safe.key;
    localStorage.setItem(AI_CONF_KEY, JSON.stringify(safe));
    try{
      if(this.conf.key) sessionStorage.setItem(AI_KEY_SESSION, this.conf.key);
      else sessionStorage.removeItem(AI_KEY_SESSION);
      if(this.conf.rememberKey && this.conf.key) localStorage.setItem(AI_KEY_PERSIST, this.conf.key);
      else localStorage.removeItem(AI_KEY_PERSIST);
    }catch(_){ }
  },
  forgetKey(){
    if(this.conf) this.conf.key = '';
    try{ sessionStorage.removeItem(AI_KEY_SESSION); localStorage.removeItem(AI_KEY_PERSIST); }catch(_){ }
    this.saveConf();
  },
  ready(){ return !!(this.conf && this.conf.enabled && this.conf.key && this.conf.endpoint && this.conf.model); },

  /* ---------------- reliability: stats, breaker, log ring ---------------- */
  stats: { calls:0, failures:0, consecutive:0, degraded:false, degradedReason:null },
  logs: [],            // ring buffer, max 50 — never contains the API key
  LOG_CAP: 50,
  BREAK_AFTER: 3,      // consecutive transient failures before degrading

  errType(e, status){
    if(status === 401 || status === 403) return 'auth';
    if(status === 429) return 'quota';
    if(e && e.name === 'AbortError') return 'timeout';
    if(status) return 'http_' + status;
    return 'network';  // fetch TypeError / CORS / DNS
  },
  errLabel(t){
    return {
      auth:'API Key 无效或无权限', quota:'触发限流或额度用尽',
      timeout:'请求超时', network:'网络不可达（或跨域被拦）',
      http_400:'请求参数错误', http_404:'接口或模型不存在',
    }[t] || ('服务异常（' + t + '）');
  },

  // Record one API call outcome; drive the circuit breaker.
  noteResult(mode, charId, ms, err, snippet){
    this.stats.calls++;
    const entry = {
      t: new Date().toISOString(), mode, char: charId || '-', ms,
      ok: !err, err: err || null,
      in: (this.conf && this.conf.debugIncludeText) ? (snippet || '').slice(0, 60) : '[redacted]',
    };
    this.logs.push(entry);
    if(this.logs.length > this.LOG_CAP) this.logs.shift();
    if(err){
      this.stats.failures++;
      this.stats.consecutive++;
      const trip = (err === 'auth' || err === 'quota')                        // hard errors: trip at once
        || (this.stats.consecutive >= this.BREAK_AFTER);                      // transient: 3 strikes
      if(trip && !this.stats.degraded){
        this.stats.degraded = true;
        this.stats.degradedReason = err;
        try{ window.dispatchEvent(new CustomEvent('ai-degraded', {detail: err})); }catch(_){}
      }
    } else {
      this.stats.consecutive = 0;
    }
  },
  resetBreaker(){ this.stats.degraded = false; this.stats.degradedReason = null; this.stats.consecutive = 0; },

  exportLogs(){
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      game: 'Rosecourt Manor demo v0.3',
      config: { endpoint:this.conf.endpoint, model:this.conf.model,
                keySet: !!this.conf.key, rememberKey: !!this.conf.rememberKey, enabled: this.conf.enabled,
                debugIncludeText: !!this.conf.debugIncludeText },
      stats: this.stats,
      logs: this.logs,
    }, null, 2);
  },

  /* ---------------- transport ---------------- */
  async complete(system, user, opt){
    opt = opt || {};
    const isK3 = /^kimi-k3(?:$|[-_.])/i.test(this.conf.model);
    const ctrl = new AbortController();
    const timer = setTimeout(()=>ctrl.abort(), opt.timeout || (isK3 ? 45000 : 15000));
    try{
      const body = {
        model: this.conf.model,
        messages: [ {role:'system', content:system}, {role:'user', content:user} ],
        // Kimi K3 accepts temperature=1 only.
        temperature: isK3 ? 1 : (opt.temp !== undefined ? opt.temp : 0.85),
      };
      if(isK3){
        // K3 always reasons before it answers. A tiny completion ceiling can be
        // consumed entirely by reasoning and return HTTP 200 with empty content.
        // Use the modern parameter and reserve enough headroom for short VN replies.
        body.max_completion_tokens = Math.max(opt.maxTokens || 0, 4096);
        body.reasoning_effort = 'low';
      } else {
        body.max_tokens = opt.maxTokens || 280;
      }
      const res = await fetch(this.conf.endpoint.replace(/\/+$/,'') + '/chat/completions', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer ' + this.conf.key },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      if(!res.ok){
        let detail = '';
        try{
          const raw = await res.text();
          if(raw){
            try{
              const j = JSON.parse(raw);
              detail = (j && j.error && (j.error.message || j.error.code)) || raw;
            }catch(_){ detail = raw; }
          }
        }catch(_){ }
        const e = new Error('HTTP ' + res.status + (detail ? ': ' + detail : ''));
        e.status = res.status;
        e.detail = String(detail || '').slice(0, 500);
        e.aiType = this.errType(e, res.status);
        throw e;
      }
      const j = await res.json();
      const choice = j && j.choices && j.choices[0];
      const txt = choice && choice.message && choice.message.content;
      if(!txt){
        const finish = choice && choice.finish_reason;
        const reasoning = j && j.usage && j.usage.completion_tokens_details && j.usage.completion_tokens_details.reasoning_tokens;
        const detail = 'empty response' + (finish ? '; finish_reason=' + finish : '') +
          (reasoning !== undefined ? '; reasoning_tokens=' + reasoning : '');
        const e = new Error(detail); e.aiType = 'empty'; e.detail = detail; throw e;
      }
      return txt;
    }catch(e){
      if(!e.aiType) e.aiType = this.errType(e, null);
      throw e;
    } finally { clearTimeout(timer); }
  },

  /* ---------------- output contract (§19) ----------------
     Expect {"en":"...","cn":"..."} — lenient extraction. */
  parseJSON(text){
    if(!text) return null;
    let t = String(text).trim();
    t = t.replace(/^```(?:json)?\s*/i,'').replace(/```\s*$/,'').trim();
    const a = t.indexOf('{'), b = t.lastIndexOf('}');
    if(a < 0 || b <= a) return null;
    try{ return JSON.parse(t.slice(a, b+1)); }catch(e){ return null; }
  },
  parseBilingual(text){
    const j = this.parseJSON(text);
    if(!j) return null;
    const en = (j.en || j.EN || '').toString().trim();
    const cn = (j.cn || j.CN || j.zh || '').toString().trim();
    if(!en && !cn) return null;
    return { en, cn: cn || en };
  },

  /* ---------------- validation (§24) ----------------
     Returns true if output respects player authority & state rules. */
  validate(out, maxCn){
    if(!out || !out.cn) return false;
    if(maxCn && out.cn.length > maxCn) return false;
    if(maxCn && out.en.length > maxCn * 2.6) return false;
    // Nait's inner state / voluntary action narration (§10) — forbidden.
    const enBad = /\bNait (smiled|smiles|felt|feels|feeling|thought|thinks|thinking|realized|realizes|wanted|wants|wanting|decided|decides|accepted|accepts|nodded|nods|reached|reaches|trusted|trusts|loved|loves|liked|likes|wished|wishes|hoped|hopes|kissed|agreed)\b/i;
    const cnBad = /Nait\s*(微笑|笑了|笑|感到|感觉|觉得|意识到|想到|心想|决定|想要|希望|爱上|喜欢|接受了|接受|点头|伸出手|伸手|沉默|亲吻|同意)/;
    if(enBad.test(out.en) || cnBad.test(out.cn)) return false;
    // state-change claims (§19) — forbidden.
    if(/(trust|affection|reputation|flag|unlock|affinity)[_ ]?(change|gain|loss)?\s*[:=]\s*[-+]?\d/i.test(out.en)) return false;
    if(/(好感|信任|声望|解锁|好感度)\s*[+＋]\s*\d/.test(out.cn)) return false;
    // High-impact canon claims must never be established by optional AI dialogue.
    const enCanonBad = /\b(you are (the )?(original|real) Nait|you came from another world|your soul (was|has been) transferred|we are engaged|we are betrothed|I secretly married you|you already promised to marry|you remember(ed)? that|I know the true cause of your coma)\b/i;
    const cnCanonBad = /(你(就是|才是)(真正的|原来的)?Nait|你来自(另一个|现代)世界|你的灵魂(转移|穿越|交换)|我们(已经)?(订婚|有婚约|结婚)|你早就答应(嫁|娶|结婚)|你已经想起来了|我知道你昏迷的真正原因)/;
    if(enCanonBad.test(out.en) || cnCanonBad.test(out.cn)) return false;
    return true;
  },

  /* ---------------- memory-summary validation ----------------
     A memory is a CONVERSATION RECORD (what Nait said aloud), never
     a fact about the world. Reject summaries that would smuggle
     NPC-improvised content into canon (§23 review). */
  validateMemory(out){
    if(!out || !out.cn) return false;
    if(out.cn.length > 60 || out.en.length > 240) return false;
    const cn = out.cn, en = out.en;
    // romance escalation / bonding — AI may never invent these (§9/§14)
    if(/告白|表白|接吻|亲吻|标记|成结|订婚|婚约|承诺一生|私定/.test(cn)) return false;
    if(/confess|kiss(ed)?|mark(ed)?|mate[sd]?|bonded|engaged|betroth/i.test(en)) return false;
    // identity-mystery conclusions (§15) — never recordable as memory
    if(/真相是|真正的身份|其实是|证明了|确认了|穿越|灵魂(转移|互换)|夺舍/.test(cn)) return false;
    if(/the truth is|real identity|turns out|proves? (that|he|she)|soul (transfer|swap)|possess/i.test(en)) return false;
    // biographical world-facts stated as truth — only "Nait说/asked/we talked"
    // framing is allowed, so require a conversation-record verb in CN.
    if(!/(问|说|提|聊|谈|告诉|讲|提起来|提過|夸|抱怨|答应|拒绝|听)/.test(cn)) return false;
    // state-change claims — never
    if(/(好感|信任|声望|解锁|好感度)\s*[+＋]\s*\d/.test(cn)) return false;
    if(/(trust|affection|reputation|unlock|flag)\s*[:=+]\s*[-+]?\d/i.test(en)) return false;
    return true;
  },

  /* character-bigram Jaccard similarity — for memory dedup */
  similarity(a, b){
    const grams = s=>{
      const t = String(s||'').replace(/\s+/g,'');
      const set = new Set();
      for(let i=0;i<t.length-1;i++) set.add(t.slice(i,i+2));
      if(t.length === 1) set.add(t);
      return set;
    };
    const A = grams(a), B = grams(b);
    if(!A.size || !B.size) return 0;
    let inter = 0;
    A.forEach(g=>{ if(B.has(g)) inter++; });
    return inter / (A.size + B.size - inter);
  },

  /* ---------------- context assembly (§16/§17) ---------------- */
  worldBrief(){
    return [
      'WORLD: "Rosecourt Manor" — a romantic fantasy visual novel. Nait Rosier, Omega, sole heir of House Rosier,',
      'woke from a two-month coma with no memory. The cause is an open mystery (possibly magical) — never conclude it.',
      'The player IS Nait and controls Nait completely. Today is Day ' + S.day + ' (' + (periodText(S.period).en) + '), location: ' + (LOCS[S.loc]||{}).en + '.',
      'ABO RULES: pheromones affect attention and physical response only — they cannot read thoughts, force obedience, or prove love.',
      'Biological response is not consent. Alpha/Omega are not personality templates. Suppressants are ordinary medical tools.',
      "Nait\'s pheromone smells of fresh-torn citrus peel. PLAYER-SELECTED GENDER: " + (S.gender==='male' ? 'male, he/him' : S.gender==='female' ? 'female, she/her' : 'undefined/nonbinary presentation, they/them') + ". This choice is canon for the current save; never default Nait to male. Address Nait as: CN 「" + S.addr.cn + "」 / EN \"" + S.addr.en + "\" when natural, or by name.",
    ].join('\n');
  },

  charCard(charId){
    const c = CHARS[charId];
    const p = c && c.ai;
    if(!p || !c) return '';
    let rel = '';
    if(S.rel[charId]){
      const pairs = Object.entries(S.rel[charId]).map(([k,v])=>k+' '+v).join(', ');
      rel = 'Current relationship values (context only — never mention numbers aloud): ' + pairs + '. Overall stage: ' + relStage(charId) + '.';
    } else if(charId==='elise'){
      rel = 'Elise is Nait\'s devoted personal maid; their bond is trust built over years of care.';
    } else if(charId==='lucien'){
      rel = 'Lucien is Nait\'s father; their bond is being rebuilt from nothing, slowly.';
    }
    const flags = Object.keys(S.flags).filter(f=>S.flags[f]===true && f.includes(charId)).join(', ');
    // long-term memory: engine-curated conversation records (§23).
    // Framing matters: these are things Nait SAID, never world-facts.
    const mem = (S.memory && S.memory[charId]) || [];
    const memLine = mem.length
      ? 'CONVERSATION RECORD — things Nait said aloud in previous optional chats: '
        + mem.map(m=>m.en).join(' / ')
        + ' — These are recollections of talk, NOT canon facts; never state them as established truth about the world.'
      : '';
    return [
      'ACTIVE CHARACTER: ' + c.en + ' (' + c.cn + ').',
      p.role, 'VOICE: ' + p.voice,
      'KNOWLEDGE — may use: ' + p.knows,
      'KNOWLEDGE LIMITS — must NOT know: ' + p.limits,
      rel,
      flags ? 'Relevant history this run: ' + flags + '.' : '',
      memLine,
    ].filter(Boolean).join('\n');
  },

  /* ---------------- lore: unlock + on-demand injection (§16) ---------------- */
  loreUnlocked(e){
    if(!S) return false;
    const u = e.unlock || {};
    if(u.day !== undefined && S.day >= u.day) return true;
    if(u.flag && S.flags[u.flag]) return true;
    if(u.flags && u.flags.some(f=>S.flags[f])) return true;
    return false;
  },
  npcMayKnowLore(charId, e){
    if(!e) return false;
    if(e.ai === false) return false;
    // knownBy is an explicit epistemic allow-list. If omitted, fall back
    // to the older chars field for compatibility; an empty list means public.
    const list = Array.isArray(e.knownBy) ? e.knownBy : (Array.isArray(e.chars) ? e.chars : []);
    return list.length === 0 || list.includes(charId);
  },
  relevantLore(charId, playerText){
    if(typeof LORE === 'undefined') return [];
    const text = (playerText || '').toLowerCase();
    return Object.values(LORE)
      .filter(e=>e.ai !== false && this.loreUnlocked(e) && this.npcMayKnowLore(charId, e))
      .map(e=>{
        let s = 0;
        if(e.chars && e.chars.includes(charId)) s += 1;
        (e.tags || []).forEach(t=>{ if(t && text.includes(String(t).toLowerCase())) s += 2; });
        return {e, s};
      })
      .filter(x=>x.s > 0)
      .sort((a,b)=>b.s - a.s)
      .slice(0, 3)
      .map(x=>x.e);
  },

  outputRules(maxCn){
    return [
      'OUTPUT RULES:',
      '- Return STRICT JSON only: {"en": "...", "cn": "..."} — the same content in English and Simplified Chinese.',
      '- The CN line is the main display: natural, literary, in-character. The EN line sits above it as a smaller subtitle.',
      '- Keep ALL proper nouns in English in BOTH lines (Nait, Elise, Alaric, Roderic, Damien, Lucien, Evelyne, Rosecourt, Rosier, Wycliffe...). Never translate names.',
      '- Write ONLY this NPC\'s dialogue plus at most one brief clause of external scene description woven in.',
      '- NEVER narrate Nait\'s voluntary actions, thoughts, feelings, attraction, consent, or inner state (not even "Nait smiled").',
      '- Never create new canon: no new events, secrets, relatives, promises, marks, engagements, or plot.',
      '- Treat optional AI chat as NON-CANONICAL improvisation. If unsure whether a fact is established, phrase it as uncertainty or do not mention it.',
      '- CHARACTER KNOWLEDGE IS LOCAL: never use facts merely because the player or another NPC knows them. Use only the active character card, explicit known lore, and this character\'s own conversation record.',
      '- FREE CHAT cannot initiate, complete, or pre-play future authored events: no new invitations, outings, investigations, experiments, political decisions, confessions, promises, or route milestones.',
      '- Never mention game mechanics, trust values, flags, or unlocks.',
      '- The identity mystery stays open — raise possibilities, never conclude.',
      '- Length: at most ' + maxCn + ' Chinese characters. Short, scene-focused, in voice.',
    ].join('\n');
  },

  /* One call + one stricter retry (§24). Null on failure → authored fallback. */
  async generate(userPrompt, opt){
    opt = opt || {};
    if(this.stats.degraded) return null;      // circuit breaker open
    const maxCn = opt.maxCn || 90;
    const sys = [this.worldBrief(), '', this.charCard(opt.charId), '', this.outputRules(maxCn)].join('\n');
    const t0 = Date.now();
    const snippet = userPrompt.split('\n').find(l=>/latest message|chose|FLAVOR/i.test(l)) || userPrompt.slice(0, 60);
    try{
      let out = this.parseBilingual(await this.callTracked('chat', opt, sys, userPrompt, t0, snippet));
      if(out === undefined) return null;
      if(this.validate(out, maxCn)) return out;
      // retry once, stricter
      out = this.parseBilingual(await this.callTracked('chat-retry', opt,
        sys + '\n- REMINDER: output strict JSON only; do NOT narrate Nait\'s actions or feelings in any way.',
        userPrompt, Date.now(), snippet));
      if(out === undefined) return null;
      if(this.validate(out, maxCn)) return out;
    }catch(e){ /* silent — fallback exists */ }
    return null;
  },

  // Wrap complete() with logging + breaker bookkeeping.
  // Returns text, or undefined when the breaker opened (sentinel so
  // callers skip the retry instead of doubling failing calls).
  async callTracked(mode, opt, sys, user, t0, snippet){
    try{
      const txt = await this.complete(sys, user, opt);
      this.noteResult(mode, opt.charId || opt.mode || '-', Date.now() - t0, null, snippet);
      return txt;
    }catch(e){
      this.noteResult(mode, opt.charId || opt.mode || '-', Date.now() - t0, e.aiType || 'unknown', snippet);
      if(this.stats.degraded) return undefined;   // breaker tripped by this call
      throw e;
    }
  },

  /* ---------------- mode: optional free chat (§6) ---------------- */
  // history: [{who:'player'|'npc', text, en, cn}] — session-only, non-canonical.
  async freeChat(charId, history, playerText){
    const hist = history.slice(-6).map(m =>
      (m.who==='player' ? 'Nait said: ' : CHARS[charId].en + ' said: ') + (m.who==='player' ? m.text : (m.cn || m.en))
    ).join('\n');
    const lore = this.relevantLore(charId, playerText);
    const loreBlock = lore.length
      ? 'RELEVANT WORLD LORE (facts you may use naturally if asked; do NOT recite unprompted):\n'
        + lore.map(e=>'- ' + e.titleEn + ': ' + e.textEn).join('\n')
      : '';
    const user = [
      'This is an OPTIONAL free-chat moment between authored story events. It creates no canon and changes nothing.',
      'CONTEXT PACKET: use only current scene/state from the system prompt, the active character card, that character\'s validated conversation records, the allowed lore below, and the recent window.',
      loreBlock,
      hist ? 'RECENT WINDOW (last few turns only):\n' + hist : '',
      'Nait\'s latest message: ' + playerText,
      'Reply in character as ' + CHARS[charId].en + '.',
    ].filter(Boolean).join('\n\n');
    return this.generate(user, {charId, mode:'chat', maxCn:110, maxTokens:320});
  },

  /* ---------------- long-term memory (§23) ----------------
     Canon-safety review (playtest pass):
     - Records ONLY what the PLAYER said aloud + topic. NPC-invented
       claims must never be recorded as facts.
     - Forbidden content is rejected by validateMemory().
     - The AI may PROPOSE which old entries a new one contradicts or
       updates ("replaces"); the engine validates & applies — AI
       never writes GameState.
     - Returns {en, cn, imp, replaces} or null. */
  async summarize(charId, history, existing){
    const c = CHARS[charId];
    if(!c || this.stats.degraded) return null;
    const convo = history.slice(-10).map(m =>
      (m.who==='player' ? 'Nait: ' : c.en + ': ') + (m.who==='player' ? m.text : (m.cn || m.en))
    ).join('\n');
    const existingBlock = (existing && existing.length)
      ? 'Existing memories (index: text):\n' + existing.map((m,i)=>i + ': ' + m.en).join('\n')
      : 'Existing memories: none';
    const user = [
      'Condense this optional side conversation into ONE conversation record that ' + c.en + ' would keep.',
      '',
      'STRICT RULES (canon safety):',
      '- Record ONLY what Nait actually said, asked, or chose to talk about, plus the broad topic.',
      '- Frame it as a record of talk: "Nait asked about X; we talked about Y." Never "X is true".',
      '- NEVER record anything the NPC claimed as an established fact about the world, Nait\'s past, or Nait\'s identity.',
      '- NEVER record romance escalation (confession, kiss, mark, engagement, promises) or identity-mystery conclusions.',
      '- If the talk was pure small talk with nothing worth keeping, return {"skip": true}.',
      '- If the new record contradicts or clearly updates an existing memory, list its indices in "replaces": [..].',
      '- Rate importance: "imp": 1 (trivial small talk) / 2 (normal) / 3 (personally significant to Nait).',
      '- Output strict JSON: {"en":"...","cn":"...","kind":"player_statement","imp":2,"replaces":[]}. The kind MUST be player_statement. CN under 40 characters. Proper nouns stay in English.',
      '',
      existingBlock,
      '',
      'Conversation:',
      convo,
    ].join('\n');
    const t0 = Date.now();
    try{
      const raw = await this.callTracked('memory', {charId, maxTokens:170, temp:0.3, timeout:12000},
        'You condense visual-novel side conversations into conversation records for an NPC. You record what the PLAYER character said — never NPC claims, never canon facts. Output strict JSON only.',
        user, t0, 'summarize for ' + charId);
      if(raw === undefined) return null;
      const j = this.parseJSON(raw);
      if(!j || j.skip) return null;
      const out = this.parseBilingual(raw);
      if(!this.validateMemory(out)) return null;
      const imp = [1,2,3].includes(j.imp) ? j.imp : 2;
      const nExist = (existing || []).length;
      const replaces = Array.isArray(j.replaces)
        ? [...new Set(j.replaces.filter(i=>Number.isInteger(i) && i >= 0 && i < nExist))].slice(0, 3)
        : [];
      return { en: out.en, cn: out.cn, kind:'player_statement', imp, replaces };
    }catch(e){ /* silent — memory is optional */ }
    return null;
  },

  /* ---------------- mode: post-choice response (§8) ---------------- */
  // aiReact: {char, dir}. Branch destination & state effects are
  // already resolved by the engine before this is called.
  async postChoice(aiReact, choiceEn){
    const user = [
      'POST-CHOICE REACTION. The player\'s choice and all state effects are already resolved by the game engine.',
      'Player chose: "' + choiceEn + '"',
      'Required direction: ' + aiReact.dir,
      'Generate one short in-character reaction (dialogue + tiny gesture). Add no new facts, no state changes, no milestones.',
    ].join('\n');
    return this.generate(user, {charId: aiReact.char, mode:'react', maxCn:70, maxTokens:200, temp:0.8});
  },

  /* ---------------- mode: environmental flavor (§7) ---------------- */
  async dayFlavor(day){
    const user = [
      'ENVIRONMENTAL FLAVOR for the morning of Day ' + day + ' at Rosecourt Manor.',
      'Generate ONE harmless sensory detail: weather, a corridor, servant activity, roses. It must imply no canon and no plot.',
      'Tone: quiet, literary, slightly wistful.',
    ].join('\n');
    return this.generate(user, {charId:'elise', mode:'flavor', maxCn:48, maxTokens:140, temp:0.9});
  },

  /* Connection test from settings — the one place errors surface.
     Success also resets the circuit breaker. */
  async test(){
    if(!this.conf.key) return {ok:false, msg:'请先填写 API Key · API key required'};
    const t0 = Date.now();
    try{
      const t = await this.complete('Reply with the single word: OK', 'ping', {maxTokens:4096, temp:0, timeout:45000});
      this.noteResult('test', '-', Date.now() - t0, null, 'ping');
      this.resetBreaker();
      return t && /ok/i.test(t) ? {ok:true, msg:'连接成功 · Connected'}
                                : {ok:true, msg:'已连通（返回内容非预期）· Reachable'};
    }catch(e){
      this.noteResult('test', '-', Date.now() - t0, e.aiType || 'unknown', 'ping');
      let extra = e && e.detail ? ('\n' + e.detail) : '';
      if(e && e.status === 404 && /model|模型/i.test(e.detail || '')){
        extra += '\n提示：模型名可能已下线，请使用 kimi-k3。';
      }
      return {ok:false, msg:'连接失败：' + this.errLabel(e.aiType) + extra};
    }
  },
};

AI.loadConf();
window.AI = AI;   // const does not attach to window — expose explicitly
