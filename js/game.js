/* ============================================================
   Rosecourt Manor — deterministic narrative engine
   Authored content lives in data.js. This file never authors
   story text; it only walks nodes, applies effects, saves state.
   ============================================================ */
'use strict';

const SAVE_KEY  = 'rosecourt_save_v1';      // legacy single slot (migrated on boot)
const SLOTS_KEY = 'rosecourt_saves_v2';     // { auto, slots:[x3] }
const SET_KEY   = 'rosecourt_settings_v1';
const CURRENT_SAVE_VERSION = 4;
let pendingLegacySave = null;

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch=>({"&":'&amp;',"<":'&lt;',">":'&gt;',"\"":'&quot;',"'":'&#39;'}[ch]));
const chatAvatarOf = c => c.chatAvatar || c.sprite;
const bondPortraitOf = c => c.bondPortrait || c.sprite;

/* ---------------- state ---------------- */
const ADDR = {
  male:   { cn:'少爷',      en:'young master' },
  female: { cn:'小姐',      en:'my lady' },
  free:   { cn:'Nait 大人', en:'Lord Nait' },
};
function freshState(gender){
  const addr = ADDR[gender] || ADDR.free;
  return {
    gender, addr,
    day: 1, period: 'morning', loc: 'bedroom',
    health: 62, reputation: 3,
    rel: {
      elise:   { trust:4, warmth:4 },
      lucien:  { trust:1, warmth:1 },
      alaric:  { trust:0, curiosity:0, respect:0, intimacy:0, warmth:0 },
      roderic: { trust:0, respect:0, rivalry:0, warmth:0, intimacy:0 },
      damien:  { political_trust:0, personal_trust:0, reputation:0, vulnerability:0 }
    },
    flags: {}, fragments: [], interp: {},
    route: { family:0, alaric:0, roderic:0, damien:0, ensemble:0 },
    identity: { continuity:0, transference:0, self_defined:0 },
    responsibility: { high:0, measured:0, low:0 },
    estate: { treasury:5, welfare:5, reputation:5, stability:5, court_influence:0, staff_trust:5 },
    memory: {},          // long-term NPC memories from free chat (engine-written)
    seen: {}
  };
}

let S = null;            // game state
let flowIndex = 0;       // position in FLOW
let curScene = null;     // scene id
let curNode = null;      // node id
let settings = loadSettings();
let startMode = 'normal';

function loadSettings(){
  try{ return Object.assign({en:true, motion:false}, JSON.parse(localStorage.getItem(SET_KEY)||'{}')); }
  catch(e){ return {en:true, motion:false}; }
}
function saveSettings(){ localStorage.setItem(SET_KEY, JSON.stringify(settings)); applySettings(); }
function applySettings(){
  document.body.classList.toggle('hide-en', !settings.en);
  document.body.classList.toggle('reduce-motion', settings.motion);
  $('set-en').checked = settings.en;
  $('set-motion').checked = settings.motion;
}

/* ---------------- save / load — auto slot + 3 manual slots ---------------- */
function blankSaves(){ return { auto:null, slots:[null,null,null] }; }
function loadAllSaves(){
  try{
    const v = JSON.parse(localStorage.getItem(SLOTS_KEY) || 'null');
    if(v && Array.isArray(v.slots)) return Object.assign(blankSaves(), v);
  }catch(e){}
  return blankSaves();
}
function writeAllSaves(v){ localStorage.setItem(SLOTS_KEY, JSON.stringify(v)); }
function normalizeState(st){
  if(!st) return st;
  if(typeof st.addr === 'string') st.addr = { cn:st.addr, en:st.addr };
  st.memory = st.memory || {};
  for(const k in st.memory)
    (st.memory[k]||[]).forEach(m=>{
      if(![1,2,3].includes(m.imp)) m.imp = 2;
      if(!m.kind) m.kind = 'player_statement';
      if(!m.source) m.source = 'optional_ai_chat';
    });
  st.fragments = st.fragments || [];
  st.flags = st.flags || {};
  st.interp = st.interp || {};
  st.seen = st.seen || {};
  st.route = Object.assign({family:0,alaric:0,roderic:0,damien:0,ensemble:0}, st.route||{});
  st.identity = Object.assign({continuity:0,transference:0,self_defined:0}, st.identity||{});
  st.responsibility = Object.assign({high:0,measured:0,low:0}, st.responsibility||{});
  st.rel = st.rel || {};
  st.rel.elise = Object.assign({trust:4,warmth:4}, st.rel.elise||{});
  st.rel.lucien = Object.assign({trust:1,warmth:1}, st.rel.lucien||{});
  st.rel.alaric = Object.assign({trust:0,curiosity:0,respect:0,intimacy:0,warmth:0}, st.rel.alaric||{});
  st.rel.roderic = Object.assign({trust:0,respect:0,rivalry:0,warmth:0,intimacy:0}, st.rel.roderic||{});
  st.rel.damien = Object.assign({political_trust:0,personal_trust:0,reputation:0,vulnerability:0}, st.rel.damien||{});
  st.estate = Object.assign({treasury:5,welfare:5,reputation:5,stability:5,court_influence:0,staff_trust:5}, st.estate||{});
  return st;
}
function currentPayload(){
  return { version:CURRENT_SAVE_VERSION, state:S, flowIndex, scene:curScene, node:curNode, sceneIsEnding:!!sceneIsEnding, savedAt:Date.now() };
}
function inspectSave(p){
  if(!p || typeof p!=='object' || !p.state || typeof p.state!=='object') return {ok:false, reason:'存档结构损坏 · Corrupt save'};
  const version = Number.isInteger(p.version) ? p.version : 1;
  if(version > CURRENT_SAVE_VERSION) return {ok:false, reason:'该存档来自更新版本 · Save is from a newer build'};
  const gender = p.state.gender;
  const needsGender = !['male','female','free'].includes(gender);
  return {ok:true, version, needsGender};
}
function deriveFlowIndex(st){
  if(!st) return 0;
  let i = FLOW.findIndex(s=>s.day===st.day && s.period===st.period && (!s.loc || !st.loc || s.loc===st.loc));
  if(i<0) i = FLOW.findIndex(s=>s.day===st.day);
  if(i<0) i = 0;
  return i;
}
function migratePayload(p, genderOverride){
  const q = JSON.parse(JSON.stringify(p));
  q.state = q.state || {};
  if(genderOverride) q.state.gender = genderOverride;
  q.state = normalizeState(q.state);
  if(!['male','female','free'].includes(q.state.gender)) return null;
  q.state.addr = ADDR[q.state.gender] || ADDR.free;
  if(!Number.isInteger(q.flowIndex) || q.flowIndex<0 || q.flowIndex>=FLOW.length) q.flowIndex = deriveFlowIndex(q.state);
  const oldVersion = Number.isInteger(q.version) ? q.version : 1;
  // Exact scene/node resume was introduced later. If an old payload points at an invalid node, resume the flow checkpoint instead.
  if(q.scene && (!SCENES[q.scene] || (q.node && !SCENES[q.scene].nodes[q.node]))){ q.scene=null; q.node=null; q.sceneIsEnding=false; }
  if(oldVersion < 3 && (!q.scene || !q.node)){ q.scene=null; q.node=null; q.sceneIsEnding=false; }
  q.version = CURRENT_SAVE_VERSION;
  q.savedAt = q.savedAt || Date.now();
  return q;
}
function replaceStoredPayload(original, migrated){
  const all = loadAllSaves();
  const same = x=>x && original && ((x.savedAt && original.savedAt && x.savedAt===original.savedAt) || x===original);
  if(same(all.auto)) all.auto = migrated;
  all.slots = all.slots.map(x=>same(x)?migrated:x);
  writeAllSaves(all);
}
function requestLegacyGender(p){
  pendingLegacySave = p;
  startMode = 'migrate-save';
  const sub = document.querySelector('#screen-gender .page-sub');
  if(sub) sub.textContent = '这个旧存档创建于性别选择成为正式设定之前。请选择 Nait 在此存档中的性别与代词；剧情进度不会因此重置。';
  show('screen-gender');
}
async function resumeLegacyGender(gender){
  const original = pendingLegacySave;
  pendingLegacySave = null;
  const migrated = migratePayload(original, gender);
  if(!migrated){ alert('无法迁移该存档 · Unable to migrate this save.'); show('screen-title'); return; }
  replaceStoredPayload(original, migrated);
  await applySave(migrated);
}

function saveGame(silent){                 // engine auto-save → auto slot
  if(!S) return;
  const all = loadAllSaves();
  all.auto = currentPayload();
  writeAllSaves(all);
  if(!silent){
    $('save-toast').classList.remove('hidden');
    setTimeout(()=>$('save-toast').classList.add('hidden'), 1800);
  }
  refreshTitleSave();
}
function saveToSlot(i){
  const all = loadAllSaves();
  all.slots[i] = currentPayload();
  writeAllSaves(all);
  refreshTitleSave();
}
function deleteSave(kind, i){
  const all = loadAllSaves();
  if(kind==='auto') all.auto = null; else all.slots[i] = null;
  writeAllSaves(all);
  refreshTitleSave();
}
function loadSave(){                        // title "Continue" = newest compatible/migratable save
  const all = loadAllSaves();
  return [all.auto, ...all.slots].filter(p=>inspectSave(p).ok).sort((a,b)=>(b.savedAt||0)-(a.savedAt||0))[0] || null;
}
async function applySave(p){
  const check = inspectSave(p);
  if(!check.ok){ alert(check.reason); return; }
  if(check.needsGender){ requestLegacyGender(p); return; }
  const migrated = migratePayload(p);
  if(!migrated){ alert('存档无法迁移 · Save migration failed.'); return; }
  S = migrated.state;
  flowIndex = migrated.flowIndex;
  curScene = migrated.scene || null;
  curNode = migrated.node || null;
  sceneIsEnding = !!migrated.sceneIsEnding;
  const step = FLOW[flowIndex];
  const sceneId = curScene || (step && step.scene);
  const scene = sceneId ? SCENES[sceneId] : null;
  const node = scene && curNode ? scene.nodes[curNode] : null;
  const bg = (node && node.bg) || (scene && scene.bg) || 'bedroom';
  await Promise.all([preloadImage(`assets/bg/${bg}.webp`), preloadCharacterSprites()]);
  setInitialBG(bg);
  show('screen-game');
  warmBackgrounds();
  // v3 saves resume the exact authored node. Older saves safely resume their flow step.
  if(scene && curNode && scene.nodes[curNode]){
    if(scene.loc) S.loc = scene.loc;
    updateHUD();
    renderNode(scene.nodes[curNode]);
  } else {
    curScene = null; curNode = null; sceneIsEnding = false;
    runFlow();
  }
}
function migrateLegacySave(){
  const old = localStorage.getItem(SAVE_KEY);
  if(!old) return;
  try{
    const p = JSON.parse(old);
    if(p && p.state){
      const all = loadAllSaves();
      if(!all.auto) all.auto = p;
      writeAllSaves(all);
    }
  }catch(e){}
  localStorage.removeItem(SAVE_KEY);
}
function refreshTitleSave(){
  const sv = loadSave();
  const btn = $('btn-continue');
  if(sv && sv.state){
    btn.disabled = false;
    const loc = LOCS[sv.state.loc] || {en:'',cn:''};
    $('save-preview').classList.remove('hidden');
    $('save-preview').textContent =
      `第${dayCn(sv.state.day)}日 · ${loc.cn} · Day ${sv.state.day}${inspectSave(sv).needsGender ? ' · 旧存档需确认性别' : ''}`;
  } else {
    btn.disabled = true;
    const raw = loadAllSaves();
    const anyRaw = [raw.auto, ...raw.slots].some(Boolean);
    if(anyRaw){
      $('save-preview').classList.remove('hidden');
      $('save-preview').textContent = '检测到无法读取的旧版或损坏存档 · Incompatible/corrupt save detected';
    } else {
      $('save-preview').classList.add('hidden');
    }
  }
}

/* ---------------- text helpers ---------------- */
function sub(t, lang){
  if(!t) return '';
  // backward compatibility: old saves stored addr as a plain string
  if(S && typeof S.addr === 'string') S.addr = { cn:S.addr, en:S.addr };
  const a = S ? (S.addr[lang] || S.addr.cn) : (lang === 'en' ? 'Lord Nait' : 'Nait 大人');
  return t.replaceAll('{addr}', a);
}
function periodText(p){
  return { morning:{en:'Morning',cn:'清晨'}, afternoon:{en:'Afternoon',cn:'午后'},
           evening:{en:'Evening',cn:'黄昏'}, night:{en:'Night',cn:'夜晚'} }[p] || {en:'',cn:''};
}
function dayCn(n){
  const small=['零','一','二','三','四','五','六','七','八','九','十'];
  if(n<=10) return small[n] || String(n);
  if(n<20) return '十' + (n===10 ? '' : small[n-10]);
  if(n===20) return '二十';
  if(n<30) return '二十' + small[n-20];
  return String(n);
}

/* ---------------- screens ---------------- */
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('visible'));
  $(id).classList.add('visible');
}

/* ---------------- effects ---------------- */
function applyEffects(fx){
  (fx||[]).forEach(e=>{
    const [kind,...a] = e;
    if(kind==='rel'){ const [c,f,d]=a; if(S.rel[c] && f in S.rel[c]) S.rel[c][f]+=d; }
    else if(kind==='flag'){ S.flags[a[0]] = a[1]; }
    else if(kind==='health'){ S.health = Math.max(0, Math.min(100, S.health + a[0])); }
    else if(kind==='rep'){ S.reputation += a[0]; }
    else if(kind==='route'){ const [r,d]=a; if(S.route && r in S.route) S.route[r]+=d; }
    else if(kind==='identity'){ const [k,d]=a; if(S.identity && k in S.identity) S.identity[k]+=d; }
    else if(kind==='responsibility'){ const [k,d]=a; if(S.responsibility && k in S.responsibility) S.responsibility[k]+=d; }
    else if(kind==='estate'){ const [k,d]=a; if(S.estate && k in S.estate) S.estate[k]=Math.max(0,Math.min(10,S.estate[k]+d)); }
    else if(kind==='fragment'){ collectFragment(a[0]); }
  });
}
function collectFragment(id){
  if(S.fragments.includes(id)) return;
  S.fragments.push(id);
  $('memory-dot').classList.remove('hidden');
  toast(`获得记忆碎片 · Memory Fragment —— ${FRAGMENTS[id].titleCn}`);
}

/* ---------------- background & sprite ---------------- */
let bgActive = 'a';
const assetPreload = new Map();
function preloadImage(url){
  if(assetPreload.has(url)) return assetPreload.get(url);
  const task = new Promise(resolve=>{
    const img = new Image();
    img.onload = async ()=>{
      try{ if(img.decode) await img.decode(); }catch(e){}
      resolve(url);
    };
    img.onerror = ()=>resolve(url);
    img.src = url;
  });
  assetPreload.set(url, task);
  return task;
}
function preloadCharacterSprites(){
  return Promise.all(Object.values(CHARS).map(c=>c && c.sprite ? preloadImage(c.sprite) : Promise.resolve()));
}
function warmBackgrounds(){
  ['bedroom','sitting_room','library','garden','training','ballroom','market','academy','palace','conservatory','city_gate','estate_village','riverside','old_road']
    .forEach(k=>preloadImage(`assets/bg/${k}.webp`));
}
function setInitialBG(key){
  const url = `assets/bg/${key}.webp`;
  const a = $('bg-layer-a'), b = $('bg-layer-b');
  a.style.backgroundImage = `url('${url}')`;
  a.classList.add('on');
  b.classList.remove('on');
  b.style.backgroundImage = '';
  bgActive = 'a';
}
function setBG(key){
  const url = `assets/bg/${key}.webp`;
  const inEl = bgActive==='a' ? $('bg-layer-b') : $('bg-layer-a');
  const outEl = bgActive==='a' ? $('bg-layer-a') : $('bg-layer-b');
  preloadImage(url).then(()=>{
    inEl.style.backgroundImage = `url('${url}')`;
    inEl.classList.add('on'); outEl.classList.remove('on');
    bgActive = bgActive==='a' ? 'b' : 'a';
  });
}
function applySpriteFit(charId){
  const el = $('sprite-main');
  const c = CHARS[charId] || {};
  const mobile = window.matchMedia('(max-width:640px)').matches;
  const scale = mobile ? (c.spriteScaleMob || c.spriteScale || 1) : (c.spriteScale || 1);
  const x = mobile ? (c.spriteXMob || c.spriteX || '0px') : (c.spriteX || '0px');
  const y = mobile ? ((c.spriteYMob !== undefined ? c.spriteYMob : c.spriteY) || '0px')
                   : (c.spriteY || '0px');
  el.style.setProperty('--spr-scale', String(scale));
  el.style.setProperty('--spr-x', typeof x === 'number' ? `${x}px` : String(x));
  el.style.setProperty('--spr-y', typeof y === 'number' ? `${y}px` : String(y));
}
function clearSpriteImmediate(){
  const el = $('sprite-main');
  if(!el) return;
  el.classList.remove('on');
  el.dataset.charId = '';
  applySpriteFit('');
  // Scene/day boundaries should never carry the previous character forward.
  // Suppress the normal 0.7s fade only for this boundary clear.
  const prevTransition = el.style.transition;
  el.style.transition = 'none';
  el.style.opacity = '0';
  void el.offsetWidth;
  requestAnimationFrame(()=>{
    el.style.transition = prevTransition;
    el.style.opacity = '';
  });
}

function setSprite(charId){
  const el = $('sprite-main');
  if(!charId || charId==='none'){
    el.classList.remove('on');
    el.dataset.charId = '';
    applySpriteFit('');
    return;
  }
  const c = CHARS[charId];
  if(!c || !c.sprite){ el.classList.remove('on'); return; }
  const src = c.sprite;
  el.dataset.charId = charId;
  applySpriteFit(charId);
  if(el.dataset.cur === src){ el.classList.add('on'); return; }
  el.classList.remove('on');
  // Use the shared decoded preload promise. This avoids the common mobile race
  // where the line renders first and the portrait appears only after reading it.
  preloadImage(src).then(()=>{
    if(el.dataset.charId !== charId) return; // scene moved on while loading
    el.src = src; el.dataset.cur = src;
    requestAnimationFrame(()=>el.classList.add('on'));
  });
}
window.addEventListener('resize', ()=>{
  const id = $('sprite-main')?.dataset?.charId;
  if(id) applySpriteFit(id);
});

/* ---------------- flow ---------------- */
function runFlow(){
  const step = FLOW[flowIndex];
  if(!step){ showEnding(); return; }
  if(step.type==='dayEnd'){
    clearSpriteImmediate();
    flowIndex++;
    curScene = null; curNode = null; sceneIsEnding = false;
    saveGame(true);
    const next = FLOW[flowIndex];
    if(next && next.day){ showDayCard(next.day, ()=>runFlow()); }
    else runFlow();
    return;
  }
  if(step.type==='schedule'){
    clearSpriteImmediate();
    curScene = null; curNode = null; sceneIsEnding = false;
    S.day = step.day; S.period = step.period;
    updateHUD(); saveGame(true);
    openSchedule(step);
    return;
  }
  if(step.type==='scene' || step.type==='ending'){
    S.day = step.day; S.period = step.period; S.loc = step.loc;
    updateHUD();
    startScene(step.scene, step.type==='ending');
    return;
  }
}

function showDayCard(day, cb){
  const numCn = dayCn(day);
  const card = $('day-card');
  $('day-card-en').textContent = `Day ${day}`;
  $('day-card-cn').textContent = `第 ${numCn} 日`;
  // ambient flavor: authored pool first (§21 fallback); AI may replace it in time
  const pool = (typeof DAY_FLAVOR !== 'undefined' && DAY_FLAVOR[day]) || [];
  const base = pool[Math.floor(Math.random()*pool.length)];
  $('day-flavor-en').textContent = base ? base.en : '';
  $('day-flavor-cn').textContent = base ? base.cn : '';
  card.classList.remove('hidden');
  requestAnimationFrame(()=>card.classList.add('on'));
  if(window.AI && AI.conf && AI.conf.enabled && AI.conf.flavor && AI.ready()){
    AI.dayFlavor(day).then(r=>{
      if(r && !card.classList.contains('hidden')){
        $('day-flavor-en').textContent = r.en;
        $('day-flavor-cn').textContent = r.cn;
      }
    });
  }
  setTimeout(()=>{
    card.classList.remove('on');
    setTimeout(()=>{ card.classList.add('hidden'); cb(); }, 950);
  }, 2000);
}

/* ---------------- scene walking ---------------- */
function startScene(sceneId, isEnding){
  // A new event starts with an empty stage. Individual nodes explicitly bring characters in.
  clearSpriteImmediate();
  curScene = sceneId;
  const sc = SCENES[sceneId];
  if(sc.bg) setBG(sc.bg);
  if(sc.loc){ S.loc = sc.loc; updateHUD(); }
  gotoNode(sc.start, isEnding);
}
let sceneIsEnding = false;
function gotoNode(nodeId, endingFlag){
  if(endingFlag !== undefined) sceneIsEnding = endingFlag;
  const sc = SCENES[curScene];
  const n = sc.nodes[nodeId];
  curNode = nodeId;
  if(n.bg) setBG(n.bg);
  if(n.branch){
    const hit = n.branch.find(b=>S.flags[b.flag]=== (b.value===undefined? true : b.value));
    gotoNode(hit ? hit.goto : n.else);
    return;
  }
  if(n.fx) applyEffects(n.fx);
  if(n.memory) collectFragment(n.memory);
  renderNode(n);
  saveGame(true);
}

function renderNode(n){
  const box = $('dialogue-box'), choicesEl = $('choices'), fb = $('feedback-line');
  fb.classList.add('hidden');
  $('continue-hint').classList.remove('hidden');

  if(n.sprite !== undefined) setSprite(n.sprite);

  // speaker
  const np = $('nameplate');
  if(n.sp && CHARS[n.sp]){
    np.classList.remove('hidden');
    $('speaker-en').textContent = CHARS[n.sp].en;
    $('speaker-cn').textContent = CHARS[n.sp].cn;
  } else {
    np.classList.add('hidden');
  }

  // text (choice prompts sit in the dialogue box)
  const en = n.en || (n.choice ? n.choice.promptEn : '') || '';
  const cn = n.cn || (n.choice ? n.choice.promptCn : '') || '';
  $('text-en').textContent = sub(en,'en');
  const cnEl = $('text-cn');
  cnEl.textContent = sub(cn,'cn');
  cnEl.classList.toggle('narration', !n.sp);

  // memory fragment node styling
  box.style.borderLeft = n.memory ? '3px solid var(--rose)' : '1px solid #c9b98f';

  if(n.end){
    $('continue-hint').textContent = '❧';
    box.onclick = ()=>{ endScene(); };
    return;
  }
  if(n.choice){
    box.onclick = null;
    $('continue-hint').classList.add('hidden');
    renderChoices(n.choice);
    return;
  }
  box.onclick = ()=>{ gotoNode(n.next); };
  choicesEl.classList.add('hidden');
  choicesEl.innerHTML = '';
}

function renderChoices(ch){
  const wrap = $('choices');
  wrap.innerHTML = '';
  wrap.classList.remove('hidden');
  ch.options.forEach(op=>{
    const b = document.createElement('button');
    b.className = 'choice-btn';
    b.innerHTML = `<span class="en-line">${sub(op.en,'en')}</span>${sub(op.cn,'cn')}`;
    b.onclick = ev=>{
      ev.stopPropagation();
      applyEffects(op.fx);   // engine resolves all state effects FIRST (Contract §8)
      wrap.classList.add('hidden'); wrap.innerHTML='';
      const fb = $('feedback-line');
      if(op.fb && (op.fb.cn || op.fb.en)){
        fb.innerHTML = `<span class="en-line">${sub(op.fb.en||'','en')}</span>${sub(op.fb.cn||'','cn')}`;
        fb.classList.remove('hidden');
      }
      // Optional AI post-choice reaction — garnish only, never blocks flow (§8/§21)
      const useAI = op.aiReact && window.AI && AI.conf && AI.conf.enabled && AI.conf.react && AI.ready();
      if(!useAI){ setTimeout(()=>gotoNode(op.goto), op.fb ? 900 : 60); return; }
      const pend = document.createElement('span');
      pend.className = 'fb-pending'; pend.textContent = '· · ·';
      fb.appendChild(pend); fb.classList.remove('hidden');
      let done = false;
      const proceed = ()=>{ if(!done){ done = true; gotoNode(op.goto); } };
      const timer = setTimeout(proceed, 3400);   // hard cap — story never waits on AI
      AI.postChoice(op.aiReact, sub(op.en,'en')).then(r=>{
        pend.remove();
        if(r && !done){
          const div = document.createElement('div');
          div.className = 'fb-ai';
          div.innerHTML = `<span class="en-line">${esc(r.en)}</span>${esc(r.cn)}`;
          fb.appendChild(div);
          clearTimeout(timer);
          setTimeout(proceed, 1800);
        }
      });
    };
    wrap.appendChild(b);
  });
}

function endScene(){
  clearSpriteImmediate();
  S.seen[curScene] = true;
  if(sceneIsEnding){ saveGame(true); showEnding(); return; }
  flowIndex++;
  curScene = null; curNode = null; sceneIsEnding = false;
  saveGame(true);
  runFlow();
}

/* ---------------- HUD ---------------- */
function updateHUD(){
  const p = periodText(S.period);
  const loc = LOCS[S.loc] || {en:'',cn:''};
  $('hud-day').textContent = `Day ${S.day} · ${p.en}`;
  $('hud-loc').textContent = `第${dayCn(S.day)}日 · ${p.cn} · ${loc.cn}`;
}

/* ---------------- schedule ---------------- */
function openSchedule(step){
  let scheduleCommitted = false;
  const p = periodText(step.period);
  $('sched-time-en').textContent = `Day ${step.day} · ${p.en}`;
  $('sched-title').textContent = step.titleCn || '你想去哪里？';
  const wrap = $('sched-options');
  wrap.innerHTML = '';
  step.options.forEach(op=>{
    const loc = LOCS[op.loc];
    const b = document.createElement('button');
    b.className = 'sched-btn';
    b.innerHTML = `<div>
        <div class="loc-name"><span class="en-line">${loc.en}</span>${loc.cn}</div>
        <div class="loc-hint">${sub(op.hintCn,'cn')}</div>
      </div>`;
    b.onclick = ()=>{
      if(scheduleCommitted) return;
      scheduleCommitted = true;
      wrap.querySelectorAll('button').forEach(x=>x.disabled=true);
      $('overlay-schedule').classList.add('hidden');
      applyEffects(op.fx);
      S.loc = op.loc; updateHUD();
      // Commit the branch before entering its scene so reload cannot resurrect the previous event.
      curScene = null; curNode = null; sceneIsEnding = false;
      saveGame(true);
      startScene(op.scene);
    };
    wrap.appendChild(b);
  });
  $('overlay-schedule').classList.remove('hidden');
}

/* ---------------- status ---------------- */
function healthLabel(){
  const h = S.health;
  if(h < 55) return {en:'Frail', cn:'虚弱'};
  if(h < 70) return {en:'Recovering', cn:'康复中'};
  if(h < 88) return {en:'Improving', cn:'日渐好转'};
  return {en:'Almost Well', cn:'痊愈在即'};
}
function repLabel(){
  const r = S.reputation;
  if(r < 2) return {en:'Under Scrutiny', cn:'备受非议'};
  if(r < 5) return {en:'Under Observation', cn:'备受观望'};
  if(r < 8) return {en:'Warming Regard', cn:'渐获好感'};
  return {en:'Quietly Admired', cn:'暗受赞赏'};
}
function relStage(charId){
  const v = S.rel[charId];
  const sum = Object.values(v).reduce((a,b)=>a+b,0);
  const map = {
    alaric:  [ [2,'戒备 · Wary'], [5,'好奇 · Curious'], [9,'重新审视 · Reassessing'], [13,'渐生信任 · Trusting'], [99,'智识相契 · Kindred Mind'] ],
    roderic: [ [2,'敌意未消 · Hostile'], [5,'针锋相对 · Competitive'], [9,'刮目相看 · Respectful'], [13,'并肩之意 · Familiar'], [99,'意气相投 · Trusted'] ],
    damien:  [ [2,'公事公办 · Formal'], [5,'审慎评估 · Assessing'], [9,'私下在意 · Personally Invested'], [13,'破例相待 · Favoured'], [99,'推心置腹 · Confidant'] ],
    elise:   [ [2,'熟悉照料 · Familiar Care'], [6,'安心相伴 · Settling'], [10,'彼此依赖 · Mutual Trust'], [14,'家人般 · Family by Choice'], [99,'不可替代 · Irreplaceable'] ],
    lucien:  [ [2,'谨慎守望 · Guarded Care'], [5,'重新靠近 · Reconnecting'], [9,'父子/女相知 · Understanding'], [13,'托付之意 · Entrusting'], [99,'真正归家 · Home'] ]
  }[charId];
  let out = map[0][1];
  for(const [th,label] of map){ if(sum >= th) out = label; }
  return out;
}
/* ---------------- bonds (relationship UI) ---------------- */
const REL_FIELDS = {
  trust:{cn:'信任',en:'Trust'},           curiosity:{cn:'好奇',en:'Curiosity'},
  respect:{cn:'敬意',en:'Respect'},       intimacy:{cn:'亲密',en:'Intimacy'},
  rivalry:{cn:'较劲',en:'Rivalry'},       warmth:{cn:'温度',en:'Warmth'},
  political_trust:{cn:'政治信任',en:'Political Trust'},
  personal_trust:{cn:'私人信任',en:'Personal Trust'},
  reputation:{cn:'评价',en:'Regard'},     vulnerability:{cn:'软肋',en:'Vulnerability'},
};
const REL_CAP = 16;
function charMet(id){
  if(id === 'elise') return true;
  if(id === 'lucien') return S.day >= 2;
  return !!S.flags['met_' + id];
}
function bondCard(id){
  const c = CHARS[id];
  if(!charMet(id)){
    return `<div class="bond-card locked">
      <div class="bond-portrait silhouette">?</div>
      <div class="bond-main">
        <div class="rel-name">？？？</div>
        <div class="rel-stage">尚未谋面 · Not yet met</div>
      </div></div>`;
  }
  const stage = S.rel[id] ? relStage(id)
    : (id==='elise' ? '多年信赖 · Devoted' : '血脉 · Family');
  const vars = S.rel[id]
    ? `<div class="bond-vars">` + Object.entries(S.rel[id]).map(([f,v])=>{
        const meta = REL_FIELDS[f] || {cn:f, en:f};
        const pct = Math.max(2, Math.min(100, v / REL_CAP * 100));
        return `<div class="bond-var">
          <span class="bv-name">${meta.cn}<span class="en-line">${meta.en}</span></span>
          <span class="bv-bar"><i style="width:${pct}%"></i></span>
          <span class="bv-val">${v}</span></div>`;
      }).join('') + `</div>`
    : '';
  const traits = (c.traits||[]).map(t=>`<span class="trait">${t.cn} · ${t.en}</span>`).join('');
  const theme = c.theme ? `<div class="rel-theme">${c.theme.cn} · ${c.theme.en}</div>` : '';
  const mem = (S.memory && S.memory[id]) || [];
  const memHtml = mem.length
    ? `<div class="bond-mem"><span class="bm-label">TA 记得 · Remembers</span>${
        mem.map((m,mi)=>`<div class="bm-item">
          <span class="bm-imp" title="重要度 ${m.imp||2}">${'✦'.repeat(m.imp||2)}</span>
          <span class="bm-text"><span class="bm-kind">玩家表述 · Player statement</span>${m.cn}</span>
          <span class="bm-day">第${'一二三四五六七'[(m.day||1)-1]}日</span>
          <button class="bm-del" data-c="${id}" data-i="${mi}" title="删除这条记忆 · Delete">✕</button>
        </div>`).join('')}</div>`
    : '';
  return `<div class="bond-card">
    <img class="bond-portrait" src="${bondPortraitOf(c)}" alt="${c.en}" draggable="false">
    <div class="bond-main">
      <div class="rel-name"><span class="en-line">${c.en}</span>${c.cn}
        <span class="gender2">${c.gender2||''}</span></div>
      <div class="rel-title">${c.titleCn} · ${c.titleEn}</div>
      <div class="rel-stage">${stage}</div>
      ${theme}
      ${vars}
      <div class="trait-row">${traits}</div>
      <p class="bond-desc">${c.descCn}<span class="en-line bond-desc-en">${c.descEn}</span></p>
      ${memHtml}
    </div></div>`;
}

function openStatus(){
  const h = healthLabel(), r = repLabel();
  const rows = [
    ['康复 · Recovery', `${h.cn} · ${h.en}`],
    ['声望 · Reputation', `${r.cn} · ${r.en}`],
    ['记忆碎片 · Fragments', `${S.fragments.length} / ${Object.keys(FRAGMENTS).length}`],
  ].map(([k,v])=>`<div class="stat-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('');
  const bondCards = ['elise','lucien','alaric','roderic','damien'].map(bondCard).join('');
  const authorityNote = `<div class="state-authority-note">状态页只记录可观察状态、角色对 Nait 的关系倾向与已发生事件；不会替玩家定义 Nait 的感情、吸引、信任或身份真相。<span class="en-line">Status reports observable state and NPC disposition; it never defines Nait's feelings or identity truth.</span></div>`;
  const estate = S.flags.estate_tutorial_started ? `
    <div class="stat-section"><h3>ROSIER ESTATE · 领地</h3>
      <div class="estate-grid">
        <div><span>财政</span><b>${S.estate.treasury}</b></div>
        <div><span>领民福祉</span><b>${S.estate.welfare}</b></div>
        <div><span>家族声望</span><b>${S.estate.reputation}</b></div>
        <div><span>稳定</span><b>${S.estate.stability}</b></div>
        <div><span>宫廷影响</span><b>${S.estate.court_influence}</b></div>
        <div><span>家臣信任</span><b>${S.estate.staff_trust}</b></div>
      </div></div>` : '';
  $('status-body').innerHTML = `
    <div class="stat-section"><h3>NAIT ROSIER</h3>${rows}</div>
    ${authorityNote}
    ${estate}
    <div class="stat-section"><h3>羁绊 · BONDS</h3>${bondCards}</div>`;
  // memory pruning — the player can strike any record (canon hygiene)
  $('status-body').querySelectorAll('.bm-del').forEach(b=>{
    b.onclick = ev=>{
      ev.stopPropagation();
      const c = b.dataset.c, i = +b.dataset.i;
      if(S.memory && S.memory[c] && S.memory[c][i]){
        S.memory[c].splice(i, 1);
        saveGame(true);
        openStatus();
      }
    };
  });
  $('overlay-status').classList.remove('hidden');
}

/* ---------------- world map ---------------- */
function zoneUnlocked(zone){
  if(zone==='manor') return true;
  if(zone==='city') return !!S.flags.city_unlocked;
  if(zone==='outskirts') return !!S.flags.outskirts_unlocked;
  return false;
}
function openMap(){
  const zones = [
    {id:'manor',en:'Rosecourt Manor',cn:'Rosecourt 府邸',note:'Week 1 · 起始区域',locs:['bedroom','library','garden','training','sitting_room','duke_study']},
    {id:'city',en:'Royal City',cn:'王城',note:'Week 2 · Day 10 开放',locs:['market','academy','palace','conservatory','city_gate']},
    {id:'outskirts',en:'Outskirts',cn:'郊外',note:'Week 3 · Day 15 开放',locs:['old_road','estate_village','riverside']},
  ];
  $('map-body').innerHTML = zones.map(z=>{
    const on=zoneUnlocked(z.id);
    const chips=z.locs.map(k=>`<span class="map-loc-chip ${on?'':'locked'}">${on?LOCS[k].cn:'？？？'}</span>`).join('');
    return `<section class="map-zone ${on?'unlocked':'locked'}">
      <div class="map-zone-mark">${on?'✦':'◇'}</div>
      <div class="map-zone-main"><span class="en-line">${z.en}</span><h3>${on?z.cn:'未开放区域'}</h3>
      <p>${z.note}</p><div class="map-locs">${chips}</div></div></section>`;
  }).join('') + `<div class="map-free-note ${S.flags.full_map_unlocked?'on':''}">
      <span class="en-line">Free Travel</span>
      ${S.flags.full_map_unlocked ? '第四周：全地图自由行动已解锁（本试玩版在此结束）' : '前三周由剧情逐步开放地图；第四周开始可自由选择区域。'}
    </div>`;
  $('overlay-map').classList.remove('hidden');
}

/* ---------------- codex (lore database UI) ---------------- */
function openCodex(){
  const body = $('codex-body');
  body.innerHTML = Object.entries(LORE).map(([id,e])=>{
    if(!AI.loreUnlocked(e)) return `<div class="lore-item locked"><span class="lore-q">？ ？ ？</span></div>`;
    return `<button class="lore-item" data-id="${id}">
      <span class="en-line">${e.titleEn}</span>
      <span class="lore-title">${e.titleCn}</span>
      <span class="lore-body hidden">${e.image ? `<img class="lore-image" src="${e.image}" alt="${e.titleEn}" draggable="false">` : ''}<span class="lore-cn">${e.textCn}</span><span class="lore-en en-line">${e.textEn}</span></span>
    </button>`;
  }).join('');
  body.querySelectorAll('.lore-item:not(.locked)').forEach(el=>{
    el.onclick = ()=>el.querySelector('.lore-body').classList.toggle('hidden');
  });
  $('overlay-codex').classList.remove('hidden');
}

/* ---------------- save slots UI ---------------- */
function fmtSaveTime(ts){
  const d = new Date(ts), pad = n=>String(n).padStart(2,'0');
  return `${d.getMonth()+1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function slotLabel(p){
  const st = p.state, loc = LOCS[st.loc] || {cn:''};
  return `第${dayCn(st.day)}日 · ${periodText(st.period).cn} · ${loc.cn}`;
}
function openSaves(mode){   // 'save' | 'load'
  $('saves-title').textContent = mode==='save' ? '保存进度' : '读取进度';
  $('saves-title-en').textContent = mode==='save' ? 'Save' : 'Load';
  const all = loadAllSaves();
  const wrap = $('saves-body');
  wrap.innerHTML = '';
  [{kind:'auto', i:-1, p:all.auto, name:'自动存档 · Auto'}]
    .concat(all.slots.map((p,i)=>({kind:'slot', i, p, name:`存档 ${i+1} · Slot ${i+1}`})))
    .forEach(r=>{
      const div = document.createElement('div');
      const chk = r.p ? inspectSave(r.p) : null;
      div.className = 'slot-row' + (r.p ? (chk.ok ? '' : ' incompatible') : ' empty');
      div.innerHTML = `
        <div class="slot-info">
          <div class="slot-name">${r.name}</div>
          <div class="slot-desc">${r.p ? (chk.ok ? slotLabel(r.p) + ' · ' + fmtSaveTime(r.p.savedAt) + (chk.needsGender ? ' · 需确认性别' : '') : chk.reason) : '空 · Empty'}</div>
        </div>
        ${r.p ? '<button class="slot-del" title="删除 · Delete">✕</button>' : ''}`;
      const canAct = mode==='save' ? r.kind!=='auto' : !!r.p && chk.ok;
      if(canAct){
        div.classList.add('act');
        div.onclick = ev=>{
          if(ev.target.classList.contains('slot-del')) return;
          if(mode==='save'){ saveToSlot(r.i); toast('已保存 · Saved'); openSaves('save'); }
          else { $('overlay-saves').classList.add('hidden'); applySave(r.p); }
        };
      }
      const del = div.querySelector('.slot-del');
      if(del) del.onclick = ev=>{ ev.stopPropagation(); deleteSave(r.kind, r.i); openSaves(mode); };
      wrap.appendChild(div);
    });
  $('overlay-saves').classList.remove('hidden');
}

/* ---------------- memory ---------------- */
const MEMORY_KIND = {
  observed_fact:{cn:'已观察事实',en:'Observed fact'},
  npc_claim:{cn:'角色说法',en:'NPC claim'},
  player_belief:{cn:'玩家认知',en:'Player belief'},
  unresolved_clue:{cn:'未解线索',en:'Unresolved clue'},
  relationship_event:{cn:'关系事件',en:'Relationship event'},
  player_statement:{cn:'玩家表述',en:'Player statement'},
};

const INTERP = [
  {id:'forgotten', cn:'被遗忘的记忆', en:'Forgotten memory'},
  {id:'body',      cn:'身体的记忆',   en:'Body memory'},
  {id:'magic',     cn:'魔法异象',     en:'Magical anomaly'},
  {id:'unknown',   cn:'无从知晓',     en:'Unknown'},
];
function openMemory(){
  $('memory-dot').classList.add('hidden');
  const body = $('memory-body');
  if(!S || !S.fragments.length){
    body.innerHTML = `<div class="memory-empty">这里还空空如也。<br>Rosecourt remembers more than you do.<br>这座庄园，记得比你更多。</div>`;
  } else {
    body.innerHTML = S.fragments.map(fid=>{
      const f = FRAGMENTS[fid];
      const sel = S.interp[fid];
      const tags = INTERP.map(t=>
        `<button class="interp-tag ${sel===t.id?'sel':''}" data-f="${fid}" data-t="${t.id}">${t.cn}</button>`).join('');
      const mk = MEMORY_KIND[f.kind || 'unresolved_clue'];
      return `<div class="frag-card">
        <h4><span class="en-line">${f.titleEn}</span>${f.titleCn}</h4>
        <div class="frag-kind">${mk.cn} · ${mk.en}</div>
        <div class="frag-src">${f.srcCn} · ${f.srcEn}</div>
        <p>${f.descCn}</p>
        <p class="en-line" style="margin-top:6px;font-size:11.5px;text-transform:none;letter-spacing:.04em">${f.descEn}</p>
        <div class="interp"><span>你的解读（仅属于你，不代表真相）· Your reading — yours alone, never the truth</span>
          <div class="interp-tags">${tags}</div></div>
      </div>`;
    }).join('');
    body.querySelectorAll('.interp-tag').forEach(b=>{
      b.onclick = ()=>{
        const {f,t} = b.dataset;
        S.interp[f] = (S.interp[f]===t) ? undefined : t;
        saveGame(true); openMemory();
      };
    });
  }
  $('overlay-memory').classList.remove('hidden');
}

/* ---------------- ending ---------------- */
function showEnding(){
  saveGame(true);
  const labels={family:'亲情与家 · Family',alaric:'Alaric · Understanding',roderic:'Roderic · Action',damien:'Damien · Choice',ensemble:'大家一起 · Ensemble'};
  const lean=Object.entries(S.route||{}).sort((a,b)=>b[1]-a[1]);
  const top=lean[0] || ['family',0];
  const close=lean[1] && (top[1]-lean[1][1] <= 3);
  const tendency = close
    ? `${labels[top[0]]}<br><span style="font-size:12.5px;opacity:.8">倾向仍很开放 · Still exploring</span>`
    : `${labels[top[0]]}<br><span style="font-size:12.5px;opacity:.8">只是生活习惯的苗头，不锁线 · A tendency, not a route lock</span>`;
  const estate = S.flags.estate_tutorial_started
    ? `财政 ${S.estate.treasury} · 福祉 ${S.estate.welfare} · 稳定 ${S.estate.stability} · 家臣信任 ${S.estate.staff_trust}`
    : '尚未开始 · Not yet begun';
  const ident = S.flags.identity_continuity_hint ? '也许我就是 Nait · Continuity'
    : S.flags.identity_transference_hint ? '也许我是来自别处的人 · Transference'
    : S.flags.identity_self_defined ? '是不是 Nait 并不决定现在的我 · Self-defined'
    : '仍未定义 · Still open';
  $('ending-body').innerHTML = `
    <h2>Prototype Complete · Week 3</h2>
    <div class="end-title">三周之后</div>
    <div class="end-block"><h4>生活的倾向 · EMERGING PATH</h4><p>${tendency}</p></div>
    <div class="end-block"><h4>关于“我” · IDENTITY STANCE</h4><p>${ident}</p></div>
    <div class="end-block"><h4>第一次治理 · STEWARDSHIP</h4><p>${estate}</p></div>
    <div class="end-block"><h4>地图 · MAP</h4><p>Rosecourt 府邸 ✓　王城 ✓　郊外 ✓<br>第四周：全地图自由行动。</p></div>
    <div class="end-block"><h4>下一阶段 · WEEK FOUR</h4>
      <p>教程期结束。路线仍未锁定。接下来，你可以自由安排每天去哪里、和谁相处，以及把多少时间交给 Rosier 的领地。</p>
      <p class="en-line">Onboarding complete. No route is locked. Free travel begins next.</p>
    </div>
    <button class="btn-title" id="btn-again"><span class="en-line">Return to Title</span>回到标题</button>`;
  show('screen-ending');
  $('btn-again').onclick = ()=>{ refreshTitleSave(); show('screen-title'); };
}

/* ---------------- toast ---------------- */
let toastTimer = null;
function toast(msg){
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.add('hidden'), 2400);
}

/* ---------------- AI free chat (Contract §6) ----------------
   Session-only, never saved, never touches GameState (§9/§23). */
let talkChar = null;
let talkHist = [];

/* Long-term memory (§23): AI may only PROPOSE a recollection;
   the engine validates, dedups, resolves conflicts, and stores. */
function recordMemory(charId, sum){
  if(!S || !sum || !CHARS[charId]) return;
  S.memory = S.memory || {};
  let arr = S.memory[charId] = S.memory[charId] || [];
  // conflict handling: AI-proposed replacements, engine-validated
  // (indices already bounds-checked by AI.summarize; re-check anyway)
  if(Array.isArray(sum.replaces) && sum.replaces.length){
    arr = S.memory[charId] = arr.filter((_,i)=>
      !sum.replaces.some(r=>Number.isInteger(r) && r===i && r>=0 && r<arr.length));
  }
  // dedup: near-identical record → merge into the newer wording,
  // keep the higher importance (a repeated topic matters more)
  const dupIdx = arr.findIndex(m=>AI.similarity(m.cn, sum.cn) > 0.55);
  if(dupIdx >= 0){
    arr[dupIdx] = { en:sum.en, cn:sum.cn, kind:'player_statement', source:'optional_ai_chat', day:S.day,
                    imp:Math.min(3, Math.max(arr[dupIdx].imp || 2, sum.imp || 2)) };
  } else {
    arr.push({en:sum.en, cn:sum.cn, kind:'player_statement', source:'optional_ai_chat', day:S.day, imp:sum.imp || 2});
  }
  // eviction: importance first, oldest among ties (not plain FIFO)
  while(arr.length > 8){
    let worst = 0;
    for(let i=1;i<arr.length;i++)
      if((arr[i].imp || 2) < (arr[worst].imp || 2)) worst = i;
    arr.splice(worst, 1);
  }
  saveGame(true);
  toast(`${CHARS[charId].cn} 会记住这次谈话 · ${CHARS[charId].en} will remember this`);
}
function maybeSummarizeTalk(){
  const id = talkChar, hist = talkHist;
  talkChar = null; talkHist = [];
  if(!id || !hist.length) return;
  if(!window.AI || !AI.conf.enabled || !AI.conf.freechat || !AI.ready()) return;
  if(AI.stats.degraded) return;
  if(!hist.some(m=>m.who === 'player')) return;
  const existing = (S.memory && S.memory[id]) || [];
  AI.summarize(id, hist, existing).then(sum=>{ if(sum) recordMemory(id, sum); });
}
function closeTalk(){
  $('overlay-talk').classList.add('hidden');
  maybeSummarizeTalk();
}

function talkAvailable(){
  if(!S) return [];
  const list = ['elise'];
  if(S.day >= 2) list.push('lucien');
  ['alaric','roderic','damien'].forEach(id=>{ if(S.flags['met_'+id]) list.push(id); });
  return list;
}
function openTalk(){
  const pk = $('talk-picker');
  $('talk-panel').classList.add('hidden');
  pk.classList.remove('hidden');
  talkChar = null; talkHist = [];
  $('talk-log').innerHTML = '';
  const aiOff = !window.AI || !AI.conf.enabled || !AI.conf.freechat;
  if(aiOff || !AI.conf.key){
    pk.innerHTML = `<div class="talk-off">${
      aiOff
      ? 'AI 对话层未启用。<br>在「菜单 → 设置 → AI 对话层」中开启并填入你的 API Key，<br>即可与角色自由交谈。<br><span class="en-line" style="text-transform:none">AI layer is off — enable it in Settings.</span>'
      : 'AI 已启用，但还没有 API Key。<br>请在「菜单 → 设置 → AI 对话层」中填写。<br><span class="en-line" style="text-transform:none">Enabled, but no API key yet.</span>'
    }</div>`;
  } else {
    pk.innerHTML = '';
    talkAvailable().forEach(id=>{
      const c = CHARS[id];
      const b = document.createElement('button');
      b.className = 'talk-char';
      b.innerHTML = `<img src="${chatAvatarOf(c)}" alt="${c.en}" draggable="false">
        <div><span class="en-line">${c.en}</span><span class="cn">${c.cn}</span></div>`;
      b.onclick = ()=>startTalk(id);
      pk.appendChild(b);
    });
  }
  $('overlay-talk').classList.remove('hidden');
}
function appendTalk(who, payload){
  const log = $('talk-log');
  const div = document.createElement('div');
  div.className = 'talk-msg ' + who;
  if(who === 'npc') div.innerHTML = `<span class="en-line">${esc(payload.en||'')}</span><span class="cn">${esc(payload.cn||'')}</span>`;
  else div.textContent = payload;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
  return div;
}
async function startTalk(id){
  talkChar = id; talkHist = [];
  $('talk-picker').classList.add('hidden');
  $('talk-panel').classList.remove('hidden');
  $('talk-avatar').src = chatAvatarOf(CHARS[id]);
  $('talk-name').querySelector('.en-line').textContent = CHARS[id].en;
  $('talk-name').querySelector('.cn').textContent = CHARS[id].cn;
  $('talk-log').innerHTML = '';
  const typing = appendTalk('npc', {en:'· · ·', cn:'……'});
  typing.classList.add('typing');
  const r = await AI.freeChat(id, [], '(Nait approaches, wanting to talk for a while)');
  typing.remove();
  if(talkChar !== id) return;   // player left mid-generation — discard (§21)
  if(r){ talkHist.push({who:'npc', en:r.en, cn:r.cn}); appendTalk('npc', r); }
  else appendTalk('sys', '连接失败 · Connection failed — 请在设置中检查 API Key 与网络。');
}
async function sendTalk(){
  const inp = $('talk-input');
  const t = inp.value.trim();
  if(!talkChar || !t) return;
  inp.value = '';
  appendTalk('player', t);
  talkHist.push({who:'player', text:t});
  const id = talkChar;
  const btn = $('talk-send'); btn.disabled = true;
  const typing = appendTalk('npc', {en:'· · ·', cn:'……'});
  typing.classList.add('typing');
  const r = await AI.freeChat(id, talkHist.slice(0, -1), t);
  typing.remove(); btn.disabled = false;
  if(talkChar !== id) return;
  if(r){ talkHist.push({who:'npc', en:r.en, cn:r.cn}); appendTalk('npc', r); }
  else appendTalk('sys', '连接失败 · Connection failed — 请稍后再试，或检查设置。');
  inp.focus();
}

/* ---------------- boot ---------------- */
async function newGame(gender){
  S = freshState(gender);
  flowIndex = 0; curScene = null; curNode = null; sceneIsEnding = false;
  const all = loadAllSaves(); all.auto = null; writeAllSaves(all);
  await Promise.all([preloadImage('assets/bg/bedroom.webp'), preloadCharacterSprites()]);
  setInitialBG('bedroom');
  show('screen-game');
  warmBackgrounds();
  showDayCard(1, ()=>runFlow());
}
async function newPrototype(gender){
  // Documented, non-canonical developer preset representing a balanced completion of Week 1.
  // It deliberately avoids mutually-exclusive Week-1 choice flags so later scenes cannot infer choices the tester never made.
  S = freshState(gender);
  S.day = 8; S.period = 'morning'; S.loc = 'duke_study';
  Object.assign(S.flags,{
    prototype_jump:true,
    prototype_week1_balanced:true,
    met_alaric:true, met_roderic:true, met_damien:true,
    heard_roderic:true,
    estate_tutorial_started:false
  });
  S.health = 86; S.reputation = 5;
  S.rel.elise = {trust:5,warmth:5};
  S.rel.lucien = {trust:3,warmth:3};
  S.rel.alaric = {trust:3,curiosity:3,respect:2,intimacy:0,warmth:0};
  S.rel.roderic = {trust:2,respect:3,rivalry:3,warmth:1,intimacy:0};
  S.rel.damien = {political_trust:2,personal_trust:2,reputation:2,vulnerability:0};
  S.route = {family:0,alaric:0,roderic:0,damien:0,ensemble:0};
  S.identity = {continuity:0,transference:0,self_defined:0};
  S.responsibility = {high:0,measured:0,low:0};
  S.memory = {}; S.fragments = []; S.interp = {}; S.seen = {};
  flowIndex = FLOW.findIndex(s=>s.day===8);
  curScene = null; curNode = null; sceneIsEnding = false;
  const all = loadAllSaves(); all.auto = null; writeAllSaves(all);
  await Promise.all([preloadImage('assets/bg/sitting_room.webp'), preloadCharacterSprites()]);
  setInitialBG('sitting_room');
  show('screen-game');
  warmBackgrounds();
  toast('开发测试入口：已载入平衡版 Week 1 假定状态 · Non-canonical playtest preset');
  showDayCard(8, ()=>runFlow());
}

function boot(){
  migrateLegacySave();
  applySettings();
  refreshTitleSave();

  // gender cards
  const genders = [
    {id:'male',   cn:'男性', en:'He / Him', desc:'以「少爷 · young master」的身份被庄园迎接。'},
    {id:'female', cn:'女性', en:'She / Her', desc:'以「小姐 · my lady」的身份被庄园迎接。'},
    {id:'free',   cn:'不作定义', en:'They / Them', desc:'不愿被定义。庄园称你为「Nait 大人 · Lord Nait」。'},
  ];
  $('gender-cards').innerHTML = '';
  genders.forEach(g=>{
    const a = ADDR[g.id];
    const b = document.createElement('button');
    b.className = 'gender-card';
    b.innerHTML = `<span class="en-line">${g.en}</span><h3>${g.cn}</h3><p>${g.desc}</p><span class="addr">称呼 · ${a.cn} · ${a.en}</span>`;
    b.onclick = ()=>{
      const mode=startMode; startMode='normal';
      const sub = document.querySelector('#screen-gender .page-sub');
      if(sub) sub.textContent = 'Nait Rosier —— Rosier 家唯一继承人，第二性别固定为 Omega。性别与代词由你决定，并作为本存档的正式设定。';
      if(mode==='migrate-save') resumeLegacyGender(g.id);
      else if(mode==='prototype') newPrototype(g.id);
      else newGame(g.id);
    };
    $('gender-cards').appendChild(b);
  });

  $('btn-new').onclick = ()=>{ startMode='normal'; show('screen-gender'); };
  $('btn-prototype').onclick = ()=>{ startMode='prototype'; show('screen-gender'); };
  $('btn-continue').onclick = ()=>{
    const sv = loadSave();
    if(sv) applySave(sv);
  };
  $('btn-title-settings').onclick = openSettings;

  $('btn-status').onclick = openStatus;
  $('btn-map').onclick = openMap;
  $('btn-memory').onclick = openMemory;
  $('btn-talk').onclick   = openTalk;
  $('btn-menu').onclick  = ()=>$('overlay-menu').classList.remove('hidden');
  $('btn-save').onclick  = ()=>openSaves('save');
  $('btn-load').onclick  = ()=>openSaves('load');
  $('btn-codex').onclick = openCodex;
  $('btn-menu-settings').onclick = openSettings;
  $('btn-to-title').onclick = ()=>{
    saveGame(true);
    ['overlay-menu','overlay-status','overlay-memory','overlay-schedule','overlay-map','overlay-talk','overlay-saves','overlay-codex']
      .forEach(o=>$(o).classList.add('hidden'));
    maybeSummarizeTalk();
    refreshTitleSave(); show('screen-title');
  };

  document.querySelectorAll('.sheet-close').forEach(b=>{
    b.onclick = ()=>{
      $(b.dataset.close).classList.add('hidden');
      if(b.dataset.close === 'overlay-talk') maybeSummarizeTalk();   // summarize + drop in-flight
    };
  });

  $('set-en').onchange = e=>{ settings.en = e.target.checked; saveSettings(); };
  $('set-motion').onchange = e=>{ settings.motion = e.target.checked; saveSettings(); };

  /* AI settings (BYOK — stored locally, never leaves the browser except
     to the endpoint the player configured) */
  const aiFields = {enabled:'ai-enabled', endpoint:'ai-endpoint', key:'ai-key', rememberKey:'ai-remember-key',
                    model:'ai-model', freechat:'ai-freechat', react:'ai-react', flavor:'ai-flavor', debugIncludeText:'ai-debug-text'};
  Object.entries(aiFields).forEach(([k,id])=>{
    const el = $(id);
    if(el.type === 'checkbox') el.checked = !!AI.conf[k];
    else el.value = AI.conf[k] || '';
    el.onchange = ()=>{
      AI.conf[k] = el.type === 'checkbox' ? el.checked : el.value.trim();
      AI.saveConf();
    };
  });
  $('ai-test').onclick = async ()=>{
    const st = $('ai-test-status');
    AI.conf.endpoint = $('ai-endpoint').value.trim() || AI.conf.endpoint;
    AI.conf.key      = $('ai-key').value.trim();
    AI.conf.model    = $('ai-model').value.trim() || AI.conf.model;
    AI.saveConf();
    st.textContent = '连接中…'; st.className = 'pending';
    const r = await AI.test();
    st.textContent = r.msg; st.className = r.ok ? 'ok' : 'bad';
  };

  $('ai-forget-key').onclick = ()=>{
    AI.forgetKey();
    $('ai-key').value = '';
    $('ai-remember-key').checked = false;
    AI.conf.rememberKey = false;
    AI.saveConf();
    $('ai-test-status').textContent = 'API Key 已从本次会话与持久存储中清除。';
    $('ai-test-status').className = 'ok';
  };

  $('ai-debug-text').onchange = e=>{
    AI.conf.debugIncludeText = !!e.target.checked;
    AI.saveConf();
    $('ai-debug-preview').classList.add('hidden');
  };

  $('ai-preview-debug').onclick = ()=>{
    const pre = $('ai-debug-preview');
    pre.textContent = AI.exportLogs();
    pre.classList.toggle('hidden');
  };

  /* debug log export — ring buffer, never contains the API key */
  $('ai-export').onclick = ()=>{
    const blob = new Blob([AI.exportLogs()], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rosecourt_ai_debug.json';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
  };

  /* talk overlay wiring */
  $('talk-send').onclick = sendTalk;
  $('talk-input').addEventListener('keydown', e=>{
    if(e.key === 'Enter'){ e.preventDefault(); sendTalk(); }
  });
  $('talk-back').onclick = ()=>{ maybeSummarizeTalk(); openTalk(); };

  /* AI reliability: one toast when the circuit breaker trips;
     the game continues on authored text regardless (§21/§22) */
  window.addEventListener('ai-degraded', ev=>{
    toast('AI 暂时不可用（' + AI.errLabel(ev.detail) + '）——已切回剧本模式，剧情不受影响');
  });
}

/* settings opener — re-syncs fields from config and refreshes the AI status line */
function openSettings(){
  if(window.AI && AI.conf){
    const f = {enabled:'ai-enabled', endpoint:'ai-endpoint', key:'ai-key', rememberKey:'ai-remember-key',
               model:'ai-model', freechat:'ai-freechat', react:'ai-react', flavor:'ai-flavor', debugIncludeText:'ai-debug-text'};
    Object.entries(f).forEach(([k,id])=>{
      const el = $(id);
      if(el.type === 'checkbox') el.checked = !!AI.conf[k]; else el.value = AI.conf[k] || '';
    });
    const st = $('ai-state');
    if(AI.stats.degraded){
      st.textContent = 'AI 状态：已降级（' + AI.errLabel(AI.stats.degradedReason) + '）——测试连接成功可恢复';
      st.className = 'bad';
    } else if(AI.ready()){
      st.textContent = `AI 状态：待命 · ${AI.stats.calls} 次调用 · ${AI.stats.failures} 次失败`;
      st.className = 'ok';
    } else {
      st.textContent = 'AI 状态：未启用（游戏可完整游玩）';
      st.className = '';
    }
  }
  $('overlay-settings').classList.remove('hidden');
}
document.addEventListener('DOMContentLoaded', boot);
