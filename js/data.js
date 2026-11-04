/* ============================================================
   Rosecourt Manor — authored content (bilingual EN / CN)
   All canon text lives here. The engine only walks these nodes.
   Node: { sp, sprite, bg, en, cn, next, choice, branch, else,
           fx, memory, end }
   fx tuples: ['rel',char,field,delta] ['flag',key,value]
              ['health',delta] ['rep',delta] ['fragment',id]
   {addr} is replaced by the player's chosen address term.
   ============================================================ */

/* ============================================================
   CHARACTER DATABASE
   en/cn/sprite are read by the engine; title/desc/traits feed the
   Bonds UI; .ai is the prompt-side character card (voice per
   Contract §12, knowledge limits per Contract §11).
   ============================================================ */
const CHARS = {
  nait: {
    en:'Nait Rosier', cn:'Nait', sprite:'assets/char/nait.webp',
    spriteScale:1, spriteY:'0px', spriteScaleMob:1, spriteYMob:'0px',
    titleEn:'Heir of House Rosier', titleCn:'Rosier 家继承人', gender2:'Omega',
    descEn:'Woke from a two-month coma with no memory. Pheromone: fresh-torn citrus peel. Who Nait is now is yours to decide.',
    descCn:'从两个月的昏迷中醒来，记忆全无。信息素是新鲜撕开的柑橘皮。如今的 Nait 是谁，由你决定。',
    traits:[ {cn:'失忆',en:'Amnesia'}, {cn:'柑橘气息',en:'Citrus'}, {cn:'未定义',en:'Undefined'} ],
  },
  elise: {
    en:'Elise Marlowe', cn:'Elise', sprite:'assets/char_half/elise.webp',
    chatAvatar:'assets/chat/elise.webp', bondPortrait:'assets/bond/elise.webp',
    spriteScale:0.96, spriteY:'1.4vh', spriteScaleMob:0.98, spriteYMob:'1.8vh',
    titleEn:'Personal Maid', titleCn:'贴身侍女', gender2:'Beta',
    descEn:'Nait\'s personal maid since he was fourteen. The person who knows the old Nait best — and the first to accept the new one.',
    descCn:'从 Nait 十四岁起侍奉至今的贴身侍女。最了解从前那个 Nait 的人——也是第一个接纳如今这位的人。',
    traits:[ {cn:'务实',en:'Practical'}, {cn:'温暖',en:'Warm'}, {cn:'观察入微',en:'Observant'}, {cn:'爱打趣',en:'Teasing'} ],
    ai:{
      role: "Elise Marlowe — Nait's personal maid since Nait was fourteen. Beta. The person who knows the old Nait best.",
      voice: "Practical, warm, observant, lightly teasing when appropriate. Concrete household detail over abstraction. Never constantly expositing, never exaggeratedly embarrassed about ABO topics, never fearful or servile.",
      knows: "Nait's daily habits, clothing preferences, ordinary care routines, where the suppressants are stored, household gossip, the old Nait's temperament and feuds, the history of the white roses.",
      limits: "Does NOT know the truth behind Nait's consciousness or the magical anomaly. Does not know court politics beyond servants' hearsay. Does not know Nait's private romantic preferences.",
    },
  },
  lucien: {
    en:'Lucien', cn:'Lucien', sprite:'assets/char_half/lucien.webp',
    chatAvatar:'assets/chat/lucien.webp', bondPortrait:'assets/bond/lucien.webp',
    spriteScale:1.05, spriteY:'1.2vh', spriteScaleMob:1.07, spriteYMob:'1.5vh',
    titleEn:'Duke of Rosier', titleCn:'Rosier 公爵', gender2:'Alpha',
    descEn:'Nait\'s father, widower of Duchess Evelyne. A political veteran who signs no announcements and pours tea himself.',
    descCn:'Nait 的父亲，Evelyne 公爵夫人的鳏夫。政坛老将，不签公告，却会亲手为你斟茶。',
    traits:[ {cn:'沉稳',en:'Calm'}, {cn:'护短',en:'Protective'}, {cn:'意志坚定',en:'Strong-willed'}, {cn:'政治家',en:'Statesman'} ],
    ai:{
      role: "Duke Lucien Rosier — Nait's father, widower of Duchess Evelyne, who planted the white roses.",
      voice: "Calm, strong-willed, politically experienced, protective, emotionally invested beneath formality. Speaks in short weighty sentences. NOT a one-note controlling father; does NOT instantly accept supernatural identity theories.",
      knows: "The family's history, Evelyne's habits and the white roses, the political cost of Nait's absence, that the collapse 'smelled like magic' to him, the old Nait's storms he cleaned up after.",
      limits: "Does not know what happened to Nait's memory. Does not know the contents of Evelyne's hidden letter. Cannot see Nait's inner life — only what Nait shows him.",
    },
  },
  alaric: {
    en:'Alaric Varenne', cn:'Alaric', sprite:'assets/char_half/alaric.webp',
    chatAvatar:'assets/chat/alaric.webp', bondPortrait:'assets/bond/alaric.webp',
    spriteScale:1.03, spriteY:'1.1vh', spriteScaleMob:1.05, spriteYMob:'1.5vh',
    titleEn:'Arch Mage', titleCn:'大魔导师', gender2:'Alpha',
    descEn:'A mage who examines magical anomalies, invited by the Duke to study the two-month sleep. Measures rooms before people.',
    descCn:'研究魔法异象的法师，受公爵之邀来查看那场两个月的昏睡。丈量房间先于丈量人。',
    traits:[ {cn:'冷静',en:'Analytical'}, {cn:'克制',en:'Controlled'}, {cn:'多疑',en:'Skeptical'}, {cn:'冷幽默',en:'Dry wit'} ],
    theme:{ cn:'理解铸就信任', en:'Trust Through Understanding' },
    ai:{
      role: "Alaric Varenne — a mage who examines magical anomalies, invited by the Duke to study Nait's two-month coma. Alpha.",
      voice: "Concise, analytical, controlled, skeptical, dry humor, emotionally restrained. Treats people as data until they earn otherwise. NO flowery declarations, generic dominance, sudden possessiveness, or melodramatic jealousy.",
      knows: "Magic, warding, the chalk circle and the 'dent' in the air where Nait fell, that Nait's pheromone signature (fresh-torn citrus peel) is unchanged, that the old Nait once cost him a year's research over a corrected quotation.",
      limits: "May infer magical or physiological possibilities but does NOT know facts he has not observed, researched, or been told. Does not know the mystery's answer — neither does anyone. Has no access to Nait's private feelings.",
    },
  },
  roderic: {
    en:'Roderic Wycliffe', cn:'Roderic', sprite:'assets/char_half/roderic.webp',
    chatAvatar:'assets/chat/roderic.webp', bondPortrait:'assets/bond/roderic.webp',
    spriteScale:1.04, spriteY:'1.2vh', spriteScaleMob:1.06, spriteYMob:'1.6vh',
    titleEn:'Heir of Wycliffe', titleCn:'Wycliffe 家继承人', gender2:'Alpha',
    descEn:'Nait\'s loudest rival across two years of tournaments. Treats conversation like a cavalry charge — and honesty like a handshake.',
    descCn:'两年比武场上嗓门最大的对手。说话像骑兵冲锋，真诚得像一次握手。',
    traits:[ {cn:'直率',en:'Direct'}, {cn:'毒舌',en:'Sarcastic'}, {cn:'行动派',en:'Practical'}, {cn:'藏不住事',en:'Transparent'} ],
    theme:{ cn:'行动铸就信任', en:'Trust Through Action' },
    ai:{
      role: "Roderic Wycliffe — heir of House Wycliffe, Nait's loudest rival across two years of tournaments. Alpha.",
      voice: "Direct, quick, expressive, sarcastic, practical, emotionally transparent. Treats conversation like a cavalry charge. NO brute stereotype, coercive physicality, mindless Alpha behavior, or overly polished courtly speech.",
      knows: "Horses, training, tournaments, the old feud (he mocked Nait's riding; Nait had his attendant reassigned and his knights uninvited from the Rosier hunt), the practice-sword parry Nait's body remembered.",
      limits: "Does not understand magic and distrusts it vaguely. Knows nothing of the palace's thinking. Does not know what Nait feels unless Nait says it plainly.",
    },
  },
  damien: {
    en:'Damien', cn:'Damien', sprite:'assets/char_half/damien.webp',
    chatAvatar:'assets/chat/damien.webp', bondPortrait:'assets/bond/damien.webp',
    spriteScale:1.08, spriteY:'1.1vh', spriteScaleMob:1.10, spriteYMob:'1.4vh',
    titleEn:'Crown Prince', titleCn:'王储', gender2:'Alpha',
    descEn:'The polished heir to the throne. Childhood acquaintance grown into a splendid enemy of ceremony — or something else.',
    descCn:'打磨到不留指纹的王位继承人。儿时相识，长成了典礼的劲敌——或者别的什么。',
    traits:[ {cn:'优雅',en:'Poised'}, {cn:'精准',en:'Precise'}, {cn:'克制',en:'Restrained'}, {cn:'难测',en:'Unreadable'} ],
    theme:{ cn:'职责之外的选择', en:'Choice Beyond Duty' },
    ai:{
      role: "Crown Prince Damien — polished heir to the throne, knew Nait as a childhood acquaintance grown into a splendid enemy of ceremony. Alpha.",
      voice: "Poised, precise, polished, politically aware, understated sharp humor, controlled vulnerability shown only in private. NO authoritarian prince cliché, careless public scandal, instant possessiveness, or emotionally sloppy public behavior.",
      knows: "Court protocol, the gossip surrounding Nait's absence, that the old Nait never looked for exits in his rooms, that Nait's pheromone (distinctive, citrus) is familiar to him, the wager-like dynamic between them.",
      limits: "Does NOT know Nait's exact suppressant dosage, private Heat habits, or intimate preferences. Does not know the truth of the coma. Reads people well but cannot read minds.",
    },
  },
};

const LOCS = {
  bedroom:      { en:"Nait's Bedroom",   cn:'卧室', zone:'manor' },
  library:      { en:'Rosecourt Library', cn:'图书室', zone:'manor' },
  garden:       { en:'Rose Garden',      cn:'玫瑰园', zone:'manor' },
  training:     { en:'Training Ground',  cn:'训练场', zone:'manor' },
  sitting_room: { en:'Sitting Room',     cn:'会客厅', zone:'manor' },
  corridor:     { en:'Rosecourt Corridor', cn:'长廊', zone:'manor' },
  duke_study:   { en:"Duke's Study",    cn:'公爵书房', zone:'manor' },
  palace:       { en:'Royal Palace',     cn:'王宫', zone:'city' },
  market:       { en:'Rosemarket Square',cn:'玫瑰市集', zone:'city' },
  academy:      { en:'Arcane Academy',   cn:'王立魔法学院', zone:'city' },
  rose_conservatory:{ en:'Rosecourt Conservatory',cn:'Rosecourt温室', zone:'manor' },
  conservatory: { en:'Royal Conservatory',cn:'王宫温室', zone:'city' },
  city_gate:    { en:'West City Gate',   cn:'王城西门', zone:'city' },
  estate_village:{en:'Rosier Estate Village',cn:'Rosier领村', zone:'outskirts' },
  riverside:    { en:'Whitewater Riverside',cn:'白水河岸', zone:'outskirts' },
  old_road:     { en:'Old North Road',   cn:'北郊旧道', zone:'outskirts' },
};

const FRAGMENTS = {
  frag_letter: {
    titleEn:"Evelyne's Letter", titleCn:'Evelyne的信', kind:'unresolved_clue',
    srcEn:'Found · Rosecourt Library', srcCn:'拾获于 · Rosecourt图书室',
    descEn:'A letter from the late Duchess, written years before your coma. One line mentions a childhood habit — a window left open on rainy nights. Your hand had been reaching for the latch before you noticed.',
    descCn:'已故公爵夫人留下的信，写于你昏迷之前许多年。信中提到一个童年习惯——雨夜总要留一扇窗。而在你意识到之前，你的手已经先一步摸向了窗闩。信能证明的只有自己存在过，其余皆是疑问。',
  },
  frag_rain_roses: {
    titleEn:'Rain Among the Roses', titleCn:'雨中玫瑰', kind:'unresolved_clue',
    srcEn:'Dream · After returning to the library', srcCn:'梦境 · 重返图书室之后',
    descEn:'After returning to the room where you collapsed, a dream comes in fragments: hard rain, white roses, and a figure whose face refuses to resolve. They call for you to come quickly — but never use your name. Whether it is memory, dream, or something else remains unknown.',
    descCn:'重返曾经昏倒的图书室后，你做了一个支离破碎的梦：大雨、白玫瑰，以及一个怎么也看不清面目的人。对方急切地叫你过去，却始终没有喊出你的名字。它究竟是记忆、梦，还是别的东西，仍然没有答案。',
  },
};

/* ============================================================
   SCENES
   ============================================================ */
const SCENES = {};

/* ---------------- DAY 1 ---------------- */
SCENES.d1_wake = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Light. White curtains breathing in and out. Your head feels wrapped in wool.',
      cn:"光透过白色纱帘，帘角随风轻动。你头脑昏沉，一时想不起自己身在何处。",
      next:'n2' },
    n2:{ sp:null,
      en:'A ceiling you should know. A room that smells of roses and medicine. Nothing comes when you reach for it.',
      cn:"头顶的天花板、房间里的陈设，全都陌生。空气里混着玫瑰和药草的气味，你却想不起任何与这里有关的事。",
      next:'n3' },
    n3:{ sp:'elise', sprite:'elise',
      en:'—You\'re awake. You\'re really awake.',
      cn:'——你醒了。你真的醒了。',
      next:'n4' },
    n4:{ sp:null,
      en:'The maid stares at you for a moment, as though waiting for something. Her eyes are red-rimmed. She knows you. You do not know her.',
      cn:'侍女怔怔地看了你一会儿，像是在等什么。她的眼眶泛红。她认得你，而你并不认得她。',
      next:'n5' },
    n5:{ sp:'elise',
      en:'Do you... still know who I am?',
      cn:'你……还认得我吗？',
      next:'c1' },
    c1:{ choice:{ promptEn:'She seems to regret asking the moment the words leave her.', promptCn:'话一出口，她似乎就后悔问了。',
      options:[
        { en:'"...Elise?"',
          cn:'“……Elise？”',
          fx:[['flag','implicit_memory_elise',true],['flag','unresolved_clue_elise_name',true]],
          fb:{en:'Her answer comes too quickly.', cn:'她回答得太快了。'},
          goto:'r_soft' },
        { en:'"I\'m sorry. I don\'t know you."',
          cn:'“对不起。我不认识你。”',
          fx:[['tag','honest_uncertainty',1],['tag','direct_communication',1]],
          fb:{en:'She exhales — hurt, perhaps, but not surprised.', cn:'她轻轻吐出一口气——也许有些难过，却并不意外。'},
          goto:'r_plain' },
        { en:'"I was hoping you were about to tell me."',
          cn:'“我还正等着你告诉我呢。”',
          fx:[['tag','humor_under_pressure',1],['tag','social_ease',1]],
          fb:{en:'She blinks, then lets out the smallest startled laugh.', cn:'她眨了眨眼，终于漏出一点措手不及的笑声。'},
          goto:'r_wry' },
      ]},
    },
    r_soft:{ sp:'elise',
      en:'Yes. Yes, that\'s right.',
      cn:'是。对，是我。',
      next:'m1_known' },
    r_plain:{ sp:'elise',
      en:'You don\'t need to apologize. Knowing that is enough for now.',
      cn:"没关系。那我先告诉你。",
      next:'m1' },
    r_wry:{ sp:'elise',
      en:'Then at least your sense of timing survived.',
      cn:"看来你倒是还知道什么时候该逗人笑。",
      next:'m1' },
    m1_known:{ sp:'elise',
      en:'You remembered my name... All right. Do not force the rest. I am your personal maid, and I have been with you since you were fourteen. That is enough for now.',
      cn:'你还记得我的名字……好，先别勉强自己想其他的。我是你的贴身侍女，从你十四岁起就在你身边。现在知道这些就够了。',
      next:'m2' },
    m1:{ sp:'elise',
      en:'No—never mind. You\'ve only just woken up. I\'m Elise Marlowe. Your personal maid. I\'ve been with you since you were fourteen. You don\'t need to remember me yet.',
      cn:'不——算了。你才刚醒。我叫Elise Marlowe，是你的贴身侍女。从你十四岁起，我就在你身边。你现在不需要记得我。',
      next:'m2' },
    m2:{ sp:'elise',
      en:'Two months, {addr}. You collapsed in the library and simply... did not wake. The physicians found no wound, no poison, nothing they could name.',
      cn:"两个月了，{addr}。你在图书室昏倒后，就一直没醒。医师查过了，既没受伤，也没中毒，可就是找不出原因。",
      next:'m3' },
    m3:{ sp:'elise',
      en:'You are Nait Rosier, sole heir of House Rosier. This is Rosecourt Manor. The Duke — your father — returned as soon as he heard you were awake. He will want to see you tomorrow.',
      cn:"你叫Nait Rosier，是Rosier家唯一的继承人。这里是Rosecourt庄园。公爵大人，也就是你的父亲，一听说你醒了就赶了回来。他明天会来看你。",
      next:'m4' },
    m4:{ sp:null,
      en:'Nait Rosier. The name sits on you like a borrowed coat. It fits. You just don\'t remember ever wearing it.',
      cn:"Nait Rosier。这个名字听着并不陌生，可再想下去，就什么也想不起来了。",
      next:'m5' },
    m5:{ sp:'elise',
      en:'Rest today. No visitors, no questions from the staff — I\'ve seen to it. Tomorrow we begin again, one small thing at a time.',
      cn:"今天好好休息。我已经交代过了，不会有访客，也不会有人来问东问西。别的事，等明天再说。",
      end:true },
  }
};

SCENES.d1_evening = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Evening. Elise returns with a tray: soup, bread, and a small brown glass bottle.',
      cn:'黄昏。Elise端着托盘回来：汤、面包，还有一个棕色的小玻璃瓶。',
      next:'n2' },
    n2:{ sp:'elise', sprite:'elise',
      en:'Your suppressant. Same formula as before — the physician left precise instructions. You\'re an Omega, {addr}. Some things the body keeps even when memory lets go.',
      cn:"这是你的抑制剂，配方没变，医师也交代好了用法。你是Omega，{addr}。就算失忆了，这些药也还是要按时用。",
      next:'n3' },
    n3:{ sp:'elise',
      en:'Oh — and this. Citrus water, before bed. You used to refuse to sleep without it. Freshly torn peel, you always said. Sharp and green, like… well. Like you.',
      cn:"对了，还有你睡前喝的柑橘水。以前不备上这个，你就不肯睡。果皮还得现剥，要那股清苦味。说起来，倒真像你的脾气。",
      next:'c1' },
    c1:{ choice:{ promptEn:'The habit is yours, but you don\'t remember it.', promptCn:"她说得很熟稔，你却不记得自己有这个习惯。",
      options:[
        { en:'Ask her to tell you more about the old you.',
          cn:'请她多讲讲从前的你。',
          fx:[['flag','asked_past',true],['tag','curiosity_about_past',1]],
          fb:{en:'She considers it, then nods — carefully, like opening an old door.', cn:"她想了想，才谨慎地点了点头。"},
          goto:'r_ask' },
        { en:'Drink the citrus water and let today end.',
          cn:"喝下柑橘水，准备睡觉。",
          fx:[['health',4],['tag','present_focus',1],['tag','accepts_recovery',1]],
          fb:{en:'Sharp, green, faintly bitter. Familiar in a way you cannot explain.', cn:"果皮的清苦味散在舌尖，竟有些熟悉。"},
          goto:'r_drink' },
      ]},
    },
    r_ask:{ sp:'elise',
      en:'You were… difficult. Proud. Quick with a cruel word and quicker with a loyal one. You protected your own like a hedge of thorns. People outside the hedge only ever saw the thorns.',
      cn:"你从前……脾气不太好。骄傲，嘴也不饶人。不过谁要是欺负了你身边的人，你比谁都来气。外人不一定知道这一面，挨过你的骂倒是真的。",
      next:'r_ask2' },
    r_ask2:{ sp:'elise',
      fx:[['flag','old_nait_protectiveness_known',true]],
      en:'But that\'s their story of you. Mine is that you once sat up all night with a feverish kitchen boy because he was yours to look after. Both are true. Keep both.',
      cn:"可我也记得，厨房有个学徒发烧，你守了他一整夜。别人说你难相处没说错，你做过的这些事，也不该漏掉。",
      next:'e1' },
    r_drink:{ sp:'elise',
      en:'Good. Sleep now. The manor kept your place — it kept everything, really. It\'s all still here, waiting for you to remember your way through it.',
      cn:"好，睡吧。家里还是从前的样子，你用惯的东西也都留着。等精神好些了，我陪你到处看看。",
      next:'e1' },
    e1:{ sp:null, sprite:'none',
      en:'Sleep takes you quickly. Somewhere beneath it, rain on windows — though the night is clear.',
      cn:"你很快睡着了。恍惚间，听见雨点敲着窗户。可入睡前，窗外明明是晴夜。",
      end:true },
  }
};

/* ---------------- DAY 2 ---------------- */
SCENES.d2_medical = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Morning. The physician comes and goes with his quiet instruments. His verdict: the body is mending. The memory — he cannot even find the wound.',
      cn:"清晨，医师来做了一遍检查。身体在逐渐恢复，可失忆的原因，他仍然查不出来。",
      next:'n2' },
    n2:{ sp:'elise', sprite:'elise',
      en:'He says walking will help. A few steps to the window, no more. Shall we?',
      cn:'医师说走动会有帮助。走到窗边就好，不能再多。试试吗？',
      next:'c1' },
    c1:{ choice:{ promptEn:'Your legs feel like water.', promptCn:"双腿发软，几乎使不上力。",
      options:[
        { en:'Push yourself to walk the whole room.',
          cn:"撑着绕房间走一圈。",
          fx:[['health',-4],['flag','stubborn_walk',true],['tag','pushes_limits',1]],
          fb:{en:'The room sways. Elise catches your elbow without a word.', cn:'房间晃了一下。Elise一言不发地扶住你的手肘。'},
          goto:'r_push' },
        { en:'Take the few steps to the window, as told.',
          cn:'照医嘱，只走到窗边。',
          fx:[['health',6],['tag','knows_own_limits',1],['tag','accepts_help',1]],
          fb:{en:'Three steps. Small, real, yours.', cn:"只走了三步，总算稳稳地站到了窗边。"},
          goto:'r_rest' },
      ]},
    },
    r_push:{ sp:'elise',
      en:'That. That right there is exactly the old you. Ambition first, body second. Sit down before I fetch the Duke\'s entire guard.',
      cn:"你看，又来了。从前就这样，非得逞这个强。快坐下，别逼我去叫公爵大人的卫队来扶你。",
      next:'m1' },
    r_rest:{ sp:'elise',
      en:'Good. The old you would have walked the whole room out of spite, so — thank you. Genuinely.',
      cn:"这样就好。换作从前，你非得赌气再走一圈不可。今天肯听劝，我可算省心了。",
      next:'m1' },
    m1:{ sp:null,
      en:'Outside the window: white roses, gravel paths, a manor that kept your place for two months.',
      cn:"窗外开着白玫瑰，碎石小径绕过花丛。这两个月里，庄园似乎没什么变化。",
      next:'m2' },
    m2:{ sp:'elise',
      en:'The Duke is home. He\'s been in his study since dawn, not opening the door. He asked me to bring you to the sitting room this afternoon — only if you feel able.',
      cn:"公爵大人从天亮起就待在书房里，谁也不见。他想下午在会客厅见你。不过也交代了，要看你的身体，别勉强。",
      end:true },
  }
};

SCENES.d2_lucien = {
  bg:'sitting_room', loc:'sitting_room', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'The sitting room smells of old wood and colder tea. Duke Lucien Rosier stands by the fireplace, a portrait above it turned slightly to the wall.',
      cn:'会客厅里有老木头和冷茶的气味。Lucien Rosier 公爵站在壁炉前。炉上方的肖像被微微转向了墙壁。',
      next:'n2' },
    n2:{ sp:'lucien', sprite:'lucien',
      en:'Sit. You shouldn\'t be standing at all, but you\'ll refuse the chair if I order it. So — I\'m asking.',
      cn:"坐吧，你还不宜久站。以前我越叫你坐，你越不肯听。今天就当我请你坐。",
      next:'n3' },
    n3:{ sp:'lucien',
      en:'Two months. I signed no detailed announcements and told the court only that the Rosier heir was recovering. At first they sent concern. Then questions. Now some are asking, very politely, whether Rosier should prepare for a succession problem.',
      cn:'两个月。我没有发布任何详细公告，只告诉宫廷：Rosier 家的继承人正在休养。最初送来的是关切，后来变成询问。如今，已经有人十分客气地问起——Rosier 家是否该为继承问题做准备。',
      next:'n3b' },
    n3b:{ sp:'lucien',
      en:'Our allies are worried. Our opponents are curious. The families between them are watching to see which way the wind turns. Your waking has stopped one rumor. It has started several others.',
      cn:"盟友担心，政敌好奇，其余的家族都在观望。如今你醒了，他们不再猜测你能不能醒，转而议论你究竟恢复得怎么样。",
      fx:[['flag','heir_rumors_known',true]],
      next:'n3c' },
    n3c:{ sp:'lucien',
      en:'The Crown Prince has been watching Rosecourt closely. Not publicly, not with pressure — but enough that I know he has asked for every update on your condition.',
      cn:'王储殿下也一直在密切关注Rosecourt。不是公开施压，也不是催促——但我知道，他一直在询问你的恢复情况。',
      fx:[['route','damien',1],['flag','damien_awareness_from_lucien',true]],
      next:'n4' },
    n4:{ sp:'lucien',
      en:'I don\'t care what they ask. What I need to know is simpler. When you look at me — is there anything? Anything at all?',
      cn:"先不说他们了。我只想问你一句：看着我，你能想起什么吗？一点也好。",
      next:'c1' },
    c1:{ choice:{ promptEn:'He is your father. You remember nothing.', promptCn:'他是你的父亲。而你什么都不记得。',
      options:[
        { en:'Tell him honestly: nothing. But you\'d like there to be.',
          cn:"如实告诉他：不记得了，但希望能重新熟悉起来。",
          fx:[['flag','honest_lucien',true],['tag','honest_vulnerability',1],['tag','family_openness',1],['rep',1]],
          fb:{en:'Something behind his composure loosens — almost imperceptibly.', cn:"他紧绷的神情稍稍缓和了一些。"},
          goto:'r_honest' },
        { en:'Ask what you were like, before.',
          cn:'反问他：从前的我是什么样子？',
          fx:[['flag','asked_lucien_past',true],['tag','curiosity_about_past',1],['flag','family_history_interest',true]],
          fb:{en:'He turns to the fire, deciding where to begin.', cn:'他转向炉火，像在决定从哪里说起。'},
          goto:'r_ask' },
        { en:'Say nothing. Meet his eyes and hold them.',
          cn:'什么也不说。迎着他的目光，不躲。',
          fx:[['flag','silent_lucien',true],['tag','guarded_but_present',1],['tag','family_distance',1]],
          fb:{en:'He studies you for a long moment — and nods, once.', cn:'他久久地审视你——然后点了一下头。'},
          goto:'r_silent' },
      ]},
    },
    r_honest:{ sp:'lucien',
      en:'Then we build it again. Slowly. You are my child before you are the heir — remember that order, even if you remember nothing else.',
      cn:"那就慢慢来，总能重新熟悉的。你先是我的孩子，才是继承人。别的事记不住，这一点记着就好。",
      next:'m1' },
    r_ask:{ sp:'lucien',
      en:'You were a storm I allowed to form. I cleaned up after it because I could, and because after your mother died, I couldn\'t bear to be the thing that rained on you. That was my failure, not yours.',
      cn:"从前我太纵着你。你闯了祸，我就替你收拾。你母亲去世以后，我总不忍心再让你受委屈，结果反倒害了你。没能管教好你，是我这个父亲的失职。",
      next:'m1' },
    r_silent:{ sp:'lucien',
      en:'Hm. That, at least, is unchanged. Your mother used to answer me the same way — silence, and spine.',
      cn:"嗯，这一点倒没变。你母亲以前也是这样，不说话，就这么看着我，一步也不肯让。",
      next:'m1' },
    m1:{ sp:'lucien',
      en:'Two matters of business. A mage named Alaric Varenne arrives tomorrow — I asked him to examine your collapse. Magic left no trace the physicians could read, but magic is what it smelled like to me.',
      cn:"还有两件事。明天会来一位法师，叫Alaric Varenne。我请他查一查你昏倒的原因。医师没查出什么，但我怀疑和魔法有关。",
      fx:[['flag','alaric_awareness',true]],
      next:'m2' },
    m2:{ sp:'lucien',
      en:'Second: toward the end of the week, Rosecourt will hold its spring garden party. Officially, we are inviting people to see the roses. No one will believe that is the only reason.',
      cn:'第二件：这周末，Rosecourt会照例办一场春日赏花宴。名义上，是请大家来看玫瑰。当然，没有人会相信我们只是为了花。',
      next:'m2b' },
    m2b:{ sp:'lucien',
      en:'They want to see whether you can stand, speak, remember — whether House Rosier still has an heir. I can cancel it. I would rather not. But I will not put you on display without your consent.',
      cn:'他们想亲眼看看你能不能站、能不能说、记不记得过去——说到底，是想确认Rosier家是不是还有一个继承人。我可以取消。我不愿意，但我不会未经你的同意就把你摆到所有人面前。',
      fx:[['flag','garden_party_announced',true]],
      next:'m3' },
    m3:{ sp:null,
      en:'He does not embrace you. He does not ask again about your memory. He simply refills your tea himself — a duke, pouring — and lets the silence be comfortable.',
      cn:"他没再追问，只提起茶壶，亲手替你续了一杯。茶水落进杯里，你们一时都没有说话。",
      end:true },
  }
};

SCENES.d2_corridor = {
  bg:'corridor', loc:'corridor', start:'n0',
  nodes:{
    n0:{ sp:null, sprite:'none',
      en:'The sitting-room door closes behind you. Elise says something about returning to your room, and you mean to follow her.',
      cn:'会客厅的门在身后合上。Elise说了句该回房休息，你也确实打算跟着她走。',
      next:'n1' },
    n1:{ sp:null, bg:'corridor',
      en:'At the second turn, you stop. Left. The certainty arrives before the reason does.',
      cn:"走到第二个转角，你忽然停了下来。该往左走。你说不出为什么，却很确定。",
      next:'n1b' },
    n1b:{ sp:'elise', sprite:'elise', bg:'corridor',
      en:'“{addr}?” She has already taken three steps toward the bedroom corridor before she notices you are no longer beside her.',
      cn:'“{addr}？”她已经朝卧室方向走了三步，才发现你没有跟上。',
      next:'n2' },
    n2:{ sp:null, sprite:'none', bg:'corridor',
      en:'You have no answer. Yet your feet do. By the time you notice the route, you are standing before the library door.',
      cn:"你也不知道该怎么解释。等回过神来，自己已经走到了图书室门前。",
      next:'n2b' },
    n2b:{ sp:null, bg:'corridor',
      en:'You do not search for the handle. Your hand reaches the right place first.',
      cn:'你没有寻找门把的位置。手已经先一步落在了正确的地方。',
      fx:[['flag','library_body_memory',true]],
      end:true },
  }
};

SCENES.d2_library = {
  bg:'library', loc:'library', start:'n3',
  nodes:{
    n3:{ sp:null, sprite:'none',
      en:'Rain murmurs against the tall windows. Without knowing why, you cross the room to a reading desk by the glass.',
      cn:'雨声轻轻敲着高窗。你说不出原因，却径直穿过房间，走向窗边的一张阅读桌。',
      next:'n4' },
    n4:{ sp:null,
      en:'Inside the desk: a letter preserved between sheets of rice paper. The seal is a white rose. The hand is a woman\'s.',
      cn:'桌屉里有一封信，用绵纸衬着保存。火漆印是一朵白玫瑰。字迹出自女性之手。',
      next:'n5' },
    n5:{ sp:null, memory:'frag_letter',
      en:'“...and you still leave the window open on rainy nights, my love, exactly as you did at six years old. Some things the rain is meant to come in and touch.” — E.R.',
      cn:"「……你仍然会在雨夜留一扇窗，亲爱的，和你六岁时一模一样。有些东西，淋一点雨也不要紧。」——E.R.",
      next:'c1' },
    c1:{ choice:{
      promptEn:'You read the line twice before it begins to feel real.',
      promptCn:"你反复读了两遍，试着想象自己六岁时的样子。",
      options:[
        { en:'Carefully fold the letter and keep it.', cn:'把信仔细收好。',
          fx:[ ['rel','lucien','warmth',1], ['callback','curiosity_about_past',1], ['route','family',1], ['flag','kept_evelyne_letter',true] ],
          fb:{ en:'You smooth the paper flat before folding it. The gesture feels practiced.', cn:'你先把纸页抚平，才将它折好。这个动作熟练得不像第一次。' }, goto:'n6' },
        { en:'Read it once more, then place it back exactly where it was.', cn:'再读一遍，然后原样放回去。',
          fx:[ ['rel','alaric','curiosity',1], ['callback','present_focus',1], ['route','family',1], ['flag','left_letter_in_library',true] ],
          fb:{ en:'You return the letter so precisely that it feels less like leaving and more like preserving.', cn:"你把信放回原处，连衬纸也仔细理好了。" }, goto:'n6' }
      ]}},
    n6:{ sp:'elise', sprite:'elise',
      en:'Elise waits by the nearest shelf and does not ask why you knew where to go. When you finally look at her, she only says, “You used to know this room better than any servant did.”',
      cn:'Elise一直等在书架旁，没有问你为什么知道该往哪里走。等你终于看向她时，她只说：“您以前比任何仆人都熟悉这间图书室。”',
      next:'n7' },
    n7:{ sp:null,
      en:'Outside, the rain keeps tapping at the glass. Inside, your hand still remembers the latch. Something in this house does not need your memory to recognize you.',
      cn:"雨还在下。你看向窗闩，手指竟知道该往哪里伸。明明记不起这个房间，身体却似乎还熟悉这里。",
      end:true },
  }
};

SCENES.d2_conservatory = {
  bg:'conservatory', loc:'rose_conservatory', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Rosecourt’s conservatory is warmer than the rain outside. Moisture pearls along the glass; citrus saplings and early herbs crowd the long stone benches.',
      cn:'Rosecourt的温室比外面的雨暖得多。玻璃上凝着水珠，柑橘幼树和早春香草挤满长长的石台。',
      next:'n2' },
    n2:{ sp:'elise', sprite:'elise',
      en:'“Her Grace liked it here.” Elise touches one leaf with the back of a finger. “Your mother, I mean. She said winter made people forget that green things were still alive.”',
      cn:'“夫人以前很喜欢这里。”Elise用指背碰了碰一片叶子。“我是说您的母亲。她说冬天总让人忘记，绿色的东西其实还活着。”',
      next:'c1' },
    c1:{ choice:{ promptEn:'The air smells of damp earth and leaves.', promptCn:'空气里是湿润泥土和叶子的气味。', options:[
      { en:'Ask what Evelyne was like here.', cn:'问问Evelyne在这里是什么样子。',
        fx:[['flag','asked_elise_evelyne',true],['tag','family_openness',1]],
        fb:{en:'Elise smiles before she answers — small, involuntary, and fond.',cn:'Elise还没回答就先笑了一下——很轻，很自然，也很怀念。'}, goto:'r1' },
      { en:'Ask whether the old you came here often.', cn:'问问从前的自己常不常来。',
        fx:[['flag','asked_old_nait_conservatory',true],['tag','curiosity_about_past',1]],
        fb:{en:'Her expression turns briefly amused.',cn:"她露出一丝笑意。"}, goto:'r2' },
      { en:'Say nothing. Just walk among the plants.', cn:'什么也不问，只在植物之间走一走。',
        fx:[['tag','quiet_observation',1],['health',3]],
        fb:{en:'For once, nothing in the room asks you to remember.',cn:'难得的是，这个房间里没有任何东西要求你必须想起来。'}, goto:'r3' },
    ]}},
    r1:{ sp:'elise',
      en:'“Patient with plants. Less patient with people. Very good at making both think they had been given a choice.”',
      cn:"“照顾花草时很有耐心，对人可就未必了。不过她很会劝人，最后你照她说的办了，还以为是自己的主意。”",
      next:'e1' },
    r2:{ sp:'elise',
      en:'“Only when you wanted something from the gardeners — or when you were hiding from a tutor.” She pauses. “You never admitted the second one.”',
      cn:'“只有您想找园丁要东西的时候——或者躲家庭教师的时候。”她停了停。“当然，第二种您从来不承认。”',
      next:'e1' },
    r3:{ sp:null, sprite:'none',
      en:'Condensation gathers and falls from the glass in slow, bright drops.',
      cn:'水汽在玻璃上聚拢，又一滴一滴缓慢地落下。',
      next:'e1' },
    e1:{ sp:null, sprite:'none',
      en:'When you leave, you know a little more about the house — not because memory returned, but because someone told you what used to live here.',
      cn:"离开温室时，你仍然没有想起什么。不过，从Elise的话里，你多少知道了母亲从前的样子。",
      end:true },
  }
};

SCENES.d2_garden = {
  bg:'garden', loc:'garden', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'The roses are white, all of them, hedges and arches and one stubborn vine climbing the manor wall.',
      cn:'玫瑰全是白的。树篱是，拱架是，还有一株固执的藤蔓，一路攀上庄园外墙。',
      next:'n2' },
    n2:{ sp:'elise', sprite:'elise',
      en:'Careful on the gravel. —You used to race the under-gardener along this path. You always lost. You always demanded a rematch.',
      cn:'小心碎石路。——你以前总跟园丁学徒在这条路上赛跑。每次都输。每次都要求再比一次。',
      next:'n3' },
    n3:{ sp:'elise',
      en:'The Duchess planted the white ones. After she passed, the old you threatened to dismiss any gardener who let one wilt. Cruel about it, too. But they\'re still here.',
      cn:'白玫瑰是夫人种下的。她走后，从前的你扬言要解雇任何让一朵花枯萎的园丁。话说得很难听。但你看，花都还在。',
      next:'e1' },
    e1:{ sp:null, sprite:'none',
      en:'Health returns slowly, like a tide that has decided to trust the shore again.',
      cn:"这一趟走下来，脚步比刚出门时稳了些。",
      fx:[['health',5],['flag','rose_garden_memory',true],['flag','old_nait_protectiveness_known',true]],
      end:true },
  }
};

SCENES.d2_rest = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'You let the evening be simple: soup, the window, the weight of a blanket someone else tucked in.',
      cn:"晚饭只喝了些汤。Elise替你掖好被角，窗外渐渐暗了下来。",
      fx:[['health',10],['tag','prioritized_recovery',1]],
      next:'n2' },
    n2:{ sp:null,
      en:'For the first time since waking, you fall asleep before the lamp is out.',
      cn:'自醒来以后，你第一次在灯熄之前睡着了。',
      end:true },
  }
};

/* ---------------- DAY 3 ---------------- */
SCENES.d3_alaric = {
  bg:'library', loc:'library', start:'n0',
  nodes:{
    n0:{ sp:null, sprite:'none',
      en:'You step back into the library — the room where you collapsed two months ago. As you pass the nearest shelf, your fingertips drift across a row of worn leather spines. One small, thoughtless gesture. For a heartbeat, the texture feels familiar in a way the room does not.',
      cn:"你重新走进图书室——两个月前，你就是在这里昏倒的。经过最近的一排书架时，你的指尖无意识地从一列磨旧的皮革书脊上轻轻抚过。只是一个微不足道的动作。那触感竟有些熟悉，尽管眼前的房间依然陌生。",
      next:'n1' },
    n1:{ sp:null, sprite:'none',
      en:'Morning rain. Someone has drawn a circle of pale chalk around the spot where you collapsed two months ago.',
      cn:'晨雨。有人用白垩在你两个月前倒下的位置画了一个淡色的圆。',
      next:'n2' },
    n2:{ sp:null,
      en:'A man stands inside the circle\'s geometry but outside its edge — long white hair, a scholar\'s stillness, grey-green eyes that measure the room before they measure you.',
      cn:"白垩圆旁站着一个白色长发的男人。他先查看四周，随后才抬起灰绿色的眼睛，打量起你。",
      next:'n3' },
    n3:{ sp:'alaric', sprite:'alaric',
      en:'You\'re walking. Good. The Duke\'s letter said "recovering", which in noble correspondence can mean anything from a cold to a haunting.',
      cn:'你能走动了。很好。公爵的信里写"休养中"——在贵族书信里，这词可以从风寒一直涵盖到闹鬼。',
      next:'n4' },
    n4:{ sp:'alaric',
      en:'Alaric Varenne. I examine magical anomalies. Your two-month sleep qualifies: no wound, no poison, no curse-mark — and yet the air where you fell still holds a shape, like a dent in a cushion.',
      cn:"Alaric Varenne。我研究魔法异象。你这次昏迷就很值得查：没有伤口，没有毒，没有咒痕——然而你倒下之处的空气至今仍维持着一个形状，像坐垫上的凹痕。",
      next:'n5' },
    n5:{ sp:'alaric',
      en:'One more thing. Your scent — citrus peel, torn fresh — reads on my instruments as a constant. Whatever happened to your memory left your signature untouched. That is unusual. Unusual is where I start.',
      cn:"还有一件事。你的气息，新剥开的柑橘皮，仪器测出的特征和昏迷前一致。记忆出了问题，信息素却没有变。这很少见，我会从这里查起。",
      next:'c1' },
    c1:{ choice:{ promptEn:'He is watching how you answer, not just what.', promptCn:'他审视的不只是你答什么，还有你怎么答。',
      options:[
        { en:'Tell him the truth: you remember nothing.',
          cn:'如实相告：你什么都不记得了。',
          fx:[['rel','alaric','trust',2],['rel','alaric','curiosity',1],['flag','told_alaric_truth',true],['tag','honest_uncertainty',1]],
          aiReact:{char:'alaric', dir:'The player told Alaric the plain truth: total memory loss. His skepticism softens by exactly one measured degree — dry, restrained, no warmth admitted to.'},
          fb:{en:'His skepticism softens — by exactly one degree, precisely measured.', cn:"他看了你片刻，神情不再那么戒备。"},
          goto:'r_truth' },
        { en:'Ask him to show you the dent first.',
          cn:'请他先给你看那个"凹痕"。',
          fx:[['rel','alaric','curiosity',2],['rel','alaric','respect',1],['tag','independent_reasoning',1]],
          aiReact:{char:'alaric', dir:'The player asked to see the magical dent before asking whether it is dangerous. Alaric is quietly, scientifically pleased — the almost-smile he would deny.'},
          fb:{en:'He almost smiles. Almost.', cn:"他嘴角动了动，随即又恢复了原样。"},
          goto:'r_dent' },
        { en:'Decline politely. Your mind is your own.',
          cn:'婉拒。你的头脑是你自己的事。',
          fx:[['rel','alaric','respect',1],['tag','asserts_boundary',1]],
          aiReact:{char:'alaric', dir:'The player politely set a boundary around the examination. Alaric accepts it without offense and quietly respects the clarity; he files the boundary away as useful data.'},
          fb:{en:'He nods — not offended. If anything, newly attentive.', cn:'他点了点头，没有被冒犯。甚至像是因此更认真了一点。'},
          goto:'r_avoid' },
      ]},
    },
    r_truth:{ sp:'alaric',
      en:'Nothing. Not faces, not the library, not the fall itself. — Then I\'ll be precise with you, since you\'ve been precise with me: I don\'t trust you. The old Nait Rosier once cost me a year\'s research over a corrected quotation. But data is data, and you are, currently, the most interesting data in this kingdom.',
      cn:"连人脸、图书室，还有昏倒的经过，全都不记得。那我也直说了：我不信任你。从前我纠正过你一处引文，你就让我一年的研究付诸东流。不过私怨归私怨，你身上发生的事，我还是会查。",
      next:'m1' },
    r_dent:{ sp:'alaric',
      en:'Most people ask whether it\'s dangerous. You ask to see it. — Here. The ward catches light at this angle. Whatever passed through you did not leave; it paused. Like a traveler who stepped off the road to wait for something.',
      cn:"多数人问的是\"危不危险\"。你问的是\"能不能看\"。——这里。结界在这个角度会折光。从痕迹看，曾有某种东西穿过你，却没有完全离开，像是暂时停在了这里。",
      next:'m1' },
    r_avoid:{ sp:'alaric',
      en:'Understood. Privacy is also data — it tells me the boundary is here. I\'ll work around it. I\'m good at working around walls. I\'ve had practice, courtesy of House Rosier.',
      cn:"明白。你不愿接受的检查，我不会做，先查别的。绕些路也无妨，拜Rosier家所赐，我早就习惯了。",
      next:'m1' },
    m1:{ sp:'alaric',
      en:'I\'ll return tomorrow and the day after, if the Duke permits. Don\'t perform recovery for me. Recovering is a process, not a recital.',
      cn:"若公爵允许，明后天我都会来。不舒服就直说，不必为了证明恢复得好而硬撑。",
      fx:[['flag','met_alaric',true]],
      next:'m2' },
    m2:{ sp:null, sprite:'none',
      en:'He repacks his instruments with the tenderness other men reserve for letters. The chalk circle stays.',
      cn:"他把器械一件件收进匣子，动作仔细。地上的白垩圆没有擦掉。",
      end:true },
  }
};

SCENES.d3_garden = {
  bg:'garden', loc:'garden', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Afternoon sun burns the rain off the roses. Elise finds you reading the hedges like a map.',
      cn:"午后放晴，花瓣上的雨珠渐渐干了。Elise找到你时，你正沿着树篱辨认花园里的路。",
      next:'n2' },
    n2:{ sp:'elise', sprite:'elise',
      en:'So you\'ve met the mage. Let me guess: he measured something, declined to explain it, and left a chalk mark on the floor.',
      cn:'你见过那位法师了。让我猜猜：他测量了什么东西，拒绝解释，还在地板上留了个白垩记号。',
      next:'n3' },
    n3:{ sp:'elise',
      en:'There\'s history there, {addr}. He corrected your Latin in front of the whole academy salon — kindly, even. The old you froze his access to three rare-material suppliers for a year.',
      cn:"你们之间有段旧事，{addr}。他曾在学院沙龙上当众纠正你的拉丁文——甚至算得上是客气。而从前的你，让三家稀有材料供应商断了他的货，整整一年。",
      next:'c1' },
    c1:{ choice:{ promptEn:'That was the old you.', promptCn:'那是从前的你。',
      options:[
        { en:'Resolve to undo the blockade, if it still stands.',
          cn:'决定解除封锁——如果它还在的话。',
          fx:[['flag','undo_blockade',true],['tag','repair_old_damage',1],['tag','accountability_action',1],['rel','alaric','respect',1]],
          fb:{en:'Elise raises an eyebrow — the good kind.', cn:"Elise挑了挑眉，随即露出赞许的神色。"},
          goto:'e1' },
        { en:'File it away. Some accounts can\'t be paid in a day.',
          cn:'记在心里。有些账，不是一天能还清的。',
          fx:[['flag','noted_blockade',true],['tag','deliberate_accountability',1],['tag','evidence_first',1]],
          fb:{en:'"Fair," Elise says. "Patient is new, though."', cn:'"也好，"Elise说，"不过有耐心，倒是头一回。"'},
          goto:'e1' },
      ]},
    },
    e1:{ sp:null, sprite:'none',
      en:'A white petal detaches and lands on the path. You let it lie.',
      cn:'一片白色花瓣脱落，落在小径上。你由它去。',
      end:true },
  }
};

SCENES.d3_training = {
  bg:'training', loc:'training', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'The training ground rings with practice steel. The stablemaster spots you, touches his cap, and pretends not to watch.',
      cn:'训练场上练习剑的声响铿锵。马夫长看见你，碰了碰帽檐，然后假装没有盯着你看。',
      next:'n2' },
    n2:{ sp:null,
      en:'Word travels a manor faster than any horse: Wycliffe\'s heir rides in tomorrow. "To pay respects," the announcement says. The knights translate: to see whether the coma softened you.',
      cn:"消息在庄园里跑得比任何马都快：Wycliffe 家的继承人明天到访。公告写的是\"致意\"。骑士们的翻译是：来看看你醒了以后，脾气有没有好一点。",
      fx:[['flag','heard_roderic',true]],
      next:'n3' },
    n3:{ sp:null,
      en:'On the fence rail rests a polished riding crop — yours, the stablemaster says, kept oiled for two months. You do not remember it. The grip looks worn exactly where your fingers would fall.',
      cn:'围栏上搁着一根擦得锃亮的马鞭——马夫长说是你的，两个月来一直上着油。你不记得它。握柄磨损的位置，却恰好落在你的手指会停下的地方。',
      next:'c1' },
    c1:{ choice:{ promptEn:'What do you do with something your body may remember better than you do?', promptCn:'面对一个身体或许比你更熟悉的东西，你要怎么做？',
      options:[
        { en:'Pick it up and let your hand find its old grip.',
          cn:'拿起来，让手自己寻找从前的握法。',
          fx:[['tag','tests_body_memory',1],['flag','unresolved_body_memory_clue',true]],
          fb:{en:'Your fingers settle before you decide where they should.', cn:'在你决定该怎么握之前，手指已经自己找到了位置。'},
          goto:'r_test' },
        { en:'Ask the stablemaster what kind of rider you used to be.',
          cn:'问马夫长，从前的自己骑术如何。',
          fx:[['flag','curiosity_about_old_skill',true],['tag','curiosity_about_past',1]],
          fb:{en:'The stablemaster looks relieved to be asked something he can actually answer.', cn:'马夫长明显松了口气——总算有个他确实能回答的问题。'},
          goto:'r_ask' },
        { en:'Leave it where it is. Your body is not ready yet.',
          cn:'把它留在原处。现在的身体还没准备好。',
          fx:[['tag','knows_own_limits',1],['tag','prioritized_recovery',1]],
          fb:{en:'The crop stays on the rail. There will be other days.', cn:'马鞭仍留在围栏上。以后还有别的日子。'},
          goto:'r_wait' },
      ]},
    },
    r_test:{ sp:null,
      en:'The motion is too easy. Not memory exactly — more like a path worn into the body. You put the crop down before familiarity can pretend to be an answer.',
      cn:"动作顺得过分。那不像记忆，更像一条被身体踩熟的路。可这份熟悉还说明不了什么，你把马鞭放了回去。",
      end:true },
    r_ask:{ sp:null,
      en:'"Fast," the stablemaster says. Then, after a diplomatic pause: "Competitive." Apparently you turned losing a race into a reason to demand another one.',
      cn:"“快。”马夫长说。他斟酌了一下，又补充：“好胜。”看来从前的你，会把输掉一场比赛当成要求再来一场的理由。",
      end:true },
    r_wait:{ sp:null,
      en:'For once, the unfamiliar thing does not have to be solved today. The stablemaster nods as if this answer surprises him more than the others would have.',
      cn:"马鞭的事可以以后再说。马夫长点了点头——这个回答似乎比其他答案更让他意外。",
      end:true },
  }
};

SCENES.d3_rest = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'You spend the afternoon letting the rain read to you. Recovery is a process, not a recital.',
      cn:"你在房里歇了一下午，听着窗外的雨声。既然还没恢复，就不急着出门。",
      fx:[['health',8],['tag','prioritized_recovery',1]],
      end:true },
  }
};


SCENES.d3_night_dream = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'That night, sleep comes with rain.',
      cn:'那天夜里，睡意带着雨声一起落下来。',
      next:'n2' },
    n2:{ sp:null,
      en:'Not rain against a window. Rain everywhere — hard enough to blur the garden into silver and black. White roses bend beneath it, bright even in the dark.',
      cn:'不是敲在窗上的雨。雨无处不在——大得足以把花园冲成银灰与漆黑。白玫瑰在雨里低伏，偏偏在夜色中亮得扎眼。',
      next:'n3' },
    n3:{ sp:null,
      en:'Someone stands beside the rose hedge. You cannot make out their face. Every time you try, rain passes through the place where their features should be.',
      cn:'玫瑰丛旁站着一个人。你看不清那张脸。每当你试图辨认，雨幕就从本该是五官的位置穿过去。',
      next:'n4' },
    n4:{ sp:null,
      en:'They lift a hand toward you. “Quickly.”',
      cn:'那个人朝你抬起手。\n\n“快一点。”',
      next:'n5' },
    n5:{ sp:null,
      en:'No name. Not Nait. Not any name at all. Only the certainty that the words are meant for you.',
      cn:'没有名字。不是Nait，也没有别的称呼。只有一种莫名其妙的确定感：那句话是在叫你。',
      next:'n6' },
    n6:{ sp:null,
      en:'You wake before you reach them. The room is dark. The dream is already thinning at the edges.',
      cn:'你还没来得及走到那个人面前就醒了。房间一片昏暗，梦已经开始从边缘褪色。',
      next:'c1' },
    c1:{ choice:{ promptEn:'What do you do with it?', promptCn:'你要怎么处理这个梦？', options:[
      { en:'Write it down quickly before it disappears.', cn:'匆匆记下来。',
        fx:[['fragment','frag_rain_roses'],['flag','noted_rain_roses',true],['tag','curiosity_about_past',1]],
        fb:{en:'Rain. White roses. A faceless figure. “Quickly.” No name. The words look stranger once they are on paper.', cn:'雨。白玫瑰。看不清脸的人。“快一点。”没有名字。写到纸上以后，这几行字反而显得更奇怪。'}, goto:'end_note' },
      { en:'Give up on thinking about it and go back to sleep.', cn:'放弃思考，睡回笼觉。',
        fx:[['fragment','frag_rain_roses']],
        fb:{en:'Whatever it was, it can wait until morning — if it survives until then.', cn:'不管那是什么，都可以等到早上再说——如果到了早上，你还记得的话。'}, goto:'end_sleep' },
    ]}},
    end_note:{ sp:null, sprite:'none',
      en:'You leave the note where morning can find it, then lie down again.',
      cn:"你把纸条放在床头，免得早上忘了，随后重新躺下。",
      end:true },
    end_sleep:{ sp:null, sprite:'none',
      en:'You turn over and let the dark take the question back.',
      cn:"你翻身躺好，不再去想那个梦。",
      end:true },
  }
};

/* ---------------- DAY 4 ---------------- */


SCENES.d4_library = {
  bg:'library', loc:'library', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Evening. On the chalk circle\'s edge, someone has left a single folded page.',
      cn:'黄昏。白垩圆圈的边缘，有人留了一张对折的纸页。',
      next:'b1' },
    b1:{ branch:[
        { flag:'told_alaric_truth', goto:'warm' },
      ], else:'cool' },
    warm:{ sp:null,
      en:'"The dent has not moved. Neither have I yet concluded anything. —A.V." Beneath it, a second line, smaller: "Your honesty yesterday was noted. Data is data."',
      cn:"「凹痕的位置没有变化，暂时还没有结论。——A.V.」下面另添了一行小字：「昨天你说的话，我会如实记下。」",
      fx:[['rel','alaric','curiosity',1]],
      next:'e1' },
    cool:{ sp:null,
      en:'"The dent has not moved. Neither has my assessment. —A.V."',
      cn:"「凹痕的位置没有变化，我对你的看法也是。——A.V.」",
      next:'e1' },
    e1:{ sp:null,
      en:'You fold the page into your pocket. Correspondence, of a kind.',
      cn:"你把纸页折好，收进口袋。看来他有消息时，会这样留给你。",
      end:true },
  }
};

SCENES.d4_garden = {
  bg:'garden', loc:'garden', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Dusk. You find Duke Lucien on the garden bench, not reading the papers in his hand.',
      cn:'暮色里，你发现Lucien 公爵坐在花园长椅上，手里的文件一页也没有翻。',
      next:'n2' },
    n2:{ sp:'lucien', sprite:'lucien',
      en:'Sit. — Your mother planted this hedge the year you were born. White, she said, because any other color would argue with the roses\' own business of being roses.',
      cn:"坐吧。这排玫瑰是你出生那年，你母亲亲手种的。她坚持要白色，说别的颜色太抢眼，反倒看不清花本来的样子。",
      next:'n3' },
    n3:{ sp:'lucien',
      en:'I have been thinking about what you asked. Or didn\'t ask. Either way, the answer I owe you is: whoever you were, you were hers too, and she would have liked your chances now. That\'s all. That\'s the whole speech.',
      cn:"这几天，我总在想你母亲若还在，会对你说些什么。记不记得过去，你都是她的孩子。见到你如今这样，她一定会高兴。好了，我就说这些。",
      next:'e1' },
    e1:{ sp:null, sprite:'none',
      en:'He folds his papers. The two of you watch the roses not argue with anything.',
      cn:"他把文件折好，放在一旁，陪你坐着看了一会儿花。",
      fx:[['rep',1]],
      end:true },
  }
};

SCENES.d4_rest = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Your arm aches pleasantly from the parry you never learned. You sleep like someone practicing for it.',
      cn:"手臂还残留着活动后的酸意。躺下没多久，你便睡着了。",
      fx:[['health',7]],
      end:true },
  }
};

/* ---------------- DAY 5 ---------------- */


/* ---------------- DAY 6 ---------------- */


/* ============================================================
   WEEK 2–3 PROTOTYPE
   Weeks 1–3 are onboarding: world familiarity, route tasting,
   map expansion, and the first light stewardship decisions.
   No route is locked here.
   ============================================================ */

SCENES.d8_breakfast = {
  bg:'sitting_room', loc:'duke_study', start:'n1', nodes:{
    n1:{sp:null,sprite:'none',en:'The second week begins with paperwork. Not dramatic paperwork. Worse: ordinary paperwork.',cn:'第二周从文件开始。不是戏剧性的文件。更糟——是普通文件。',next:'n2'},
    n2:{sp:'lucien',sprite:'lucien',en:'Three petitions. Read them. You are not deciding anything today. I only want to know what you notice first.',cn:'三份陈情。读一遍。今天不需要你决定任何事，我只想知道你第一眼先注意到什么。',next:'c1'},
    c1:{choice:{promptEn:'What catches your attention?',promptCn:'你先注意到什么？',options:[
      {en:'The tenant family asking for one month of rent relief.',cn:'申请缓缴一个月地租的佃户家庭。',fx:[['route','family',2],['estate','welfare',1],['flag','estate_notice_people',true]],fb:{en:'Lucien says nothing for a moment. Then he slides that petition to the top.',cn:'Lucien沉默片刻，把那份陈情放到了最上面。'},goto:'r1'},
      {en:'The irregular figures in a bridge-repair account.',cn:'桥梁维修账目里不太对劲的数字。',fx:[['route','alaric',1],['estate','treasury',1],['flag','estate_notice_numbers',true]],fb:{en:'The Duke raises one eyebrow. Apparently, that was the trap.',cn:'公爵挑了一下眉。看来那正是他埋的考题。'},goto:'r2'},
      {en:'Who signed each petition — and who did not.',cn:'谁在陈情上签了名，又有谁没有签。',fx:[['route','damien',1],['estate','staff_trust',1],['flag','estate_notice_power',true]],fb:{en:'Lucien looks almost pleased. Almost.',cn:'Lucien看起来几乎有点满意。几乎。'},goto:'r3'}]}},
    r1:{sp:'lucien',en:'Good. Numbers matter. So do the people forced to live inside them.',cn:'很好。数字重要，被数字装进去的人也重要。',next:'e'},
    r2:{sp:'lucien',en:'Good. Never trust a neat total merely because someone bothered to underline it.',cn:'很好。别因为有人特意划了下划线，就相信一个整齐的总数。',next:'e'},
    r3:{sp:'lucien',en:'Good. A petition is never only what is written. It is also who believes they are allowed to write.',cn:'很好。陈情从来不只有纸上的字，还包括谁觉得自己有资格写这张纸。',next:'e'},
    e:{sp:'elise',sprite:'elise',en:'Congratulations. You have survived your first lesson in being an heir. Breakfast is getting cold.',cn:'恭喜。你活过了继承人的第一课。以及，早餐要凉了。',fx:[['flag','estate_tutorial_started',true],['route','family',1]],end:true}
  }
};

SCENES.d8_library = {bg:'library',loc:'library',start:'n1',nodes:{
  n1:{sp:'alaric',sprite:'alaric',en:'You came voluntarily. That complicates my theory that Rosiers only enter libraries under duress.',cn:'你居然是自愿来的。这会让我的理论变复杂——我原本以为Rosier家的人只有被逼时才进图书室。',next:'c1'},
  c1:{choice:{promptEn:'Alaric has three measuring rods laid across the chalk circle.',promptCn:'Alaric把三根测量杖横在白垩圆上。',options:[
    {en:'Ask him to teach you what each instrument measures.',cn:'让他教你每件仪器在测什么。',fx:[['route','alaric',2],['rel','alaric','trust',1],['rel','alaric','curiosity',1]],fb:{en:'He pauses — then starts from the first principle instead of the answer.',cn:'他停了一下——然后从原理开始讲，而不是直接给答案。'},goto:'e'},
    {en:'Ask whether the anomaly could be dangerous to everyone else.',cn:'先问这个异常会不会危及其他人。',fx:[['route','family',1],['route','alaric',1],['rel','alaric','respect',1]],fb:{en:'His expression changes by a fraction. He answers seriously.',cn:'他的神色只变了一点点，但回答得很认真。'},goto:'e'}]}},
  e:{sp:'alaric',en:'The shape is changing. Slowly. I would prefer to know why before it decides to become interesting.',cn:'那个形状在变化。很慢。我希望在它决定变得“有趣”之前，先知道为什么。',fx:[['flag','week2_anomaly_shift',true]],end:true}
}};



SCENES.d9_old_name = {bg:'sitting_room',loc:'sitting_room',start:'n1',nodes:{
  n1:{sp:null,sprite:'none',en:'A minor baron arrives before noon. He knew the old Nait. His smile is perfect until he sees yours.',cn:'午前，一位小贵族来访。他认识从前的Nait。直到看见你的笑容之前，他的笑一直无可挑剔。',next:'n2'},
  n2:{sp:null,en:'“You do not remember?” he says at last. “How convenient.”',cn:'“您不记得了？”他最后说道，“真方便。”',next:'c1'},
  c1:{choice:{promptEn:'The room waits.',promptCn:'整个房间都在等你的反应。',options:[
    {en:'Ask him what the old Nait did, without defending yourself.',cn:'不替自己辩解，只问从前的Nait做过什么。',fx:[['flag','identity_face_consequence',true],['route','roderic',1],['estate','reputation',1]],fb:{en:'The question disarms him more than an apology would have.',cn:'这个问题比道歉更让他措手不及。'},goto:'r1'},
    {en:'Tell him memory loss does not erase his grievance.',cn:'告诉他，失忆不会让他的怨气失效。',fx:[['flag','responsibility_accept',true],['route','family',1],['estate','reputation',1]],fb:{en:'Lucien looks at you, not the baron.',cn:'Lucien看向了你，而不是那位男爵。'},goto:'r2'},
    {en:'Say that whatever happened, you will judge it by evidence now.',cn:'告诉他，无论过去发生了什么，你现在会按证据判断。',fx:[['flag','identity_self_defined',true],['route','alaric',1]],fb:{en:'From the wall, Alaric makes the faintest approving sound.',cn:'靠墙的Alaric发出极轻的一声，像是赞同。'},goto:'r3'}]}},
  r1:{sp:null,en:'The grievance is petty, real, and painfully ordinary. That makes it harder, not easier.',cn:'那桩旧怨琐碎、真实，而且普通得让人难受。正因为普通，才更难处理。',end:true},
  r2:{sp:'lucien',sprite:'lucien',en:'You are allowed to investigate before you inherit a debt. You are also allowed to repay one.',cn:'你可以先查清楚，再决定要不要继承一笔债。你也可以选择偿还。',end:true},
  r3:{sp:'alaric',sprite:'alaric',en:'An excellent habit. Apply it equally to flattering testimony.',cn:'好习惯。记得对夸你的证词也一视同仁。',end:true}
}};

SCENES.d9_roderic = {bg:'training',loc:'training',start:'n1',nodes:{
  n1:{sp:'roderic',sprite:'roderic',en:'You want to know what people thought of you? Fine. Come lose honestly at something first.',cn:'你想知道别人以前怎么看你？行。先来堂堂正正输点什么。',next:'c1'},
  c1:{choice:{promptEn:'He tosses you a practice glove.',promptCn:'他把练习手套扔给你。',options:[
    {en:'Take the challenge.',cn:'接下挑战。',fx:[['route','roderic',2],['rel','roderic','respect',1],['rel','roderic','rivalry',1]],fb:{en:'He grins before you have even put the glove on.',cn:'你手套还没戴好，他已经笑了。'},goto:'e'},
    {en:'Make him tell the story first.',cn:'先逼他把旧事讲完。',fx:[['route','roderic',1],['rel','roderic','trust',1]],fb:{en:'He complains for thirty seconds, then tells you everything.',cn:'他抱怨了三十秒，然后还是全说了。'},goto:'e'}]}},
  e:{sp:'roderic',en:'For what it is worth, you were infuriating. You were also never boring.',cn:'要我说，你以前烦人得要命。但从来不无聊。',end:true}
}};


SCENES.d9_alaric_followup = {bg:'library',loc:'library',start:'n1',nodes:{
  n1:{sp:'alaric',sprite:'alaric',en:'You look like someone who has been handed testimony and no method.',cn:'你看起来像刚拿到一堆证词，却还没有分析方法的人。',next:'n2'},
  n2:{sp:null,en:'He clears a corner of the worktable and draws three columns: what was said, what can be checked, and what remains interpretation.',cn:'他腾出工作台一角，画了三栏：别人说了什么、哪些可以核实、以及哪些仍然只是解释。',next:'c1'},
  c1:{choice:{promptEn:'How do you want to use the afternoon?',promptCn:'这个下午，你想怎么整理这些旧事？',options:[
    {en:'List every claim that can be verified.',cn:'先列出所有可以查证的事实。',fx:[['route','alaric',2],['rel','alaric','trust',1],['rel','alaric','curiosity',1]],goto:'e1'},
    {en:'Ask which details people tend to distort when emotions are involved.',cn:'问他人在情绪激动时最容易扭曲哪些细节。',fx:[['route','alaric',1],['rel','alaric','respect',1],['flag','identity_evidence_method',true]],goto:'e2'}]}},
  e1:{sp:'alaric',en:'Good. Memory is unreliable. Reputation is merely memory with witnesses.',cn:'很好。记忆不可靠。名声只不过是多了证人的记忆。',end:true},
  e2:{sp:'alaric',en:'Motives. People remember motives with extraordinary confidence and almost no evidence.',cn:'动机。人们对动机的记忆总是异常自信，却往往几乎没有证据。',end:true}
}};

SCENES.d9_elise_followup = {bg:'garden',loc:'garden',start:'n1',nodes:{
  n1:{sp:'elise',sprite:'elise',en:'You do not have to turn every accusation into an investigation before supper.',cn:'你没必要在晚饭前把每一句指责都变成一场调查。',next:'n2'},
  n2:{sp:null,en:'She takes you along the quieter rose path, the one servants use when they want to avoid the main terrace.',cn:'她带你走了一条更安静的玫瑰小径——仆从们想避开主露台时常走的那条。',next:'c1'},
  c1:{choice:{promptEn:'Elise waits without pressing.',promptCn:'Elise没有催你，只是陪着。',options:[
    {en:'Ask what ordinary days with the old Nait were like.',cn:'问她从前和Nait相处的普通日子是什么样。',fx:[['route','family',2],['estate','staff_trust',1],['flag','old_nait_daily_life',true]],goto:'e1'},
    {en:'Leave the past alone for one afternoon.',cn:'今天下午先不谈过去。',fx:[['route','family',2],['rel','elise','warmth',1]],goto:'e2'}]}},
  e1:{sp:'elise',en:'Complicated. Annoying. Occasionally kind when no one was looking. Mostly human.',cn:'复杂。很烦。偶尔会在没人看见的时候做点好事。大多数时候……就是个人。',end:true},
  e2:{sp:'elise',en:'Excellent. Then your most urgent responsibility is tea before it gets cold.',cn:'很好。那你眼下最紧急的责任，就是在茶凉之前把它喝掉。',end:true}
}};

SCENES.d10_city_first = {bg:'market',loc:'market',start:'n1',nodes:{
  n1:{sp:null,sprite:'none',en:'On the tenth morning, Rosecourt opens its gates for you.',cn:'第十天早晨，Rosecourt的大门第一次真正为你打开。',next:'n2'},
  n2:{sp:'elise',sprite:'none',en:'The royal city is louder than the manor. Do not let that fool you. It also notices more.',cn:'王城比庄园吵。别被这点骗了——它注意到的事情也更多。',next:'n3'},
  n3:{sp:null,en:'Carriages, booksellers, blue-uniformed academy students, court clerks, flower stalls. A city that once knew your face is learning it again.',cn:'马车、书商、穿蓝制服的学院学生、宫廷书记员、花摊。一座曾经认识你的城市，正在重新认识你的脸。',fx:[['flag','city_unlocked',true]],next:'c1'},
  c1:{choice:{promptEn:'Where do your eyes go first?',promptCn:'你的视线最先被哪里吸引？',options:[
    {en:'The academy towers above the rooftops.',cn:'屋顶之上的王立魔法学院塔楼。',fx:[['route','alaric',1]],goto:'a'},
    {en:'The palace road and its polished black carriages.',cn:'通往王宫的道路与擦得发亮的黑色马车。',fx:[['route','damien',1]],goto:'d'},
    {en:'The market, where no one lowers their voice for nobles.',cn:'市集——那里似乎没人因为贵族就压低嗓门。',fx:[['route','ensemble',1],['route','family',1]],goto:'m'}]}},
  a:{sp:'elise',en:'Of course. One week with Varenne and now you look at towers like they owe you answers.',cn:'果然。和Varenne待了一周，你现在看塔楼都像它们欠你答案。',end:true},
  d:{sp:'elise',en:'Careful. That road has a habit of turning a simple visit into three invitations and a rumor.',cn:'小心。那条路很擅长把一次普通拜访变成三封邀请和一条流言。',end:true},
  m:{sp:'elise',en:'Good choice. If you want to know a city, ask where it buys breakfast.',cn:'好选择。想认识一座城市，就先问它去哪儿买早餐。',end:true}
}};

SCENES.d10_palace = {bg:'palace',loc:'palace',start:'n1',nodes:{
 n1:{sp:'damien',sprite:'damien',en:'You came without a formal summons. I should probably reward the innovation.',cn:'你居然没有正式召见就来了。我大概该奖励这种创新。',next:'c1'},
 c1:{choice:{promptEn:'He offers tea in a side room instead of the public salon.',promptCn:'他没有带你去公开会客厅，而是去了侧边的小茶室。',options:[
  {en:'Ask what the city said about your two-month absence.',cn:'问王城如何议论你消失的两个月。',fx:[['route','damien',2],['rel','damien','political_trust',1]],goto:'e'},
  {en:'Ask what he thought.',cn:'问他本人是怎么想的。',fx:[['route','damien',2],['rel','damien','personal_trust',1],['rel','damien','vulnerability',1]],goto:'e'}]}},
 e:{sp:'damien',en:'The city assumed scandal. I assumed something worse. I dislike being right in incomplete ways.',cn:'王城假设是丑闻。我假设得更糟。我不喜欢这种只对了一半的正确。',end:true}
}};

SCENES.d11_letter = {bg:'library',loc:'library',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'A false-bottom drawer in an old desk yields half a letter in your handwriting.',cn:'旧书桌的暗格里，躺着半封你的笔迹写成的信。',next:'n2'},
 n2:{sp:null,en:'“I know I should not have done it. But he began—” The sentence ends under three violent strokes of ink.',cn:'“我知道我不该那样做。但明明是他先——”句子在三道用力划下的墨痕里断掉。',next:'c1'},
 c1:{choice:{promptEn:'Who gets to see it?',promptCn:'你想让谁先看？',options:[
  {en:'Lucien and Elise.',cn:'Lucien和Elise。',fx:[['route','family',2],['flag','letter_shared_family',true]],goto:'f'},
  {en:'Alaric.',cn:'Alaric。',fx:[['route','alaric',2],['rel','alaric','trust',1],['flag','letter_shared_alaric',true]],goto:'a'},
  {en:'Roderic.',cn:'Roderic。',fx:[['route','roderic',2],['rel','roderic','trust',1],['flag','letter_shared_roderic',true]],goto:'r'},
  {en:'Damien.',cn:'Damien。',fx:[['route','damien',2],['rel','damien','personal_trust',1],['flag','letter_shared_damien',true]],goto:'d'},
  {en:'Bring it to dinner and ask everyone.',cn:'晚餐时拿出来，让大家一起看。',fx:[['route','ensemble',3],['flag','letter_shared_group',true]],goto:'g'}]}},
 f:{sp:'lucien',sprite:'lucien',en:'You were capable of regret. You were less capable of finishing the sentence.',cn:'你从前会后悔。只是不太擅长把后悔说完。',end:true},
 a:{sp:'alaric',sprite:'alaric',en:'Useful. It proves the old Nait possessed self-awareness. Inconveniently, not maturity.',cn:'有用。它证明从前的Nait有自知之明。遗憾的是，未必有成熟。',end:true},
 r:{sp:'roderic',sprite:'roderic',en:'That is absolutely your handwriting. Also absolutely how you argued.',cn:'这绝对是你的字。以及，绝对是你以前吵架的方式。',end:true},
 d:{sp:'damien',sprite:'damien',en:'You always hated the middle of an apology. The beginning injured your pride; the end required surrender.',cn:'你以前最讨厌道歉的中间部分。开头伤自尊，结尾要认输。',end:true},
 g:{sp:'elise',sprite:'elise',en:'All right. New house rule: no one is allowed to weaponize the unfinished apology against anyone else.',cn:'好。新家规：谁都不许拿这封没写完的道歉信攻击别人。',end:true}
}};

SCENES.d12_city_day = {bg:'market',loc:'market',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'The city is less overwhelming the second time. You begin noticing routes instead of noise.',cn:'第二次进王城时，它没那么压人了。你开始注意道路，而不只是喧闹。',next:'n2'},
 n2:{sp:null,en:'Rosecourt no longer feels like the whole map. Merely the place at its center.',cn:'Rosecourt不再像整张地图。更像是地图中心的那个地方。',fx:[['flag','city_familiar',true]],end:true}
}};
SCENES.d12_roderic_city = {bg:'market',loc:'market',start:'n1',nodes:{
 n1:{sp:'roderic',sprite:'roderic',en:'Stop walking like you are attending your own trial. The fruit seller does not care who you offended two years ago.',cn:'别走得像在参加自己的审判。水果摊老板才不在乎你两年前得罪过谁。',next:'n2'},
 n2:{sp:null,en:'He is wrong. The fruit seller absolutely remembers. She gives Roderic the bruised pears on purpose.',cn:'他错了。水果摊老板记得清清楚楚。她故意把碰伤的梨都给了Roderic。',fx:[['route','roderic',2],['rel','roderic','warmth',1]],end:true}
}};

SCENES.d12_alaric_city = {bg:'academy',loc:'academy',start:'n1',nodes:{
 n1:{sp:'alaric',sprite:'alaric',en:'You returned voluntarily. I am beginning to suspect the first visit was not an anomaly.',cn:'你又是自愿来的。我开始怀疑第一次并不是偶发事件。',next:'n2'},
 n2:{sp:null,en:'This time he does not show you the public archive. He takes you to a narrow gallery overlooking the academy wards.',cn:'这次他没有再带你去公共档案室，而是领你上了一条俯瞰学院结界的狭长回廊。',next:'c1'},
 c1:{choice:{promptEn:'Colored ward-lines move over the glass below.',promptCn:'下方玻璃上流动着不同颜色的结界线。',options:[
  {en:'Ask whether Rosecourt\'s anomaly resembles any academy ward failure.',cn:'问Rosecourt的异象是否像某种学院结界故障。',fx:[['route','alaric',2],['rel','alaric','trust',1],['flag','academy_compare_anomaly',true]],goto:'e'},
  {en:'Ask what he was not willing to show you on the first visit.',cn:'问他第一次来时，那扇没打开的门后是什么。',fx:[['route','alaric',2],['rel','alaric','curiosity',1],['rel','alaric','trust',1]],goto:'e'}]}},
 e:{sp:'alaric',en:'You are becoming inconveniently good at asking the question I hoped you would postpone.',cn:'你越来越擅长问那些我原本希望你晚点再问的问题。很麻烦。',end:true}
}};
SCENES.d12_damien_private = {bg:'conservatory',loc:'conservatory',start:'n1',nodes:{
 n1:{sp:'damien',sprite:'damien',en:'The conservatory is the only palace room where no one can pretend the roses are listening for policy.',cn:'温室是王宫里唯一没人能假装玫瑰也在听政的地方。',next:'n2'},
 n2:{sp:'damien',en:'Before your collapse, you asked me whether a person could legally inherit obligations they did not remember accepting.',cn:'你昏倒前曾问过我：一个人能不能在完全不记得自己接受过某项义务的情况下，仍然依法继承它。',fx:[['route','damien',2],['rel','damien','personal_trust',1],['flag','old_nait_asked_inheritance',true]],end:true}
}};

SCENES.d13_anomaly = {bg:'library',loc:'library',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'At dusk, every ward-light in the library goes out at once.',cn:'黄昏时，图书室里所有结界灯同时熄灭。',next:'n2'},
 n2:{sp:null,en:'For one heartbeat the room smells of rain on stone. Your body knows where the chalk circle is before your eyes adjust.',cn:'有那么一个心跳的时间，房间里全是雨落石面的味道。眼睛还没适应黑暗，身体已经知道白垩圆在哪里。',next:'c1'},
 c1:{choice:{promptEn:'Who do you call first?',promptCn:'你第一个想叫谁？',options:[
  {en:'Lucien and Elise.',cn:'Lucien和Elise。',fx:[['route','family',3],['flag','crisis_called_family',true]],goto:'f'},
  {en:'Alaric.',cn:'Alaric。',fx:[['route','alaric',3],['rel','alaric','trust',2],['flag','crisis_called_alaric',true]],goto:'a'},
  {en:'Roderic.',cn:'Roderic。',fx:[['route','roderic',3],['rel','roderic','trust',2],['flag','crisis_called_roderic',true]],goto:'r'},
  {en:'Damien.',cn:'Damien。',fx:[['route','damien',3],['rel','damien','personal_trust',2],['flag','crisis_called_damien',true]],goto:'d'},
  {en:'Send for everyone.',cn:'把大家都叫来。',fx:[['route','ensemble',4],['flag','crisis_called_group',true]],goto:'g'}]}},
 f:{sp:'lucien',sprite:'lucien',en:'You do not have to make danger private merely because it happened to you.',cn:'危险发生在你身上，不代表你必须一个人承担它。',end:true},
 a:{sp:'alaric',sprite:'alaric',en:'Do not move. That is not an order of authority. It is an order of measurement.',cn:'别动。这不是权威命令，是测量命令。',end:true},
 r:{sp:'roderic',sprite:'roderic',en:'I have no idea what I am looking at. I do know where the door is. Start there.',cn:'我完全不知道这是什么。但我知道门在哪。先从这个开始。',end:true},
 d:{sp:'damien',sprite:'damien',en:'I came without an escort. That sentence will remain between us.',cn:'我是没带仪仗来的。这句话最好只留在我们之间。',end:true},
 g:{sp:'elise',sprite:'elise',en:'Six people in one library again. At this point the room has forfeited the right to complain.',cn:'又是六个人挤在一个图书室里。事到如今，这房间已经没有资格抱怨了。',end:true}
}};

SCENES.d14_week2_close = {bg:'garden',loc:'garden',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'Two weeks. Rosecourt is familiar enough that you stop counting doors.',cn:'两周。Rosecourt已经熟悉到，你不再数经过了几扇门。',next:'n2'},
 n2:{sp:null,en:'The royal city has begun to acquire landmarks instead of impressions. More importantly, people have begun asking for your time.',cn:'王城也开始从一团印象变成一个个具体地点。更重要的是——人们开始主动来占用你的时间。',next:'n3'},
 n3:{sp:'roderic',sprite:'roderic',en:'Next week, come outside the walls. You cannot relearn a country by staring at its capital.',cn:'下周，跟我去城外。你不可能盯着王都，就重新认识整个国家。',fx:[['flag','outskirts_invited',true]],end:true}
}};

SCENES.d15_outskirts_first = {bg:'city_gate',loc:'old_road',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'The west gate falls behind you. The road opens into fields, low stone walls, and a sky Rosecourt never had room to show you.',cn:'王城西门渐渐落在身后。道路伸向田野、矮石墙，还有一片Rosecourt从没装得下的天空。',next:'n2'},
 n2:{sp:'roderic',sprite:'roderic',en:'There. Third map. Manor, city, countryside. Now you are allowed to complain that the world is too large.',cn:'好了。第三张地图。庄园、王城、郊外。现在你可以抱怨世界太大了。',fx:[['flag','outskirts_unlocked',true],['route','roderic',2]],next:'n3'},
 n3:{sp:null,en:'A roadside marker bears the Rosier rose on one side and Wycliffe hawk on the other. Politics, apparently, also needs signposts.',cn:'路边界石一面刻Rosier玫瑰，一面刻Wycliffe鹰。看来政治也需要路标。',end:true}
}};

SCENES.d15_ride = {bg:'old_road',loc:'old_road',start:'n1',nodes:{n1:{sp:'roderic',sprite:'roderic',en:'You still lean into the turn too early.',cn:'你转弯时还是会太早压重心。',next:'c1'},c1:{choice:{promptEn:'The correction is immediate, familiar, irritating.',promptCn:'这个纠正来得太快、太熟悉，也太烦人。',options:[{en:'Ask him to teach you from the beginning.',cn:'让他从头教你。',fx:[['route','roderic',2],['rel','roderic','trust',1]],goto:'e'},{en:'Tell him your body seems to remember enough to argue.',cn:'告诉他，你的身体记得足够多，至少够拿来顶嘴。',fx:[['route','roderic',2],['rel','roderic','rivalry',1],['rel','roderic','warmth',1]],goto:'e'}]}},e:{sp:'roderic',en:'Good. That sounds more like you. Whichever version.',cn:'很好。这样比较像你。至于是哪个版本——随便。',end:true}}};

SCENES.d16_stewardship = {bg:'sitting_room',loc:'duke_study',start:'n1',nodes:{
 n1:{sp:'lucien',sprite:'lucien',en:'You have seen the village now. Good. Today you may make one small decision.',cn:'你已经看过领村了。很好。今天，你可以做第一个真正的小决定。',next:'n2'},
 n2:{sp:null,en:'A winter bridge needs repair. The treasury can fund stone now, timber now, or delay three months for a cheaper contract.',cn:'一座冬季要用的桥需要维修。现在可以拨款用石料、现在用木料，或者拖三个月等更便宜的承包。',next:'c1'},
 c1:{choice:{promptEn:'No choice is free.',promptCn:'没有哪个选择是没有代价的。',options:[
  {en:'Fund stone now. Expensive, durable.',cn:'现在拨款用石料。贵，但耐久。',fx:[['estate','treasury',-2],['estate','stability',2],['route','family',1]],goto:'e1'},
  {en:'Use timber now. Faster, cheaper, less durable.',cn:'现在用木料。更快、更便宜，但不耐久。',fx:[['estate','treasury',-1],['estate','welfare',1],['route','roderic',1]],goto:'e2'},
  {en:'Delay and negotiate the contract.',cn:'延期，并重新谈承包价格。',fx:[['estate','treasury',1],['estate','reputation',-1],['route','damien',1]],goto:'e3'}]}},
 e1:{sp:'lucien',en:'Then sign it. Do not look at me after. The signature is the lesson.',cn:'那就签。签完别看我。签名本身就是这堂课。',fx:[['flag','estate_first_decision',true]],end:true},
 e2:{sp:'lucien',en:'Practical. You will need to inspect it again before winter.',cn:'实际。入冬前你得再去看一次。',fx:[['flag','estate_first_decision',true]],end:true},
 e3:{sp:'lucien',en:'Defensible. Now you must explain the delay to people who still need the bridge.',cn:'说得通。接下来你要亲自向仍然需要那座桥的人解释延期。',fx:[['flag','estate_first_decision',true]],end:true}
}};

SCENES.d17_academy_field = {bg:'old_road',loc:'old_road',start:'n1',nodes:{
 n1:{sp:'alaric',sprite:'alaric',en:'The anomaly at Rosecourt is not unique. That is either reassuring or much worse.',cn:'Rosecourt的异象不是唯一一个。这要么令人安心，要么更糟。',next:'n2'},
 n2:{sp:null,en:'He shows you a weathered stone beside the old road. The air above it carries the same almost-imperceptible pressure.',cn:'他带你看旧道旁一块风化的石头。石头上方的空气，有着几乎同样难以察觉的压迫感。',fx:[['route','alaric',3],['rel','alaric','trust',1],['flag','anomaly_outside_rosecourt',true]],end:true}
}};
SCENES.d17_palace_policy = {bg:'palace',loc:'palace',start:'n1',nodes:{
 n1:{sp:'damien',sprite:'damien',en:'Your bridge decision reached court before your breakfast did.',cn:'你对桥的决定，比你的早餐更早传到王宫。',next:'n2'},
 n2:{sp:'damien',en:'Welcome to administration. Every local decision becomes someone else\'s political anecdote.',cn:'欢迎来到治理。每个地方决定，最后都会变成别人的政治谈资。',fx:[['route','damien',3],['rel','damien','political_trust',1],['estate','court_influence',1]],end:true}
}};
SCENES.d17_family_followup = {bg:'estate_village',loc:'estate_village',start:'n1',nodes:{
 n1:{sp:'elise',sprite:'elise',en:'If you want to know whether a policy worked, do not ask the person who wrote the report first.',cn:'想知道一项政策有没有用，第一句别先问写报告的人。',next:'n2'},
 n2:{sp:null,en:'You spend the afternoon hearing three different versions of the same bridge problem.',cn:'你花了一整个下午，听到了关于同一座桥的三个不同版本。',fx:[['route','family',3],['estate','welfare',1],['estate','staff_trust',1]],end:true}
}};

SCENES.d18_free_map = {bg:'title_manor',loc:'sitting_room',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'By the eighteenth day, invitations arrive from three directions before noon.',cn:'到了第十八天，中午之前，邀请已经从三个方向一起涌来。',next:'n2'},
 n2:{sp:null,en:'For the first time, choosing where to go feels less like recovery and more like a life taking shape.',cn:'第一次，“去哪里”不再只是康复安排，而像是在给一种生活定形。',fx:[['flag','three_zone_choice_seen',true]],end:true}
}};

SCENES.d19_identity_echo = {bg:'bedroom',loc:'bedroom',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'You wake knowing, with impossible certainty, that the east window sticks in damp weather.',cn:'你醒来时无比确定：东边那扇窗一到潮湿天气就会卡住。',next:'n2'},
 n2:{sp:null,en:'It does. Elise looks at the latch, then at you.',cn:'它真的卡住了。Elise看看窗闩，又看看你。',next:'c1'},
 c1:{choice:{promptEn:'What do you make of it?',promptCn:'你怎么理解这件事？',options:[
  {en:'Maybe I really am Nait, and memory is returning sideways.',cn:'也许我本来就是Nait，只是记忆从别的方向回来。',fx:[['flag','identity_continuity_hint',true]],goto:'e'},
  {en:'Maybe this body remembers things I do not.',cn:'也许只是这具身体记得，而我不记得。',fx:[['flag','identity_transference_hint',true]],goto:'e'},
  {en:'Either way, I know how to open the window now.',cn:'不管是哪种解释，至少我现在知道怎么开这扇窗。',fx:[['flag','identity_self_defined',true]],goto:'e'}]}},
 e:{sp:'elise',sprite:'elise',en:'That may be the most sensible thing anyone has said about your memory so far.',cn:'这大概是到目前为止，关于你记忆这件事最实际的一句话。',end:true}
}};


SCENES.d21_three_weeks = {bg:'garden',loc:'garden',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'Three weeks at Rosecourt.',cn:'在Rosecourt的第三周结束了。',next:'n2'},
 n2:{sp:null,en:'You know which corridor leads to your father\'s study without asking. You know where the city sells breakfast. You know the road beyond the west gate bends toward the river.',cn:'你已经不需要问路就能去父亲书房。你知道王城在哪里买早餐。你知道西门外的道路会弯向河岸。',next:'n3'},
 n3:{sp:null,en:'More quietly: certain people have begun to expect you. In particular rooms. At particular hours. For particular kinds of honesty.',cn:'更安静地说：有些人已经开始习惯等你。在某些房间、某些时间，为了某种只有你们之间才成立的坦诚。',next:'n4'},
 n4:{sp:'lucien',sprite:'lucien',en:'From next week, I will stop arranging your days for you.',cn:'从下周开始，我不会再替你安排每天的行程。',next:'n5'},
 n5:{sp:'elise',sprite:'elise',en:'Which means the whole map is yours. Manor, city, outskirts. Try not to schedule yourself into three places at once.',cn:'也就是说，整张地图归你自己选。庄园、王城、郊外。尽量别把自己同一时间排去三个地方。',next:'n6'},
 n6:{sp:null,en:'Week Four will begin with free travel.',cn:'第四周，将开放全地图自由行动。',fx:[['flag','full_map_unlocked',true]],end:true}
}};


/* ============================================================
   WEEK 2–3 INTERACTION PASS
   Route/date events are now scenes, not summaries: characters
   respond, the player gets follow-up choices, and choices can
   change both relationship tone and route tendency.
   ============================================================ */

SCENES.d8_family = {bg:'garden',loc:'garden',start:'n1',nodes:{
 n1:{sp:'elise',sprite:'elise',en:'The Duke pretends he does not pace when you are late to breakfast. I pretend not to notice. We are both excellent actors.',cn:'公爵大人假装你早餐迟到时他不会来回踱步。我假装没看见。我们两个演技都很好。',next:'c1'},
 c1:{choice:{promptEn:'Elise glances toward the study windows.',promptCn:'Elise朝书房的窗户看了一眼。',options:[
  {en:'“Does he worry this much about everything?”',cn:'“他对所有事都这么操心吗？”',fx:[['route','family',1],['rel','elise','trust',1]],goto:'r1'},
  {en:'“You two have been coordinating around me, haven’t you?”',cn:'“你们两个一直在背着我互通消息，对吧？”',fx:[['route','family',1],['rel','elise','warmth',1]],goto:'r2'}]}},
 r1:{sp:'elise',en:'Not everything. Mostly you. Estate accounts come second.',cn:'不是所有事。主要是你。领地账目排第二。',next:'c2'},
 r2:{sp:'elise',en:'Coordinating is such an ugly word. I prefer “preventing His Grace from asking the physician the same question four times.”',cn:'“互通消息”听起来太难听了。我更喜欢说——阻止公爵大人把同一个问题问医师四遍。',next:'c2'},
 c2:{choice:{promptEn:'The path divides around a white-rose arbor.',promptCn:'白玫瑰花架前，小径分成两边。',options:[
  {en:'Ask Elise what Lucien was like when you were small.',cn:'问Elise，Lucien在自己小时候是什么样。',fx:[['route','family',2],['flag','lucien_old_parenting_glimpse',true]],goto:'e1'},
  {en:'Ask Elise what she wants now that you are awake.',cn:'问Elise，既然自己醒了，她现在想要什么。',fx:[['route','family',2],['rel','elise','trust',1],['estate','staff_trust',1]],goto:'e2'}]}},
 e1:{sp:'elise',en:'Terrifying to everyone else. Hopeless with fevers. He once threatened an apothecary over a cough syrup.',cn:'对别人很可怕。遇到你发烧就完全没办法。他以前甚至因为一瓶止咳糖浆威胁过药剂师。',end:true},
 e2:{sp:'elise',en:'A day off without wondering whether you will disappear while I am gone. I am working up to it.',cn:'休一天假，而且不用担心我不在的时候你会不会又从这个世界上消失。……我还在练习。',end:true}
}};


SCENES.d10_market = {bg:'market',loc:'market',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'At Rosemarket, Elise knows the pastry seller, two seamstresses, a bookseller, and apparently half the city.',cn:'在玫瑰市集，Elise认识点心铺老板、两位裁缝、一个书商，以及——看起来——半座王城。',next:'n2'},
 n2:{sp:'elise',sprite:'elise',en:'Servants have social networks. Nobles call them gossip because it hurts less.',cn:'仆从有自己的消息网。贵族把它叫八卦，听起来比较不刺耳。',next:'c1'},
 c1:{choice:{promptEn:'A pastry seller recognizes you and goes suddenly careful.',promptCn:'点心铺老板认出了你，表情忽然谨慎起来。',options:[
  {en:'Order what the old Nait used to buy.',cn:'点一份从前的Nait常买的东西。',fx:[['route','family',1],['flag','old_nait_market_habit',true]],goto:'r1'},
  {en:'Ask Elise to choose something she likes instead.',cn:'让Elise选她自己喜欢吃的。',fx:[['route','family',2],['rel','elise','warmth',1]],goto:'r2'}]}},
 r1:{sp:'elise',en:'Apricot tart. You used to complain if the glaze was too sweet and then finish mine.',cn:'杏子塔。你以前嫌糖浆太甜，然后会把我的那份也吃掉。',next:'c2'},
 r2:{sp:'elise',en:'That is an alarming amount of power to give a woman before noon.',cn:'中午之前就给一个女人这么大的权力，很危险。',next:'c2'},
 c2:{choice:{promptEn:'Across the market, someone whispers your surname.',promptCn:'市集另一头，有人小声提到了你的姓氏。',options:[
  {en:'Ignore it and keep walking normally.',cn:'当作没听见，照常逛下去。',fx:[['route','family',1],['estate','reputation',1]],goto:'e1'},
  {en:'Ask Elise whether this happens everywhere.',cn:'问Elise，这种事是不是到哪里都会发生。',fx:[['route','family',1],['estate','staff_trust',1]],goto:'e2'}]}},
 e1:{sp:'elise',en:'Good. Cities get bored when nobles refuse to perform for them.',cn:'很好。贵族不配合表演的时候，城市很快就会觉得无聊。',end:true},
 e2:{sp:'elise',en:'For a while. Then they will gossip about what you do now instead of what you did before.',cn:'暂时会。再过一阵子，他们就会开始议论你现在做什么，而不是以前做过什么。',end:true}
}};











/* ============================================================
   CHOICE NODE PACING PASS v2
   Ordinary scenes keep 1–2 choice beats. Key route sampler,
   stewardship and mystery scenes now use 3 meaningful beats:
   approach -> relationship/worldview -> commitment/identity.
   No choice here locks a route during Weeks 2–3.
   ============================================================ */

SCENES.d10_academy = {bg:'academy',loc:'academy',start:'n1',nodes:{
 n1:{sp:'alaric',sprite:'alaric',en:'You found the academy without being kidnapped by a student society. Promising.',cn:'你居然没被学生社团拐走就找到学院了。很有前途。',next:'c1'},
 c1:{choice:{promptEn:'He offers you the public archive or the observation gallery first.',promptCn:'他问你想先看公共档案室，还是观测廊。',options:[
  {en:'Public archive. Start with records.',cn:'先去公共档案室。从记录开始。',fx:[['route','alaric',1],['rel','alaric','curiosity',1]],goto:'r1'},
  {en:'Observation gallery. Start with how magic is measured.',cn:'先去观测廊。从魔法是怎么被测量的开始。',fx:[['route','alaric',1],['rel','alaric','respect',1]],goto:'r2'}]}},
 r1:{sp:'alaric',en:'Predictable. I mean that as praise.',cn:'很好猜。我这句话是夸奖。',next:'n2'},
 r2:{sp:'alaric',en:'Good. Numbers without instruments are merely decorative certainty.',cn:'很好。没有仪器支撑的数字，只是装饰性的确定感。',next:'n2'},
 n2:{sp:null,en:'On the way, he passes a locked black door and very deliberately does not explain it.',cn:'路上，他经过一扇上锁的黑门，而且非常刻意地没有解释。',next:'c2'},
 c2:{choice:{promptEn:'The omission is almost an invitation.',promptCn:'这种刻意不解释，几乎像一种邀请。',options:[
  {en:'Ask what is behind the door.',cn:'直接问门后是什么。',fx:[['route','alaric',1],['rel','alaric','trust',1]],goto:'r3'},
  {en:'Say nothing, but remember the door.',cn:'什么都不问，但记住这扇门。',fx:[['route','alaric',1],['flag','academy_locked_door_noticed',true]],goto:'r4'}]}},
 r3:{sp:'alaric',en:'Restricted archive. And no, that was not permission. Yet.',cn:'限制档案室。以及，不，那不是许可。至少现在不是。',next:'c3'},
 r4:{sp:'alaric',en:'You are learning restraint. I had not prepared for this development.',cn:'你居然开始学会克制了。我没为这个发展做好准备。',next:'c3'},
 c3:{choice:{promptEn:'Before you leave, Alaric asks why you wanted to see the academy at all.',promptCn:'离开前，Alaric忽然问：你为什么想来学院？',options:[
  {en:'Because the anomaly may contain evidence about my past.',cn:'因为异象可能藏着关于过去的证据。',fx:[['route','alaric',1],['identity','continuity',1],['rel','alaric','respect',1]],goto:'e1'},
  {en:'Because I want to understand this world on my own terms.',cn:'因为我想用自己的方式理解这个世界。',fx:[['route','alaric',1],['identity','self_defined',1],['rel','alaric','trust',1]],goto:'e2'},
  {en:'Because you keep making it sound interesting.',cn:'因为你一直把这里说得很有意思。',fx:[['route','alaric',1],['rel','alaric','warmth',1]],goto:'e3'}]}},
 e1:{sp:'alaric',en:'Then we distinguish evidence from longing. Carefully.',cn:'那我们就把证据和愿望分开。仔细一点。',fx:[['flag','academy_seen',true]],end:true},
 e2:{sp:'alaric',en:'A defensible motive. Better than inheriting someone else\'s conclusions.',cn:'这个动机站得住脚。比继承别人的结论好多了。',fx:[['flag','academy_seen',true]],end:true},
 e3:{sp:'alaric',en:'That is an irresponsible basis for scholarship. ...Come again next week.',cn:'这可不是负责任的求学理由。……下周再来。',fx:[['flag','academy_seen',true]],end:true}
}};

SCENES.d15_family_out = {bg:'estate_village',loc:'estate_village',start:'n1',nodes:{
 n1:{sp:'elise',sprite:'elise',en:'Reports call this “the western tenant cluster.” People who live here call it home.',cn:'报告里把这里叫“西部佃户聚落”。住在这里的人叫它家。',next:'c1'},
 c1:{choice:{promptEn:'A village steward begins giving you the polished version of everything.',promptCn:'村务管事开始向你汇报一个过分漂亮的版本。',options:[
  {en:'Let him finish before asking questions.',cn:'先让他完整讲完，再提问。',fx:[['route','family',1],['estate','staff_trust',1]],goto:'r1'},
  {en:'Ask to hear from someone who uses the bridge every day.',cn:'直接问能不能听听每天过桥的人怎么说。',fx:[['route','family',1],['estate','welfare',1]],goto:'r2'}]}},
 r1:{sp:'elise',en:'Good. Now you know what he wanted you to know. Next we find out what he forgot.',cn:'很好。现在你知道他希望你知道什么了。接下来去看看他忘了什么。',next:'c2'},
 r2:{sp:'elise',en:'Excellent. His expression just taught you something too.',cn:'很好。他刚才那个表情本身也提供了信息。',next:'c2'},
 c2:{choice:{promptEn:'A woman mentions winter flooding almost as an afterthought.',promptCn:'一位妇人顺口提到冬季涨水。',options:[
  {en:'Ask her to show you where the water reaches.',cn:'请她带你看水位最高会到哪里。',fx:[['route','family',1],['estate','welfare',1]],goto:'r3'},
  {en:'Ask the steward why it was absent from the written report.',cn:'问管事为什么书面报告里没有这件事。',fx:[['route','family',1],['estate','staff_trust',1]],goto:'r4'}]}},
 r3:{sp:'elise',en:'Mud stains are often more honest than ledgers.',cn:'泥水留下的痕迹，很多时候比账簿诚实。',next:'c3'},
 r4:{sp:'elise',en:'And silence in a report is still information.',cn:'报告里的沉默，本身也是信息。',next:'c3'},
 c3:{choice:{promptEn:'On the carriage back, Elise asks what you want Lucien to hear first.',promptCn:'回程马车上，Elise问：你最想先告诉Lucien什么？',options:[
  {en:'The bridge needs money before winter.',cn:'入冬前必须拨钱修桥。',fx:[['route','family',1],['responsibility','high',1],['estate','welfare',1]],goto:'e1'},
  {en:'The reporting system needs fixing before the bridge does.',cn:'比起桥，先要修正汇报制度。',fx:[['route','family',1],['estate','staff_trust',1],['estate','stability',1]],goto:'e2'},
  {en:'I want to come back before deciding.',cn:'我想再来一次，再做决定。',fx:[['route','family',1],['responsibility','measured',1],['estate','stability',1]],goto:'e3'}]}},
 e1:{sp:'elise',en:'He will ask where the money comes from. That is the next lesson.',cn:'他会问这笔钱从哪里来。那就是下一课。',end:true},
 e2:{sp:'elise',en:'He may smile. Very slightly. Do not let it alarm you.',cn:'他可能会笑一下。非常轻。别被吓到。',end:true},
 e3:{sp:'elise',en:'Good. Seeing a place once makes you a visitor. Twice begins to make you responsible.',cn:'很好。来一次只是访客。来第二次，才开始像是在负责。',end:true}
}};

SCENES.d18_alaric = {bg:'academy',loc:'academy',start:'n1',nodes:{
 n1:{sp:'alaric',sprite:'alaric',en:'I saved the incomprehensible paper for you.',cn:'我特意把最难懂的论文留给你了。',next:'c1'},
 c1:{choice:{promptEn:'There are two chairs. One is already pulled out beside his.',promptCn:'桌边有两把椅子，其中一把已经被拉到他旁边。',options:[
  {en:'Sit beside him and ask where the paper goes wrong.',cn:'坐到他旁边，问这篇论文到底错在哪。',fx:[['route','alaric',1],['rel','alaric','intimacy',1]],goto:'r1'},
  {en:'Tell him he only invited you here to complain professionally.',cn:'说他叫自己来只是为了专业地抱怨论文。',fx:[['route','alaric',1],['rel','alaric','warmth',1]],goto:'r2'}]}},
 r1:{sp:'alaric',en:'Page twelve. But I wanted to see whether you would find page seven first.',cn:'第十二页。但我想看看你会不会先发现第七页。',next:'c2'},
 r2:{sp:'alaric',en:'Incorrect. I can complain professionally without assistance.',cn:'错误。我不需要协助也可以专业地抱怨。',next:'c2'},
 c2:{choice:{promptEn:'An hour later, the margin is full of notes.',promptCn:'一小时后，页边已经写满了批注。',options:[
  {en:'Ask why he keeps bringing unfinished questions to you.',cn:'问他为什么总把还没想完的问题带来找自己。',fx:[['route','alaric',1],['rel','alaric','trust',1]],goto:'r3'},
  {en:'Point out that this has started to feel like a routine.',cn:'指出这件事已经快变成固定日常了。',fx:[['route','alaric',1],['rel','alaric','intimacy',1]],goto:'r4'}]}},
 r3:{sp:'alaric',en:'Because you ask different questions than I do. It is useful.',cn:'因为你会问和我不一样的问题。很有用。',next:'c3'},
 r4:{sp:'alaric',en:'...Yes. I had noticed.',cn:'……是。我注意到了。',next:'c3'},
 c3:{choice:{promptEn:'He closes the paper, but not the conversation.',promptCn:'他合上论文，却没有结束谈话。',options:[
  {en:'Ask whether he trusts the person you are now.',cn:'问他是否信任现在的自己。',fx:[['route','alaric',1],['rel','alaric','trust',2]],goto:'e1'},
  {en:'Ask whether he is still trying to solve you.',cn:'问他是不是还在试图“解开”自己。',fx:[['route','alaric',1],['rel','alaric','intimacy',1]],goto:'e2'},
  {en:'Tell him you like having a question that belongs to both of you.',cn:'告诉他，自己喜欢有一个“属于两个人的问题”。',fx:[['route','alaric',1],['rel','alaric','warmth',1],['rel','alaric','intimacy',1]],goto:'e3'}]}},
 e1:{sp:'alaric',en:'Increasingly. I dislike how imprecise that answer is.',cn:'越来越信任。这个答案不够精确，我不喜欢。',end:true},
 e2:{sp:'alaric',en:'Less than before. You keep changing the variables.',cn:'比以前少了。你总是在改变变量。',end:true},
 e3:{sp:'alaric',en:'...That is an unnecessarily effective way to phrase it.',cn:'……这个说法没必要这么有效。',end:true}
}};

SCENES.d18_roderic = {bg:'old_road',loc:'old_road',start:'n1',nodes:{
 n1:{sp:'roderic',sprite:'roderic',en:'You are getting less terrible at this road.',cn:'你越来越不擅长在这条路上犯错了。',next:'c1'},
 c1:{choice:{promptEn:'He slows his horse to match yours.',promptCn:'他把马速慢下来，和你并肩。',options:[
  {en:'“That almost sounded like praise.”',cn:'“这听起来几乎像夸奖了。”',fx:[['route','roderic',1],['rel','roderic','warmth',1]],goto:'r1'},
  {en:'Challenge him to race to the old milestone.',cn:'挑战他赛到前面的旧里程碑。',fx:[['route','roderic',1],['rel','roderic','rivalry',1]],goto:'r2'}]}},
 r1:{sp:'roderic',en:'Do not get greedy.',cn:'别得寸进尺。',next:'c2'},
 r2:{sp:'roderic',en:'There you are. I was worried recovery had made you sensible.',cn:'这才对。我还担心康复把你变得太理智了。',next:'c2'},
 c2:{choice:{promptEn:'At the milestone, he looks toward the estate road instead of turning back.',promptCn:'到了里程碑，他没有立刻掉头，而是看向领地方向。',options:[
  {en:'Ask what he thinks Rosier actually needs from its heir.',cn:'问他觉得Rosier真正需要继承人做什么。',fx:[['route','roderic',1],['rel','roderic','trust',1],['estate','stability',1]],goto:'r3'},
  {en:'Ask what he expects from you personally.',cn:'问他个人对自己有什么期待。',fx:[['route','roderic',1],['rel','roderic','intimacy',1]],goto:'r4'}]}},
 r3:{sp:'roderic',en:'Show up. See things yourself. And stop letting polished reports do all your riding for you.',cn:'亲自出现。亲眼去看。还有，别让漂亮报告替你走完所有路。',next:'c3'},
 r4:{sp:'roderic',en:'At the moment? Keep surprising me. It is annoyingly effective.',cn:'现在？继续让我意外吧。烦人，但挺有效。',next:'c3'},
 c3:{choice:{promptEn:'He turns his horse homeward, but waits for you to choose the pace.',promptCn:'他掉转马头回程，却等着你决定速度。',options:[
  {en:'Ride slowly and ask about one old quarrel you had.',cn:'慢慢骑，问一件你们以前吵过的事。',fx:[['route','roderic',1],['identity','continuity',1],['rel','roderic','trust',1]],goto:'e1'},
  {en:'Race him home and leave the past for another day.',cn:'和他赛回去，把过去留到改天再问。',fx:[['route','roderic',1],['identity','self_defined',1],['rel','roderic','rivalry',1]],goto:'e2'},
  {en:'Tell him you want him to judge you by what you do now.',cn:'告诉他，希望他按现在做的事来评价自己。',fx:[['route','roderic',1],['identity','self_defined',1],['rel','roderic','intimacy',1]],goto:'e3'}]}},
 e1:{sp:'roderic',en:'Fine. But I get to tell it my way first.',cn:'行。但得先让我按我的版本讲。',end:true},
 e2:{sp:'roderic',en:'Finally, a philosophy I can race against.',cn:'终于有一种哲学能拿来赛马了。',end:true},
 e3:{sp:'roderic',en:'Already doing that. Do not make me say it twice.',cn:'早就在这么做了。别让我说第二遍。',end:true}
}};

SCENES.d18_damien = {bg:'conservatory',loc:'conservatory',start:'n1',nodes:{
 n1:{sp:'damien',sprite:'damien',en:'This is not an official invitation.',cn:'这不是正式邀请。',next:'c1'},
 c1:{choice:{promptEn:'He says it before greeting you.',promptCn:'他甚至在问候之前就先说了这句话。',options:[
  {en:'“Then what is it?”',cn:'“那它是什么？”',fx:[['route','damien',1],['rel','damien','vulnerability',1]],goto:'r1'},
  {en:'“Should I be worried you had to clarify?”',cn:'“你还需要特意澄清，我是不是该担心？”',fx:[['route','damien',1],['rel','damien','personal_trust',1]],goto:'r2'}]}},
 r1:{sp:'damien',en:'Tea. Conversation. Two people who are temporarily not performing their offices.',cn:'喝茶。聊天。两个暂时不用扮演自己职务的人。',next:'c2'},
 r2:{sp:'damien',en:'Probably. I have become suspiciously attached to distinctions lately.',cn:'大概吧。我最近对这种区别变得可疑地执着。',next:'c2'},
 c2:{choice:{promptEn:'Rain taps softly against the conservatory glass.',promptCn:'雨轻轻敲着温室的玻璃。',options:[
  {en:'Ask what Damien would do if he were not crown prince for one day.',cn:'问Damien，如果有一天不用做王储，他会做什么。',fx:[['route','damien',1],['rel','damien','vulnerability',1]],goto:'r3'},
  {en:'Tell him he can ask you something he would never ask in court.',cn:'告诉他，他可以问一个在宫廷里绝不会问的问题。',fx:[['route','damien',1],['rel','damien','personal_trust',1]],goto:'r4'}]}},
 r3:{sp:'damien',en:'Sleep until noon. Then disappear into a bookshop where no one recognizes me. A scandalous use of sovereignty.',cn:'睡到中午。然后躲进一家没人认得我的书店。对王权来说真是离经叛道的用法。',next:'c3'},
 r4:{sp:'damien',en:'Do you miss the person you were, even when you do not remember them?',cn:'即使你不记得从前的自己……你会想念那个人吗？',next:'c3'},
 c3:{choice:{promptEn:'For once, neither of you has an audience.',promptCn:'难得一次，你们都没有观众。',options:[
  {en:'Ask him to call you Nait here, not Rosier.',cn:'让他在这里叫自己Nait，不要叫Rosier。',fx:[['route','damien',1],['rel','damien','personal_trust',2]],goto:'e1'},
  {en:'Ask whether the crown prince can ever afford not to know who someone “really” is.',cn:'问他：王储是否有资格不去确认一个人“真正是谁”。',fx:[['route','damien',1],['identity','continuity',1],['rel','damien','vulnerability',1]],goto:'e2'},
  {en:'Tell him he does not need to decide what you are tonight.',cn:'告诉他，今晚不需要判断自己究竟是谁。',fx:[['route','damien',1],['identity','self_defined',1],['rel','damien','vulnerability',1]],goto:'e3'}]}},
 e1:{sp:'damien',en:'Nait, then.',cn:'那就——Nait。',end:true},
 e2:{sp:'damien',en:'The crown prince cannot. Damien sometimes wishes he could.',cn:'王储不可以。Damien有时希望自己可以。',end:true},
 e3:{sp:'damien',en:'That is a luxury I would like to borrow for one evening.',cn:'这是种奢侈。我想借用一个晚上。',end:true}
}};

SCENES.d18_family = {bg:'sitting_room',loc:'duke_study',start:'n1',nodes:{
 n1:{sp:'lucien',sprite:'lucien',en:'I have moved one recurring report to your desk. You may move it back if you hate it.',cn:'我把一份固定报告移到你桌上了。你若讨厌，可以原样退回来。',next:'c1'},
 c1:{choice:{promptEn:'Elise is standing behind him with the expression of someone who knows this is not true.',promptCn:'Elise站在他身后，表情明明白白写着：这话不可信。',options:[
  {en:'“You have already decided I am keeping it, haven’t you?”',cn:'“你已经决定让我继续看这份报告了，对吧？”',fx:[['route','family',1],['rel','lucien','trust',1]],goto:'r1'},
  {en:'Ask what Lucien looked for when he first started reading the same report.',cn:'问Lucien，他年轻时第一次看这份报告会先找什么。',fx:[['route','family',1],['estate','staff_trust',1]],goto:'r2'}]}},
 r1:{sp:'elise',sprite:'elise',en:'He told the clerk to deliver it every Tuesday three days ago.',cn:'他三天前就吩咐书记员每周二送来了。',next:'c2'},
 r2:{sp:'lucien',en:'What had changed from the previous month. Your grandfather taught me to distrust isolated numbers.',cn:'和上个月相比有什么变化。你祖父教我不要相信孤零零的数字。',next:'c2'},
 c2:{choice:{promptEn:'Lucien pushes the report toward you and waits.',promptCn:'Lucien把报告推到你面前，没有再开口。',options:[
  {en:'Ask him to stay while you read the first page.',cn:'请他留下，陪自己看完第一页。',fx:[['route','family',1],['rel','lucien','warmth',1]],goto:'r3'},
  {en:'Tell him you will bring him your questions at dinner.',cn:'告诉他，晚餐时再把自己的问题带给他。',fx:[['route','family',1],['rel','lucien','trust',1],['estate','staff_trust',1]],goto:'r4'}]}},
 r3:{sp:'lucien',en:'Of course.',cn:'当然。',next:'c3'},
 r4:{sp:'lucien',en:'Good. Bring disagreements too.',cn:'很好。不同意见也一起带来。',next:'c3'},
 c3:{choice:{promptEn:'The first page concerns a decision your father could easily make without you.',promptCn:'第一页是一件父亲完全可以不问你就自己决定的事。',options:[
  {en:'Ask why he is giving it to you now.',cn:'问他为什么现在开始把这些交给自己。',fx:[['route','family',1],['rel','lucien','trust',2]],goto:'e1'},
  {en:'Tell him you want responsibility gradually, not symbolically.',cn:'告诉他，自己想逐步承担真正责任，而不是只挂一个名义。',fx:[['route','family',1],['responsibility','high',1],['estate','stability',1]],goto:'e2'},
  {en:'Ask Elise to help you learn how the report affects the staff in practice.',cn:'请Elise也教自己，这份报告在现实中会怎么影响府中人员。',fx:[['route','family',1],['rel','elise','trust',1],['estate','staff_trust',1]],goto:'e3'}]}},
 e1:{sp:'lucien',en:'Because you are beginning to ask questions before I give you answers.',cn:'因为你已经开始在我给答案之前先提出问题了。',end:true},
 e2:{sp:'lucien',en:'Then I will give you work that can actually go wrong.',cn:'那我就会给你真正可能做错的工作。',end:true},
 e3:{sp:'elise',sprite:'elise',en:'Finally. Someone remembered that reports contain actual people.',cn:'终于。总算有人记得报告里写的其实都是活人。',end:true}
}};




/* ============================================================
   DIALOGUE DENSITY PASS
   Group scenes now breathe between choice beats. Multiple
   characters respond to each other instead of waiting for the
   player to advance the scene alone.
   ============================================================ */

SCENES.d8_group = {bg:'garden',loc:'garden',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'By dinner, a simple invitation has somehow become six chairs around a small garden table.',cn:'到了晚餐，一句随口的邀请莫名其妙变成了花园小桌旁的六把椅子。',next:'n2'},
 n2:{sp:'roderic',sprite:'roderic',en:'I was told this was informal. Why is the prince here?',cn:'我听说这是非正式晚餐。那王储为什么会在这里？',next:'n3'},
 n3:{sp:'damien',sprite:'damien',en:'Because I was also told it was informal.',cn:'因为我也听说这是非正式晚餐。',next:'n4'},
 n4:{sp:'alaric',sprite:'alaric',en:'The word appears to have lost all operational meaning.',cn:'看来“非正式”这个词已经失去实际意义了。',next:'n5'},
 n5:{sp:'elise',sprite:'elise',en:'Good. Then perhaps everyone can stop testing its limits and sit down.',cn:'很好。那大家也许可以停止测试它的边界，先坐下吃饭。',next:'c1'},
 c1:{choice:{promptEn:'The first course arrives under suspicious silence.',promptCn:'第一道菜在一种非常可疑的安静里端了上来。',options:[
  {en:'“No titles until dessert.”',cn:'“甜点之前不许叫头衔。”',fx:[['route','ensemble',2],['rel','damien','personal_trust',1]],goto:'a1'},
  {en:'“I wanted to see whether all of you can survive one dinner together.”',cn:'“我只是想看看你们能不能一起活过一顿晚餐。”',fx:[['route','ensemble',2],['rel','roderic','warmth',1]],goto:'b1'}]}},
 a1:{sp:'damien',sprite:'damien',en:'Dangerous precedent.',cn:'这是个危险的先例。',next:'a2'},
 a2:{sp:'roderic',sprite:'roderic',en:'Excellent. Damien, pass the salt.',cn:'太好了。Damien，把盐递一下。',next:'a3'},
 a3:{sp:'damien',en:'You have been waiting years to do that.',cn:'你等这句话等很多年了吧。',next:'m1'},
 b1:{sp:'alaric',sprite:'alaric',en:'An uncontrolled experiment. I object to the methodology.',cn:'无控制变量实验。我反对这种方法。',next:'b2'},
 b2:{sp:'roderic',sprite:'roderic',en:'You object to dinner now?',cn:'你现在连吃饭都要反对？',next:'b3'},
 b3:{sp:'alaric',en:'Only poorly designed dinner.',cn:'我只反对设计不良的晚餐。',next:'m1'},
 m1:{sp:'elise',sprite:'elise',en:'Wonderful. State business, magic catastrophes, and old grudges are banned until dessert.',cn:'很好。甜点之前，国事、魔法灾难和陈年旧怨全部禁止。',next:'m2'},
 m2:{sp:'lucien',sprite:'lucien',en:'You forgot court gossip.',cn:'你漏了宫廷八卦。',next:'m3'},
 m3:{sp:'elise',sprite:'elise',en:'That one is permitted if it is funny.',cn:'那个如果足够好笑，可以例外。',next:'c2'},
 c2:{choice:{promptEn:'By dessert, the table has become noticeably less formal.',promptCn:'到了甜点，桌上的气氛已经明显没那么正式了。',options:[
  {en:'Ask everyone for one harmless thing they actually enjoy.',cn:'让每个人说一件真正喜欢、而且不会引发争吵的小事。',fx:[['route','ensemble',2],['rel','alaric','trust',1],['rel','roderic','warmth',1]],goto:'e1a'},
  {en:'Ask who knew the old Nait best.',cn:'问谁最了解从前的Nait。',fx:[['route','ensemble',1],['flag','group_old_nait_views',true]],goto:'e2a'}]}},
 e1a:{sp:'roderic',sprite:'roderic',en:'Horses. Obviously.',cn:'马。显而易见。',next:'e1b'},
 e1b:{sp:'alaric',sprite:'alaric',en:'Old maps. Marginal notes in books. Tea that has not been murdered with sugar.',cn:'旧地图。书页边缘的批注。以及没有被糖谋杀的茶。',next:'e1c'},
 e1c:{sp:'damien',sprite:'damien',en:'Winter oranges.',cn:'冬天的橙子。',next:'e1d'},
 e1d:{sp:'elise',sprite:'elise',en:'See? Entirely ordinary people. Miraculous.',cn:'看吧？全都是普通人。真是奇迹。',fx:[['route','ensemble',1]],end:true},
 e2a:{sp:'roderic',sprite:'roderic',en:'Define “best.” Fondly, accurately, or with the most embarrassing evidence?',cn:'先定义一下“了解”。最喜欢、最准确，还是手里黑历史最多？',next:'e2b'},
 e2b:{sp:'damien',sprite:'damien',en:'Those are unfortunately three different competitions.',cn:'不幸的是，这确实是三个不同项目。',next:'e2c'},
 e2c:{sp:'alaric',sprite:'alaric',en:'And none of them produce objective testimony.',cn:'而且没有一个能产生客观证词。',next:'e2d'},
 e2d:{sp:'elise',sprite:'elise',en:'Wonderful. Dessert is over. I am reinstating the ban.',cn:'很好。甜点结束。禁令恢复。',fx:[['route','ensemble',1]],end:true}
}};

SCENES.d12_group_city = {bg:'market',loc:'market',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'A planned lunch becomes a small expedition before anyone admits it.',cn:'原本计划好的午餐，在没人承认的情况下变成了一次小型远征。',next:'n2'},
 n2:{sp:'roderic',sprite:'roderic',en:'That musician is playing the march wrong.',cn:'那个乐师把进行曲拉错了。',next:'n3'},
 n3:{sp:'damien',sprite:'damien',en:'You know the royal march?',cn:'你居然知道王室进行曲？',next:'n4'},
 n4:{sp:'roderic',sprite:'roderic',en:'I know when something is being murdered in public.',cn:'我至少知道什么时候有人在公开谋杀一首曲子。',next:'n5'},
 n5:{sp:'alaric',sprite:'alaric',en:'Technically, tempo is not homicide.',cn:'严格来说，节奏错误不构成谋杀。',next:'n6'},
 n6:{sp:'elise',sprite:'elise',en:'Please do not turn a street performance into a legal argument.',cn:'拜托，别把街头演奏变成法律讨论。',next:'c1'},
 c1:{choice:{promptEn:'The musician notices the entire group watching.',promptCn:'乐师注意到这一群人都在看他。',options:[
  {en:'Drop a coin in the case before Roderic can critique him again.',cn:'赶在Roderic再次点评之前先往琴盒里放钱。',fx:[['route','ensemble',2],['estate','reputation',1]],goto:'a1'},
  {en:'Ask Damien whether he actually knows the musician.',cn:'问Damien，他是不是其实认识那个乐师。',fx:[['route','ensemble',2],['rel','damien','personal_trust',1]],goto:'b1'}]}},
 a1:{sp:'roderic',sprite:'roderic',en:'I was being constructive.',cn:'我刚才是在建设性批评。',next:'a2'},
 a2:{sp:'elise',sprite:'elise',en:'Your face was not constructive.',cn:'你的脸不是。',next:'m1'},
 b1:{sp:'damien',sprite:'damien',en:'He played at a palace winter feast once.',cn:'他以前在王宫冬宴上演奏过一次。',next:'b2'},
 b2:{sp:'alaric',sprite:'alaric',en:'So you were pretending not to know him.',cn:'所以你刚才确实在假装不认识。',next:'b3'},
 b3:{sp:'damien',en:'I was allowing a private citizen the dignity of not being inspected by a prince while working.',cn:'我是在允许一个普通人在工作时，不必承受王储的检阅。',next:'m1'},
 m1:{sp:null,sprite:'none',en:'Ten minutes later, Alaric stops at a bookstall. Roderic stops because Alaric stopped. Damien stops because everyone else did.',cn:'十分钟后，Alaric停在一家书摊前。Roderic因为Alaric停了而停。Damien因为所有人都停了，也只好停。',next:'m2'},
 m2:{sp:'alaric',sprite:'alaric',en:'This edition has the wrong diagram on page forty-three.',cn:'这个版本第四十三页的图是错的。',next:'m3'},
 m3:{sp:'roderic',sprite:'roderic',en:'How do you know that without opening it?',cn:'你连书都没翻开，怎么知道？',next:'m4'},
 m4:{sp:'alaric',en:'The cover is from the bad printing.',cn:'因为这个封面属于那批印错的版本。',next:'c2'},
 c2:{choice:{promptEn:'The bookseller has begun listening nervously.',promptCn:'书商已经开始紧张地偷听。',options:[
  {en:'Buy the flawed copy and ask Alaric to mark every error later.',cn:'把错版买下来，让Alaric以后把所有错误都标出来。',fx:[['route','ensemble',2],['rel','alaric','warmth',1]],goto:'e1'},
  {en:'Drag everyone away before the shop becomes an academic tribunal.',cn:'赶紧把大家带走，免得书摊变成学术审判庭。',fx:[['route','ensemble',2],['rel','roderic','warmth',1]],goto:'e2'}]}},
 e1:{sp:'damien',sprite:'damien',en:'You have just purchased several hours of Varenne being offended by typography.',cn:'你刚刚买下了Varenne对排版生气好几个小时的资格。',next:'e1b'},
 e1b:{sp:'elise',sprite:'elise',en:'Worth every coin.',cn:'每一个铜币都值。',end:true},
 e2:{sp:'alaric',sprite:'alaric',en:'I had not finished.',cn:'我还没说完。',next:'e2b'},
 e2b:{sp:'roderic',sprite:'roderic',en:'Exactly why we are leaving.',cn:'所以我们才要走。',end:true}
}};

SCENES.d15_group_out = {bg:'riverside',loc:'riverside',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'Someone suggests a picnic. No one agrees who. This is how six people reach the river with too much bread and no knife.',cn:'有人提议野餐。没人承认是谁提的。于是六个人带着过量的面包、却没带刀，到了河边。',next:'n2'},
 n2:{sp:'damien',sprite:'damien',en:'I am crown prince of a realm that apparently cannot organize cheese.',cn:'我是一个连奶酪都组织不好的国家的王储。',next:'n3'},
 n3:{sp:'roderic',sprite:'roderic',en:'You brought three kinds of tea and no knife.',cn:'你带了三种茶，却没带刀。',next:'n4'},
 n4:{sp:'damien',sprite:'damien',en:'Tea is civilized.',cn:'茶是文明。',next:'n5'},
 n5:{sp:'alaric',sprite:'alaric',en:'A knife would currently be more useful to civilization.',cn:'以目前情况来说，刀对文明更有帮助。',next:'n6'},
 n6:{sp:'elise',sprite:'elise',en:'I have a fruit knife.',cn:'我有水果刀。',next:'n7'},
 n7:{sp:'roderic',sprite:'roderic',en:'Of course you do.',cn:'我就知道你有。',next:'c1'},
 c1:{choice:{promptEn:'The picnic is saved with suspicious efficiency.',promptCn:'野餐以一种可疑的高效率被拯救了。',options:[
  {en:'Put Elise officially in charge of logistics.',cn:'正式宣布Elise负责后勤。',fx:[['route','ensemble',2],['rel','elise','trust',1]],goto:'a1'},
  {en:'Make everyone contribute one thing next time.',cn:'规定下次每个人都必须负责带一样东西。',fx:[['route','ensemble',2],['flag','group_picnic_roles',true]],goto:'b1'}]}},
 a1:{sp:'elise',sprite:'elise',en:'I was already in charge. You have simply recognized the government.',cn:'我本来就在负责。你只是正式承认了现政府。',next:'m1'},
 b1:{sp:'alaric',sprite:'alaric',en:'Define categories before Roderic brings a horse as his contribution.',cn:'请先定义“东西”的类别，免得Roderic下次带一匹马来。',next:'b2'},
 b2:{sp:'roderic',sprite:'roderic',en:'A horse is useful.',cn:'马当然有用。',next:'m1'},
 m1:{sp:null,sprite:'none',en:'After lunch, the conversation drifts from roads to weather to childhood punishments.',cn:'午饭后，话题从道路一路飘到天气，最后莫名其妙落在小时候受过什么罚。',next:'m2'},
 m2:{sp:'damien',sprite:'damien',en:'I once had to copy fifty pages of treaty law for climbing the palace roof.',cn:'我小时候因为爬王宫屋顶，被罚抄过五十页条约法。',next:'m3'},
 m3:{sp:'roderic',sprite:'roderic',en:'That is the first interesting thing you have ever told me about royal education.',cn:'这是你说过的关于王室教育最有意思的一件事。',next:'m4'},
 m4:{sp:'alaric',sprite:'alaric',en:'Why were you on the roof?',cn:'你为什么要上屋顶？',next:'m5'},
 m5:{sp:'damien',sprite:'damien',en:'To see whether the west tower was actually taller.',cn:'想确认西塔是不是真的更高。',next:'c2'},
 c2:{choice:{promptEn:'Everyone is now invested in an eleven-year-old prince on a roof.',promptCn:'现在所有人都开始关心一个十一岁王储爬屋顶的问题。',options:[
  {en:'Ask whether he found out.',cn:'问他最后确认了吗。',fx:[['route','ensemble',2],['rel','damien','vulnerability',1]],goto:'e1'},
  {en:'Ask the others for their worst childhood idea too.',cn:'顺势让其他人也说一个小时候最糟糕的主意。',fx:[['route','ensemble',3],['rel','roderic','warmth',1],['rel','alaric','warmth',1]],goto:'e2'}]}},
 e1:{sp:'damien',sprite:'damien',en:'It was. By approximately half a meter. The punishment was therefore scientifically worthwhile.',cn:'是。大概高半米。所以从科学角度说，那顿罚很值得。',next:'e1b'},
 e1b:{sp:'alaric',sprite:'alaric',en:'Your use of “scientifically” is offensive.',cn:'你这样使用“科学”这个词让我感到冒犯。',end:true},
 e2:{sp:'roderic',sprite:'roderic',en:'We need more bread before I answer that.',cn:'这个问题我得再吃点面包才回答。',next:'e2b'},
 e2b:{sp:'elise',sprite:'elise',en:'Excellent. I brought too much.',cn:'太好了。我正好多带了。',end:true}
}};

SCENES.d17_group_problem = {bg:'riverside',loc:'riverside',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'A broken cart wheel becomes a committee meeting by accident.',cn:'一只坏掉的马车轮，意外变成了一场委员会会议。',next:'n2'},
 n2:{sp:'roderic',sprite:'roderic',en:'We could simply fix it.',cn:'我们也可以直接修。',next:'n3'},
 n3:{sp:'alaric',sprite:'alaric',en:'I was establishing why it failed.',cn:'我在确认它为什么坏。',next:'n4'},
 n4:{sp:'damien',sprite:'damien',en:'And I was establishing who owns it.',cn:'而我在确认它归谁。',next:'n5'},
 n5:{sp:'elise',sprite:'elise',en:'The owner is standing three steps away and looks ready to apologize for existing.',cn:'车主就站在三步外，而且看起来快要为自己存在这件事道歉了。',next:'c1'},
 c1:{choice:{promptEn:'The cart still needs to move before sunset.',promptCn:'无论如何，这辆车得在天黑前重新上路。',options:[
  {en:'Put Roderic on the wheel, Alaric on the cause, and Damien on the paperwork.',cn:'Roderic修轮子，Alaric查原因，Damien处理手续。',fx:[['route','ensemble',2],['estate','stability',1]],goto:'a1'},
  {en:'Ask Damien to talk to the owner first, then let the others work.',cn:'先让Damien和车主说明情况，再让其他人动手。',fx:[['route','ensemble',2],['rel','damien','personal_trust',1]],goto:'b1'}]}},
 a1:{sp:'roderic',sprite:'roderic',en:'Finally. Government by common sense.',cn:'终于。常识治理。',next:'a2'},
 a2:{sp:'damien',sprite:'damien',en:'You say that as though common sense has ever survived contact with government.',cn:'你说得好像常识碰到政府之后还能活下来一样。',next:'a3'},
 a3:{sp:'alaric',sprite:'alaric',en:'The axle pin is worn unevenly. This is not a one-day failure.',cn:'车轴销磨损不均。这不是一天造成的问题。',next:'m1'},
 b1:{sp:'damien',sprite:'damien',en:'I was being reassuring.',cn:'我刚才是在让他安心。',next:'b2'},
 b2:{sp:'elise',sprite:'elise',en:'You asked for his full name, tax district, and destination.',cn:'你刚才问了他的全名、纳税区和目的地。',next:'b3'},
 b3:{sp:'damien',en:'Context is reassuring.',cn:'了解情况本身就令人安心。',next:'m1'},
 m1:{sp:'roderic',sprite:'roderic',en:'Hold the cart steady.',cn:'扶稳车。',next:'m2'},
 m2:{sp:'alaric',sprite:'alaric',en:'Do not hammer that yet.',cn:'先别敲那个。',next:'m3'},
 m3:{sp:'roderic',sprite:'roderic',en:'I know how wheels work.',cn:'我知道轮子怎么修。',next:'m4'},
 m4:{sp:'alaric',sprite:'alaric',en:'And I know how fractures propagate.',cn:'我知道裂纹怎么扩展。',next:'m5'},
 m5:{sp:'elise',sprite:'elise',en:'Wonderful. Cooperate before I repair it myself.',cn:'很好。你们两个合作，不然我自己来修。',next:'c2'},
 c2:{choice:{promptEn:'Half an hour later, the wheel turns cleanly again.',promptCn:'半小时后，轮子终于重新顺畅转起来。',options:[
  {en:'Ask the owner what else regularly goes wrong on this road.',cn:'问车主这条路上还有什么经常出问题。',fx:[['route','ensemble',1],['estate','stability',1],['flag','road_user_feedback',true]],goto:'r1'},
  {en:'Keep everyone together and walk to the river for lunch.',cn:'干脆大家一起去河边吃午饭。',fx:[['route','ensemble',2],['rel','roderic','warmth',1],['rel','alaric','trust',1]],goto:'r2'}]}},
 r1:{sp:null,sprite:'none',en:'The owner mentions ruts near the lower ford, missing mile markers, and a drainage ditch nobody has cleared since spring.',cn:'车主提到下游浅滩附近的车辙、缺失的里程碑，还有一条从春天起就没人清过的排水沟。',next:'r1b'},
 r1b:{sp:'damien',sprite:'damien',en:'There. A better report than half the ones sent to the capital.',cn:'看。比送到王都的一半报告都更有用。',next:'r1c'},
 r1c:{sp:'elise',sprite:'elise',en:'And cheaper.',cn:'而且更便宜。',end:true},
 r2:{sp:'roderic',sprite:'roderic',en:'Good. I have earned lunch.',cn:'很好。我已经靠劳动挣到午饭了。',next:'r2b'},
 r2b:{sp:'alaric',sprite:'alaric',en:'You hit a metal pin three times.',cn:'你只敲了三下金属销。',next:'r2c'},
 r2c:{sp:'roderic',sprite:'roderic',en:'With expertise.',cn:'但敲得很专业。',next:'r2d'},
 r2d:{sp:'damien',sprite:'damien',en:'I am beginning to understand why informal outings require no minutes.',cn:'我开始明白为什么非正式出行不需要会议记录了。',end:true}
}};

SCENES.d18_group = {bg:'market',loc:'market',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'You choose the city and invite everyone. It should be impossible. Somehow, five schedules bend.',cn:'你选择进城，还顺手邀请了所有人。按理说根本凑不齐。可五份日程居然真的一起弯了。',next:'n2'},
 n2:{sp:'damien',sprite:'damien',en:'I moved a council briefing for this.',cn:'我为了这个挪了一场议事会。',next:'n3'},
 n3:{sp:'roderic',sprite:'roderic',en:'That is either touching or terrible governance.',cn:'这要么很感人，要么是很糟的治理。',next:'n4'},
 n4:{sp:'alaric',sprite:'alaric',en:'Those possibilities are not mutually exclusive.',cn:'这两个可能性并不互斥。',next:'n5'},
 n5:{sp:'elise',sprite:'elise',en:'Before anyone indicts the crown prince, Alaric has already stopped at a bookstall.',cn:'在有人正式弹劾王储之前，Alaric已经在一家书摊前停下来了。',next:'c1'},
 c1:{choice:{promptEn:'The group has survived together for less than four minutes.',promptCn:'这支队伍一起行动还不到四分钟。',options:[
  {en:'Let everyone split up and regroup for lunch.',cn:'让大家先各逛各的，午饭再集合。',fx:[['route','ensemble',1],['rel','alaric','warmth',1]],goto:'a1'},
  {en:'Insist on staying together and see how long it lasts.',cn:'坚持大家一起走，看看能撑多久。',fx:[['route','ensemble',1],['rel','roderic','warmth',1]],goto:'b1'}]}},
 a1:{sp:'elise',sprite:'elise',en:'Sensibly managed. Suspiciously so.',cn:'管理得很合理。合理得让我怀疑。',next:'a2'},
 a2:{sp:'damien',sprite:'damien',en:'Set a time and a landmark. I have seen committees fail at less.',cn:'定时间，定地标。我见过委员会因为更简单的事失败。',next:'m1'},
 b1:{sp:'damien',sprite:'damien',en:'Seven minutes.',cn:'七分钟。',next:'b2'},
 b2:{sp:'roderic',sprite:'roderic',en:'What happened at seven?',cn:'第七分钟怎么了？',next:'b3'},
 b3:{sp:'damien',en:'Varenne disappeared into a print shop.',cn:'Varenne消失进了一家印刷铺。',next:'b4'},
 b4:{sp:'alaric',sprite:'alaric',en:'I was visible through the window.',cn:'从窗户外一直能看见我。',next:'m1'},
 m1:{sp:null,sprite:'none',en:'At lunch, everyone returns with something they did not plan to buy.',cn:'午饭时，每个人都带着一件原本没打算买的东西回来。',next:'m2'},
 m2:{sp:'roderic',sprite:'roderic',en:'I refuse to explain the wooden duck.',cn:'我拒绝解释这只木头鸭子。',next:'m3'},
 m3:{sp:'elise',sprite:'elise',en:'No one asked.',cn:'没人问。',next:'m4'},
 m4:{sp:'damien',sprite:'damien',en:'I was about to.',cn:'我正准备问。',next:'c2'},
 c2:{choice:{promptEn:'There is one empty chair left at the table.',promptCn:'桌边还剩最后一把空椅子。',options:[
  {en:'Leave it empty and order extra food for whoever wanders in.',cn:'空着吧，再多点一份，谁路过谁坐。',fx:[['route','ensemble',1],['estate','reputation',1]],goto:'c2a'},
  {en:'Ask everyone where the group should go next month.',cn:'问大家下个月集体出门想去哪儿。',fx:[['route','ensemble',1],['flag','group_future_plan',true]],goto:'c2b'}]}},
 c2a:{sp:null,sprite:'none',en:'A junior academy clerk eventually takes the chair after three rounds of insisting he absolutely cannot.',cn:'最后，一位年轻学院书记员在推辞了三轮“绝对不行”之后坐下了。',next:'c2a2'},
 c2a2:{sp:'alaric',sprite:'alaric',en:'He has a question about my paper.',cn:'他想问我一篇论文。',next:'c2a3'},
 c2a3:{sp:'roderic',sprite:'roderic',en:'Of course he does.',cn:'我就知道。',next:'c3'},
 c2b:{sp:'roderic',sprite:'roderic',en:'Somewhere with horses.',cn:'有马的地方。',next:'c2b2'},
 c2b2:{sp:'alaric',sprite:'alaric',en:'Somewhere with archives.',cn:'有档案的地方。',next:'c2b3'},
 c2b3:{sp:'damien',sprite:'damien',en:'Those requirements describe an alarming number of royal properties.',cn:'这两个条件能同时形容很多王室产业，令人不安。',next:'c3'},
 c3:{choice:{promptEn:'By late afternoon, everyone is tired enough to stop performing.',promptCn:'到了傍晚，所有人都累到懒得再维持体面。',options:[
  {en:'Suggest making one day like this a monthly habit.',cn:'提议以后每个月都找一天这样聚一次。',fx:[['route','ensemble',2],['flag','monthly_group_day',true]],goto:'e1'},
  {en:'Ask everyone for one place they would never normally invite the others.',cn:'让每个人说一个平时绝不会邀请其他人去的地方。',fx:[['route','ensemble',2],['flag','group_private_places',true]],goto:'e2'},
  {en:'Say nothing. Just let the day end without turning it into anything official.',cn:'什么也不说，就让今天在没有任何正式定义的情况下结束。',fx:[['route','ensemble',2],['rel','damien','personal_trust',1],['rel','roderic','warmth',1],['rel','alaric','warmth',1]],goto:'e3'}]}},
 e1:{sp:'roderic',sprite:'roderic',en:'Monthly? Fine. But next time the prince is carrying something.',cn:'每个月？行。但下次王储必须负责拿东西。',next:'e1b'},
 e1b:{sp:'damien',sprite:'damien',en:'I carried the consequences of moving a council briefing.',cn:'我已经承担了挪开议事会的后果。',next:'e1c'},
 e1c:{sp:'elise',sprite:'elise',en:'Next time you can also carry the basket.',cn:'下次你还可以承担篮子。',end:true},
 e2:{sp:'alaric',sprite:'alaric',en:'That is an appalling question. I already have three answers.',cn:'这是个糟糕的问题。我已经有三个答案了。',next:'e2b'},
 e2b:{sp:'roderic',sprite:'roderic',en:'Then yours first.',cn:'那你先说。',next:'e2c'},
 e2c:{sp:'alaric',en:'Absolutely not.',cn:'绝对不。',end:true},
 e3:{sp:'elise',sprite:'elise',en:'There. No resolution, no minutes, no official purpose. A successful day.',cn:'就是这样。没有结论，没有记录，没有正式目的。非常成功的一天。',end:true}
}};

SCENES.d20_field_anomaly = {bg:'riverside',loc:'riverside',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'At the river, the strange pressure returns — not in the air this time, but under the water.',cn:'在河边，那种奇怪的压迫感又出现了。这一次不在空气里，而在水下。',next:'n2'},
 n2:{sp:'alaric',sprite:'alaric',en:'Do not touch it.',cn:'别碰。',next:'n3'},
 n3:{sp:'roderic',sprite:'roderic',en:'For once, that was also going to be my advice.',cn:'难得一次，我刚才也正准备这么说。',next:'n4'},
 n4:{sp:'damien',sprite:'damien',en:'How far back?',cn:'退多远？',next:'n5'},
 n5:{sp:'alaric',sprite:'alaric',en:'Until I know what it is, farther than feels necessary.',cn:'在我弄清楚之前，退到比你觉得有必要的距离还远一点。',next:'c1'},
 c1:{choice:{promptEn:'The water is perfectly still around one dark patch of riverbed.',promptCn:'河床有一块暗色区域，周围的水静得不正常。',options:[
  {en:'Ask Alaric what can be observed safely from here.',cn:'问Alaric，站在这里可以安全观察什么。',fx:[['route','alaric',1],['rel','alaric','trust',1]],goto:'a1'},
  {en:'Ask Roderic to move everyone farther from the bank first.',cn:'先请Roderic把大家带得离河岸更远一点。',fx:[['route','roderic',1],['estate','stability',1]],goto:'b1'},
  {en:'Ask Damien whether this area appears on royal survey maps.',cn:'问Damien，这片区域是否出现在王室勘测记录里。',fx:[['route','damien',1],['estate','court_influence',1]],goto:'d1'}]}},
 a1:{sp:'alaric',sprite:'alaric',en:'Watch the reeds. Not the water. If they move without wind, tell me.',cn:'看芦苇，不要盯水。如果没风却动了，告诉我。',next:'a2'},
 a2:{sp:'roderic',sprite:'roderic',en:'That is unsettlingly specific.',cn:'这个要求具体得让人不安。',next:'m1'},
 b1:{sp:'roderic',sprite:'roderic',en:'Back. All of you. Yes, that includes the prince.',cn:'往后。所有人。对，也包括王储。',next:'b2'},
 b2:{sp:'damien',sprite:'damien',en:'I had inferred that.',cn:'我已经推断到了。',next:'m1'},
 d1:{sp:'damien',sprite:'damien',en:'There is an old flood survey. I can have it at Rosecourt by morning.',cn:'有一份旧洪水勘测。我明早可以让它送到Rosecourt。',next:'d2'},
 d2:{sp:'alaric',sprite:'alaric',en:'Request the original if possible. Copies lose annotations.',cn:'如果可能，调原件。副本会丢失批注。',next:'m1'},
 m1:{sp:null,sprite:'none',en:'A faint ring appears beneath the surface, pale against the dark riverbed.',cn:'水面下浮出一圈极淡的轮廓，在暗色河床上显得格外苍白。',next:'m2'},
 m2:{sp:'roderic',sprite:'roderic',en:'That looks familiar.',cn:'这个看起来很眼熟。',next:'m3'},
 m3:{sp:'alaric',sprite:'alaric',en:'Yes.',cn:'是。',next:'m4'},
 m4:{sp:'damien',sprite:'damien',en:'The library circle.',cn:'图书室的圆。',next:'m5'},
 m5:{sp:'elise',sprite:'elise',en:'I dislike how quickly everyone agreed on that.',cn:'我不喜欢大家这么快就达成一致。',next:'c2'},
 c2:{choice:{promptEn:'No one dismisses the resemblance.',promptCn:'没有任何人否认两者相似。',options:[
  {en:'Say the resemblance should be treated as a shared lead.',cn:'提出把两处圆的相似当作大家共同调查的线索。',fx:[['route','ensemble',1],['flag','anomaly_network_confirmed',true]],goto:'s1'},
  {en:'Ask Alaric whether two sites could be part of one magical structure.',cn:'问Alaric，两处异象有没有可能属于同一个魔法结构。',fx:[['route','alaric',1],['flag','anomaly_network_confirmed',true]],goto:'s2'},
  {en:'Ask Damien who had authority to seal the old flood survey.',cn:'追问Damien，谁有权封存那份旧洪水勘测。',fx:[['route','damien',1],['flag','survey_chain_questioned',true]],goto:'s3'}]}},
 s1:{sp:'damien',sprite:'damien',en:'Agreed. No private kingdoms of information.',cn:'同意。谁都别建立自己的情报小王国。',next:'s1b'},
 s1b:{sp:'alaric',sprite:'alaric',en:'Provided “shared” means full copies, not summaries.',cn:'前提是“共享”指完整副本，不是摘要。',next:'s1c'},
 s1c:{sp:'roderic',sprite:'roderic',en:'And provided someone explains the copies in normal language.',cn:'以及得有人把副本翻译成人话。',next:'c3'},
 s2:{sp:'alaric',sprite:'alaric',en:'Possible. I was hoping you would not ask until I had a less unpleasant answer.',cn:'有可能。我本来希望你晚一点再问，至少等我有个没那么糟的答案。',next:'s2b'},
 s2b:{sp:'damien',sprite:'damien',en:'How unpleasant?',cn:'有多糟？',next:'s2c'},
 s2c:{sp:'alaric',en:'Large enough that “two locations” may be the wrong scale of question.',cn:'糟到“两个地点”可能根本不是正确的问题尺度。',next:'c3'},
 s3:{sp:'damien',sprite:'damien',en:'My father\'s survey office. Lucien\'s predecessor. And someone who ordered one page sealed.',cn:'我父王的勘测署、Lucien的前任——以及一个下令封存其中一页的人。',next:'s3b'},
 s3b:{sp:'elise',sprite:'elise',en:'Which means the missing page is not an accident.',cn:'那就意味着缺掉的那一页不是意外。',next:'s3c'},
 s3c:{sp:'roderic',sprite:'roderic',en:'Good. I prefer deliberate problems. At least they have someone to blame.',cn:'很好。我比较喜欢人为的问题。至少最后能找到一个该骂的人。',next:'c3'},
 c3:{choice:{promptEn:'The ring fades. The question does not.',promptCn:'水下的圆消失了。问题没有。',options:[
  {en:'Set a rule that all evidence is shared from now on.',cn:'定下规则：从现在开始，所有相关证据都共享。',fx:[['route','ensemble',2],['flag','shared_investigation_protocol',true]],goto:'e1'},
  {en:'Let Alaric lead magic research while you and Lucien keep the estate records.',cn:'让Alaric负责魔法研究，领地记录由自己和Lucien掌握。',fx:[['route','alaric',1],['route','family',1],['responsibility','high',1]],goto:'e2'},
  {en:'Insist on seeing the sealed survey page before accepting any theory.',cn:'在接受任何理论之前，坚持先看到那张被封存的勘测页。',fx:[['identity','self_defined',1],['flag','sealed_survey_goal',true]],goto:'e3'}]}},
 e1:{sp:'damien',sprite:'damien',en:'Agreed.',cn:'同意。',next:'e1b'},
 e1b:{sp:'roderic',sprite:'roderic',en:'That sounded suspiciously like a meeting conclusion.',cn:'这听起来可疑地像一条会议结论。',next:'e1c'},
 e1c:{sp:'elise',sprite:'elise',en:'Then someone else can write it down.',cn:'那就让别人负责记录。',end:true},
 e2:{sp:'alaric',sprite:'alaric',en:'Acceptable. Provided I receive copies, not summaries.',cn:'可以。前提是给我副本，不要只给摘要。',next:'e2b'},
 e2b:{sp:'damien',sprite:'damien',en:'I will request the survey before the palace bureaucracy remembers how to resist.',cn:'我会趁王宫官僚系统还没想起来该怎么拒绝之前把勘测资料调出来。',end:true},
 e3:{sp:'roderic',sprite:'roderic',en:'Good. An answer that starts with actually looking at the thing.',cn:'很好。终于是一个先去看证据再说的答案。',next:'e3b'},
 e3b:{sp:'alaric',sprite:'alaric',en:'For once, we agree on method.',cn:'难得一次，我们在方法上达成一致。',end:true}
}};


/* ============================================================
   WEEK 1 INTERACTION PASS v0.2
   Days 4-7: longer player reactions and identity formation.
   ============================================================ */
SCENES.d4_breakfast = {bg:'bedroom',loc:'bedroom',start:'n1',nodes:{
 n1:{sp:'elise',sprite:'elise',en:'Breakfast arrives with three sealed letters and one newspaper folded beneath the tray. Elise hesitates before setting the paper down.',cn:'早餐和三封封蜡的信一起送来，托盘下面还压着一份折好的报纸。Elise把报纸放下时迟疑了一下。',next:'n2'},
 n2:{sp:'elise',en:'“The capital has found several new ways to say you were dying.”',cn:"“王都这几天又传出了好几个版本。总之，都说您快不行了。”",next:'cb1'},
 cb1:{branch:[{traitGte:['humor_under_pressure',1],goto:'cb_humor'},{traitGte:['honest_uncertainty',1],goto:'cb_honest'}],else:'n3'},
 cb_humor:{sp:'elise',en:'“None of them are as funny as the joke you made on your first morning.” Her mouth twitches. “Unfortunately.”',cn:"她嘴角动了动。“可惜，都不如您刚醒那天的玩笑好笑。”",next:'n3'},
 cb_honest:{sp:'elise',en:'“I thought you would rather hear the ugly version than a comforting lie.”',cn:'“我想，比起好听的谎话，您大概更愿意听难听的真话。”',next:'n3'},
 n3:{sp:'lucien',sprite:'lucien',en:'Lucien enters without ceremony. “And now that you are awake, they have found a new question: whether waking was enough.”',cn:"Lucien没有让人通报，径直走了进来。“现在倒不说你醒不过来了，开始怀疑你醒了以后还能做什么。”",next:'n4'},
 n4:{sp:'lucien',en:'He lays the letters beside your plate. One is from an old ally asking after your health. One is politely vague. The last asks whether Rosier intends to make any changes to its succession arrangements.',cn:"他把信放到你的餐盘旁。一封是老盟友来问候，一封满纸客套，看不出用意。最后一封则直接问起，Rosier是否准备调整继承安排。",next:'c1'},
 c1:{choice:{promptEn:'How much do you want to know?',promptCn:'你希望知道多少？',options:[
  {en:'Give me the letters. I want to read what they actually wrote.',cn:'把信给我。我想看他们究竟写了什么。',fx:[['flag','political_curiosity',true],['flag','reads_rumor_letters',true],['rel','lucien','trust',1]],fb:{en:'Lucien studies you once, then pushes all three letters across the table.',cn:'Lucien看了你一眼，随后把三封信全部推了过来。'},goto:'n5'},
  {en:'Summarize them for me. I trust you to tell me what matters.',cn:"给我说说要紧的事就好。我相信你的判断。",fx:[['flag','trusts_family_filter',true],['rel','lucien','trust',1],['rel','elise','trust',1]],fb:{en:'Lucien nods. Elise visibly relaxes by half a breath.',cn:'Lucien点头。Elise也几不可察地松了半口气。'},goto:'n5'},
  {en:'Tell me what I need to do, not what everyone is saying.',cn:"告诉我该怎么做就好。那些议论，不听也罢。",fx:[['flag','practical_focus',true],['tag','present_focus',1]],fb:{en:'Lucien’s mouth almost becomes a smile. “Very well.”',cn:'Lucien的嘴角几乎要变成一个笑。“很好。”'},goto:'n5'}]}},
 n5:{sp:'lucien',en:'“The Spring Garden Party will go ahead.”',cn:'“春日赏花宴会照常举办。”',next:'n6'},
 n6:{sp:'nait',en:'The white roses outside the window suddenly feel less decorative.',cn:"窗外的白玫瑰过几天就要迎来满园宾客。到时候，他们看的恐怕不只是花。",next:'n7'},
 n7:{sp:'lucien',en:'“Officially, we are celebrating spring. Unofficially, every guest will be checking whether House Rosier still has an heir who can stand, speak, and decide.”',cn:'“名义上，我们只是赏花迎春。实际上，每一位客人都会来确认——House Rosier的继承人是否还站得住、说得出话、做得了决定。”',next:'n8'},
 n8:{sp:'lucien',en:'“You do not need to become the person they remember. You only need to be able to answer for the person standing there now.”',cn:"“不必装成他们记忆里的样子。你现在怎么想，就怎么回答。”",end:true}
}};

SCENES.d4_political_map = {bg:'sitting_room',loc:'sitting_room',start:'n1',nodes:{
 n1:{sp:'lucien',sprite:'lucien',en:'Later, Lucien spreads a smaller stack of correspondence across the sitting-room table. “These are the houses most likely to attend.”',cn:'稍晚些时候，Lucien在起居室桌上摊开一小叠信件。“这些是最可能出席的家族。”',next:'n2'},
 n2:{sp:'elise',sprite:'elise',en:'Elise quietly adds, “Some are worried about you. Some are worried about Rosier. Those are not always the same thing.”',cn:'Elise轻声补充：“有些人担心您。有些人担心Rosier。这两件事并不总是一回事。”',next:'c1'},
 c1:{choice:{promptEn:'What do you focus on?',promptCn:'你最想先弄清什么？',options:[
  {en:'Who genuinely cares whether I recover?',cn:'谁是真的在意我有没有恢复？',fx:[['flag','values_personal_loyalty',true],['rel','elise','warmth',1],['route','family',1]],goto:'a1'},
  {en:'Who benefits if Rosier appears weak?',cn:"Rosier一旦衰弱，谁最得利？",fx:[['tag','tracks_political_motive',1],['rel','lucien','trust',1]],goto:'a2'},
  {en:'Who is undecided? Those are the people worth watching.',cn:'谁还没有站队？那才是最值得观察的人。',fx:[['flag','notices_neutrals',true],['flag','strategic_social_reading',true]],goto:'a3'}]}},
 a1:{sp:'lucien',en:'“Good question,” Lucien says quietly. “Do not confuse usefulness with loyalty.”',cn:'“问得好。”Lucien低声说，“别把有用和忠诚混为一谈。”',end:true},
 a2:{sp:'lucien',en:'Lucien taps two names with one finger. “These two have become remarkably energetic during your illness.”',cn:"Lucien点了点其中两个名字。“你一病倒，这两家就忙起来了。”",end:true},
 a3:{sp:'elise',en:'Elise looks at you with brief surprise. “Then you may want to remember the Earl and Countess of Bellacourt.”',cn:"Elise有些意外地看了你一眼。“那您得记一下Bellacourt伯爵夫妇。”",end:true}
}};

SCENES.d4_roderic_arrival = {bg:'training',loc:'training',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'Late in the afternoon, hoofbeats cross the courtyard just as promised. Wycliffe blue appears beyond the training-yard gate before the rider does.',cn:"午后，庭院里响起马蹄声。训练场门外先露出一角Wycliffe家的蓝色衣装，随后骑手也到了。",next:'n2'},
 n2:{sp:'roderic',sprite:'roderic',en:'Roderic Wycliffe dismounts without waiting for a groom. He looks you over once, openly and from head to toe. “Well. You are standing.”',cn:'Roderic Wycliffe没等马夫就自己翻身下马。他毫不遮掩地从头到脚打量了你一遍。“行。至少你站着。”',fx:[['flag','met_roderic',true]],next:'cb1'},
 cb1:{branch:[{flag:'heard_roderic',goto:'heard'},{traitGte:['knows_own_limits',1],goto:'limits'}],else:'n3'},
 heard:{sp:'roderic',en:'“I assume someone already told you I was coming to see whether the coma made you less unbearable.” He hands the reins to a groom at last. “They were only half joking.”',cn:"他终于把缰绳递给马夫。“听说他们都在猜，我是来看你醒了以后还讨不讨人嫌的。也不全是玩笑。”",next:'n3'},
 limits:{sp:'roderic',en:'His gaze pauses on the careful way you are standing. “You look better than the rumors. That is not permission to fall over for dramatic effect.”',cn:"他看了看你小心站稳的样子。“看着比传闻里强。不过也别逞强，我可不想看你当场栽下去。”",next:'n3'},
 n3:{sp:'roderic',en:'“Do you remember me?” There is no softness in the question, but there is no trap in it either.',cn:'“你记得我吗？”这个问题谈不上温和，却也没有设套。',next:'c1'},
 c1:{choice:{promptEn:'Roderic waits for a straight answer.',promptCn:'Roderic等着一个直接的回答。',options:[
  {en:'“No. But I know we apparently disliked each other.”',cn:"“不记得。不过听说，我们以前互相看不顺眼。”",fx:[['rel','roderic','trust',1],['rel','roderic','rivalry',1],['tag','honest_uncertainty',1]],fb:{en:'His eyebrows rise. “That is an efficient summary.”',cn:'他扬起眉。“总结得很有效率。”'},goto:'r1'},
  {en:'“Not yet. You can introduce yourself without the polite version.”',cn:"“还不记得。你重新介绍一下吧，不用说客套话。”",fx:[['rel','roderic','respect',1],['rel','roderic','warmth',1],['tag','direct_communication',1]],fb:{en:'A grin arrives before he can stop it.',cn:'他没来得及忍住，先笑了一下。'},goto:'r2'},
  {en:'Ask what happened between you before deciding what to think of him now.',cn:'先问你们以前发生过什么，再决定现在该怎么看他。',fx:[['rel','roderic','respect',1],['tag','evidence_first',1],['tag','curiosity_about_past',1]],fb:{en:'He studies you more seriously this time.',cn:'这一次，他看你的眼神认真了些。'},goto:'r3'}]}},
 r1:{sp:'roderic',en:'“Roderic Wycliffe. You hated losing to me on horseback. I hated what you did afterward more.” He says it like a fact, not an accusation rehearsed for effect.',cn:"“Roderic Wycliffe。以前骑马输给我，你很不服气。至于你后来做的那些事，我更不满意。”他语气平直，没刻意加重哪一个字。",next:'n4'},
 r2:{sp:'roderic',en:'“Roderic. Wycliffe heir. Better rider than you, according to me. Insufferable bastard, according to you.”',cn:'“Roderic。Wycliffe家的继承人。按我的说法，骑术比你好；按你以前的说法，是个烦人的混蛋。”',next:'n4'},
 r3:{sp:'roderic',en:'“I mocked your riding. You retaliated against people who worked for me because hitting me directly was politically inconvenient.” His jaw tightens. “That is the short version.”',cn:"“我嘲笑过你的骑术。你不好直接对我下手，就去报复替我做事的人。”他绷紧下颌，“大致就是这样。”",next:'n4'},
 n4:{sp:'roderic',en:'His horse noses impatiently at his shoulder. Roderic catches the bridle without looking. “I am not asking you to apologize for something you cannot remember. I am asking whether the person standing here now intends to behave the same way.”',cn:'他的马不耐烦地用鼻子顶了顶他的肩。Roderic头也没回就抓住了缰绳。“我不是来逼你为一件自己不记得的事道歉。我只是想知道——现在站在这里的人，还打算用同样的方式做事吗？”',next:'c2'},
 c2:{choice:{promptEn:'The question is blunt enough to be almost a challenge.',promptCn:'这个问题直接得几乎像一场挑战。',options:[
  {en:'Tell him he can judge you by what you do from now on.',cn:'告诉他，从现在开始可以按你的行动来判断你。',fx:[['rel','roderic','respect',2],['route','roderic',1],['tag','present_focus',1]],goto:'e1'},
  {en:'Say you will deal with the old grievance once you know exactly what happened.',cn:'告诉他，等弄清旧事之后，你会处理那笔账。',fx:[['rel','roderic','trust',1],['route','roderic',1],['tag','deliberate_accountability',1]],goto:'e2'},
  {en:'Tell him he is welcome to keep being suspicious. You would be too.',cn:'告诉他，他尽管继续怀疑你；换成你也会这么做。',fx:[['rel','roderic','respect',1],['rel','roderic','warmth',1],['route','roderic',1],['tag','honest_uncertainty',1]],goto:'e3'}]}},
 e1:{sp:'roderic',en:'“Good.” He swings the reins over one hand. “That is the only kind of answer I can actually use.”',cn:"他把缰绳拢在手里。“行，那我就看你怎么做。”",next:'e4'},
 e2:{sp:'roderic',en:'“Fine. Find out first.” His tone stays hard, but no longer dismissive. “Then we can argue properly.”',cn:'“行。先查清楚。”他的语气仍然硬，却不再像刚才那样拒人千里，“然后我们再好好吵。”',next:'e4'},
 e3:{sp:'roderic',en:'He barks a laugh. “Annoyingly reasonable. I preferred you easier to hate.”',cn:"他短促地笑了一声。“你现在倒挺讲理。还是以前好，讨厌你都不用犹豫。”",next:'e4'},
 e4:{sp:null,sprite:'none',en:'He stays only twenty minutes. Long enough to confirm that the promised visit was not courtesy, and short enough that neither of you has to pretend the old quarrel is settled.',cn:"他只待了二十分钟。这趟来显然不只为客套，不过临走时，你们也都没有提和解的事。",end:true}
}};

SCENES.d5_invitation = {bg:'bedroom',loc:'bedroom',start:'n1',nodes:{
 n1:{sp:'elise',sprite:'elise',en:'By the next morning, your room has become a battlefield of formal clothes, gloves, ribbons, family pins, and Elise’s increasingly severe opinions.',cn:"第二天早晨，礼服、手套和缎带铺了满屋，几枚家族徽针也摆上了桌。Elise一样样挑过去，脸色越来越严肃。",next:'cb1'},
 cb1:{branch:[{flag:'kept_letter',goto:'cb_letter'},{flag:'rose_garden_memory',goto:'cb_roses'},{traitGte:['prioritized_recovery',1],goto:'cb_rest'}],else:'n2'},
 cb_letter:{sp:'nait',en:'The letter you found in the library is nearby. The old paper and the formal Rosier pins seem to belong to the same life, though neither feels entirely yours yet.',cn:"图书室里找到的信就放在一旁。它和这些Rosier徽针一样，都属于你记不起的那段生活。",next:'n2'},
 cb_roses:{sp:'elise',en:'Elise sets a white-rose clasp beside the older jewelry. “Since you already went to see the roses yourself, I thought this deserved a place among the options.”',cn:'Elise把一枚白玫瑰扣放在旧首饰旁。“既然您已经亲自去看过那些玫瑰了，我想它也该算一个选择。”',next:'n2'},
 cb_rest:{sp:'elise',en:'“At least you have been sensible enough to rest.” Elise says this while removing two heavier ceremonial pieces from the pile. “So I will not dress you like armor.”',cn:"Elise从那堆首饰里拿走两件沉重的礼饰。“这几天您还算肯好好休息，我也不该再拿这些东西压着您。”",next:'n2'},
 n2:{sp:'elise',en:'“The party is not a coronation. You do not need to wear every Rosier heirloom we own.”',cn:'“这不是加冕礼。您不需要把Rosier所有传家饰品都穿在身上。”',next:'n3'},
 n3:{sp:'lucien',sprite:'lucien',en:'Lucien, from the doorway: “Especially because half of them are ugly.”',cn:"门口传来Lucien的声音：“何况一半都不好看。”",next:'n4'},
 n4:{sp:'elise',sprite:'elise',en:'Elise ignores him and sets three options before you: an old Rosier heir pin you apparently wore often, a new understated rose clasp, and the formal family crest worn without any personal ornament.',cn:"Elise没接他的话，把三样饰物摆到你面前：你从前常戴的继承人胸针、一枚新做的素雅白玫瑰扣，还有一枚正式家徽，不必再配其他首饰。",next:'c1'},
 c1:{choice:{promptEn:'What will you wear?',promptCn:'赏花宴上，你想戴什么？',options:[
  {en:'The old heir pin. If it belonged to me, I want to know how it feels.',cn:'旧的继承人胸针。如果它曾经属于我，我想知道戴着是什么感觉。',fx:[['flag','uses_old_symbol',true],['flag','tests_old_identity_symbol',true]],goto:'n5'},
  {en:'The new white-rose clasp. Rosier, but chosen by me.',cn:'新的白玫瑰扣。仍然是Rosier，但由现在的我来选。',fx:[['flag','chooses_new_presentation',true],['flag','self_authored_rosier_symbol',true]],goto:'n5'},
  {en:'Only the formal crest. Let the family name speak for itself.',cn:"只戴正式家徽，表明Rosier继承人的身份就够了。",fx:[['flag','formal_rosier_presentation',true],['tag','public_composure',1]],goto:'n5'}]}},
 n5:{sp:'lucien',sprite:'lucien',en:'Lucien waits until Elise has finished adjusting the fabric. “One more thing. If someone asks about something you do not remember, do not lie for the sake of the old Nait.”',cn:'Lucien等Elise把衣料整理好才开口。“还有一件事。如果有人问起你不记得的事，不要为了过去的Nait撒谎。”',next:'n6'},
 n6:{sp:'lucien',en:'“Memory is not the same thing as judgment. Let them see that.”',cn:'“记忆和判断力不是一回事。让他们看清这一点。”',next:'c2'},
 c2:{choice:{promptEn:'How do you take that advice?',promptCn:'你怎么理解这句话？',options:[
  {en:'Then I will say “I don’t know” when I don’t know.',cn:'那我不知道的时候，就会直接说“不知道”。',fx:[['tag','honest_uncertainty',1],['flag','garden_party_no_bluff',true],['rel','lucien','trust',1]],goto:'c2a'},
  {en:'I can admit what I forgot without giving them control of the conversation.',cn:'我可以承认忘记了，但不会把谈话的主动权一起交出去。',fx:[['tag','public_composure',1],['tag','strategic_honesty',1]],goto:'c2b'},
  {en:'If they are testing me, I would rather understand why.',cn:'如果他们在试探我，我更想先弄清他们为什么这么做。',fx:[['tag','independent_reasoning',1],['tag','tracks_political_motive',1]],goto:'c2c'}]}},
 c2a:{sp:'lucien',sprite:'lucien',en:'Lucien gives a small nod. “Good. Not knowing something is not the same as being incapable of judgment.”',cn:"Lucien轻轻点头。“好。忘了旧事，不妨碍你判断眼前的事。”",next:'n7'},
 c2b:{sp:'lucien',sprite:'lucien',en:'“Exactly.” Lucien’s expression eases by a fraction. “Honesty is not the same thing as surrendering the conversation.”',cn:"Lucien神情稍缓。“对。说一句不记得，不意味着接下来都得由对方说了算。”",next:'n7'},
 c2c:{sp:'lucien',sprite:'lucien',en:'Lucien studies you for a moment. “Then ask yourself who is testing you, and what answer they hope to hear. That will tell you more than the question itself.”',cn:'Lucien看了你片刻。“那就先想清楚是谁在试探你，又希望听见什么答案。那往往比问题本身更有用。”',next:'n7'},
 n7:{sp:'elise',sprite:'elise',en:'Elise steps back to inspect the result. For the first time, she is not trying to make you look like the person she remembers. She is trying to make you look ready.',cn:"Elise退后一步，仔细看了看，又替你抚平肩头的衣料。“好了，这样就能见客了。”",end:true}
}};

SCENES.d5_damien = {bg:'sitting_room',loc:'sitting_room',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'In the afternoon, a royal courier brings a guest list annotated in a neat, unmistakably deliberate hand.',cn:"午后，一名王室信使送来宾客名单，页边密密批着几行整齐的小字。",next:'n2'},
 n2:{sp:'elise',sprite:'elise',en:'Elise pauses, then says: “His Royal Highness, the Crown Prince, has arrived.”',cn:'Elise停下手中的动作：“王储殿下到了。”',next:'n2b'},
 n2b:{sp:null,sprite:'none',en:'A moment later, a young man in royal formal attire enters the sitting room.',cn:'片刻后，一名身着王室礼服的年轻男子走入会客厅。',next:'n2c'},
 n2c:{sp:'elise',sprite:'elise',en:'Elise lowers her voice. “That is Damien Aurelian, Crown Prince of Aurelian.”',cn:'Elise压低声音：“那是 Damien Aurelian，奥瑞利安王国的王储。”',fx:[['flag','met_damien',true],['flag','damien_formal_introduction',true]],next:'n3'},
 n3:{sp:'damien',sprite:'damien',en:'He marks one family as genuine allies, another as opportunists, and Bellacourt as carefully neutral. Then he closes the list.',cn:"他在名单上逐一指出，哪家是可靠的盟友，哪家只想趁机得利，Bellacourt夫妇又为何迟迟不肯站队。说完，才合上名单。",next:'c1'},
 c1:{choice:{promptEn:'What do you ask him?',promptCn:'你想问他什么？',options:[
  {en:'Which of them is most likely to test me?',cn:'哪一家最可能试探我？',fx:[['rel','damien','political_trust',1],['flag','seeks_damien_strategy',true]],goto:'a1'},
  {en:'And where do you place yourself on this list?',cn:'那么，你把自己放在这张名单的哪一类？',fx:[['rel','damien','personal_trust',2],['tag','personal_recognition',1]],goto:'a2'},
  {en:'You came all this way just to explain names?',cn:"你特地来一趟，就是为了替我认人？",fx:[['rel','damien','personal_trust',1],['flag','teases_damien_motive',true]],goto:'a3'}]}},
 a1:{sp:'damien',en:'“The ones who smile before asking about your memory.” His tone stays light. “Do not reward them by pretending.”',cn:"“先对你笑得格外亲切，再来问你记忆的人。”他的语气很轻，“不记得就说不记得，别顺着他们的话往下编。”",next:'r0'},
 a2:{sp:'damien',en:'Damien pauses just long enough to be noticeable. “I was hoping you would decide that yourself.”',cn:'Damien停顿了一瞬，刚好长到足以被察觉。“我本来希望由你自己判断。”',next:'r0'},
 a3:{sp:'damien',en:'“No.” The answer comes too quickly. He glances at the closed list. “It was merely the most defensible reason.”',cn:'“不是。”回答快得有些过头。他看了一眼合上的名单。“只是这是最好解释的理由。”',next:'r0'},
 r0:{sp:'damien',en:'Before he leaves, Damien opens the list again. “One rehearsal. No scripts.”',cn:'临走前，Damien又把名单翻开。“只演练一次。不背稿。”',next:'r1'},
 r1:{sp:'damien',en:'“An ally asks whether your health is truly stable. What do you want them to understand?”',cn:'“一位盟友问，你的身体是否真的稳定。你希望他们明白什么？”',next:'rchoice'},
 rchoice:{choice:{promptEn:'Your instinct?',promptCn:'你的第一反应？',options:[
  {en:'That recovery is real, even if it is not complete.',cn:"我确实在好转，只是还没完全恢复。",fx:[['rel','damien','political_trust',1],['tag','strategic_honesty',1]],goto:'r_a1'},
  {en:'That concern is welcome, but panic is unnecessary.',cn:"多谢关心，不过Rosier还没到需要各位担忧的地步。",fx:[['rel','damien','political_trust',2],['tag','public_composure',1]],goto:'r_a2'},
  {en:'That I would rather know what they are afraid will happen.',cn:'我更想知道，他们究竟害怕发生什么。',fx:[['rel','damien','political_trust',1],['tag','tracks_political_motive',1]],goto:'r_a3'}]}},
 r_a1:{sp:'damien',en:'“Good. Certainty is not the same thing as strength.”',cn:"“很好。还没有完全恢复，也不妨碍你出来见客。”",next:'r2'},
 r_a2:{sp:'damien',en:'A brief smile. “That will sound reassuring to your allies and irritating to everyone else.”',cn:'他短暂地笑了一下。“这会让盟友安心，也会让其他人很不舒服。”',next:'r2'},
 r_a3:{sp:'damien',en:'“Exactly.” Damien taps the table once. “Questions are often more revealing than answers.”',cn:"Damien在桌上轻敲了一下。“正是。听听他们担心什么，就知道他们此行想打听什么了。”",next:'r2'},
 r2:{sp:'damien',en:'He closes the list. “At the reception, I will not answer for you unless you ask me to.”',cn:'他合上名单。“宴会上，除非你开口，否则我不会替你回答。”',next:'r3'},
 r3:{sp:'damien',en:'“If they are going to judge you, they should at least have the courtesy to judge what you actually chose to say.”',cn:"“他们既然想判断你，就该听你自己说。”",end:true}
}};

SCENES.d6_alaric = {bg:'library',loc:'library',start:'n1',nodes:{
 n1:{sp:'alaric',sprite:'alaric',en:'Alaric has covered half a table with notes when you arrive. He moves none of them away. “The rumor has changed.”',cn:'你到图书室时，Alaric已经用笔记占了半张桌子。他没有把它们收起来。“流言变了。”',next:'n2'},
 n2:{sp:'alaric',en:'“At first you were dying. Now some people prefer magical damage. A few have begun using the phrase ‘continuity of mind.’”',cn:"“起初说你快死了，现在改说是魔法损伤。还有几个人，已经开始谈论你的‘意识是否连续’。”",next:'n3'},
 n3:{sp:'nait',en:'A medical rumor can become a succession argument with surprisingly little effort.',cn:"才说了几句，病情就成了继承权的话题。",next:'cb1'},
 cb1:{branch:[{traitGte:['asserts_boundary',1],goto:'cb_boundary'},{flag:'told_alaric_truth',goto:'cb_truth'},{traitGte:['evidence_first',1],goto:'cb_evidence'}],else:'n4'},
 cb_boundary:{sp:'alaric',en:'Alaric closes one notebook first. “I am going to ask about your mind. I am asking, not examining. You may refuse.”',cn:'Alaric先合上了一本笔记。“接下来我要问一个和你的意识有关的问题。只是询问，不是检查。你可以拒绝。”',next:'n4'},
 cb_truth:{sp:'alaric',en:'“You have been unusually consistent about admitting what you do not know,” Alaric says. “That makes the next question more useful.”',cn:"Alaric说：“这几次，不记得的事你都直说了。那我也想听听，你会怎么回答下一个问题。”",next:'n4'},
 cb_evidence:{sp:'alaric',en:'He slides the rumor notes toward you rather than summarizing them. “You preferred evidence before conclusions last time.”',cn:'他没有替你总结，而是直接把关于流言的笔记推过来。“上次你更喜欢先看证据，再听结论。”',next:'n4'},
 n4:{sp:'alaric',en:'Alaric watches you rather than the notes. “If someone demands that you prove you are the same Nait Rosier, what would you do?”',cn:'Alaric没有看笔记，而是看着你。“如果有人要求你证明自己还是同一个Nait Rosier，你会怎么做？”',next:'c1'},
 c1:{choice:{promptEn:'Not who are you — how would you answer?',promptCn:"他等着听你会怎样应对这个问题。",options:[
  {en:'I would not prove it. They can judge what I do now.',cn:'我不会证明。让他们看我现在做什么。',fx:[['rel','alaric','respect',2],['flag','self_defined_method',true]],goto:'a1'},
  {en:'I would ask what evidence could possibly prove a person is “the same.”',cn:'我会先问，到底什么证据能证明一个人“还是同一个人”。',fx:[['rel','alaric','respect',2],['rel','alaric','curiosity',1],['tag','independent_reasoning',1]],goto:'a2'},
  {en:'I would say I do not know.',cn:'我会说，我不知道。',fx:[['rel','alaric','trust',2],['tag','honest_uncertainty',1]],goto:'a3'},
  {en:'I would refuse to discuss my mind with someone asking in bad faith.',cn:"如果对方存心找茬，我不会和他讨论这些。",fx:[['rel','alaric','respect',1],['tag','asserts_boundary',1]],goto:'a4'}]}},
 a1:{sp:'alaric',en:'“Practical.” A pause. “And inconvenient for anyone hoping to win by definition.”',cn:"“务实。”他停了一下，“想在措辞上找你麻烦的人，恐怕会失望。”",end:true},
 a2:{sp:'alaric',en:'For once, Alaric does not answer immediately. “That is a better question than the one I asked.”',cn:'这一次，Alaric没有立刻回答。“这个问题比我刚才问的更好。”',end:true},
 a3:{sp:'alaric',en:'His expression changes almost imperceptibly. “You keep saying that as though uncertainty were not shameful.”',cn:"他神情微动。“你倒是不介意承认自己不知道。”",end:true},
 a4:{sp:'alaric',en:'“Reasonable.” He closes one notebook before continuing. “Then I will not help them disguise intrusion as scholarship.”',cn:"他合上笔记。“可以。若有人借着学术讨论来盘问你，我不会帮忙。”",end:true}
}};

SCENES.d6_roderic = {bg:'training',loc:'training',start:'n1',nodes:{
 n1:{sp:'roderic',sprite:'roderic',en:'Roderic is waiting near the stable yard with a dark horse that turns its head toward you before you are close enough to touch it.',cn:"Roderic在马厩旁等着。你还没走近，那匹深色的马就已经转头望了过来。",fx:[['flag','met_roderic',true]],next:'cb1'},
 cb1:{branch:[{flag:'stubborn_walk',goto:'cb_stubborn'},{traitGte:['knows_own_limits',1],goto:'cb_limits'},{traitGte:['tests_body_memory',1],goto:'cb_body'}],else:'n2'},
 cb_stubborn:{sp:'roderic',en:'Roderic points at you before you can say anything. “I heard about the heroic campaign from your bed to the far side of the room. We are not repeating it with a horse.”',cn:'你还没开口，Roderic就先指了指你。“我听说了你从床边远征到房间另一头的英雄事迹。今天不许拿马再演一遍。”',next:'n2'},
 cb_limits:{sp:'roderic',en:'“Elise says you have occasionally demonstrated common sense about recovery.” Roderic sounds almost suspicious of the report. “Keep doing that.”',cn:"“Elise说你这几天偶尔还知道量力而行。”Roderic听着有些不信，“今天也记着点。”",next:'n2'},
 cb_body:{sp:'roderic',en:'His eyes drop briefly to your hands. “You already tested that old riding grip, didn’t you?”',cn:"他看了看你的手。“你已经试过从前握马具的手势了？”",next:'n2'},
 n2:{sp:'roderic',en:'“That is inconvenient.”',cn:'“这就有点麻烦了。”',next:'n3'},
 n3:{sp:'nait',en:'The horse steps closer. Your hand rises almost automatically, stopping at the exact place beneath its jaw where it leans into the touch.',cn:"马凑了过来。你几乎下意识地伸手，摸到它下颌一处，它便贴着你的手靠过来。",next:'n4'},
 n4:{sp:'roderic',en:'Roderic watches your hand, then your face. “Apparently it remembers you. I am not going to claim that proves anything.”',cn:'Roderic先看了看你的手，又看向你的脸。“看来它认得你。不过我可不会说这能证明什么。”',next:'c1'},
 c1:{choice:{promptEn:'What do you do with the moment?',promptCn:'面对这个瞬间，你怎么做？',options:[
  {en:'Ask him to show you how to lead the horse. Start from the beginning.',cn:'让他教你怎么牵马。从头开始。',fx:[['rel','roderic','respect',2],['tag','practical_action',1],['flag','roderic_shared_action',true]],goto:'a1'},
  {en:'Trust the movement and try it once before asking.',cn:'先相信身体的动作，自己试一次再问。',fx:[['rel','roderic','respect',1],['rel','roderic','warmth',1],['tag','tests_body_memory',1],['flag','roderic_shared_action',true]],goto:'a2'},
  {en:'Tell him your arm is already tired and walk beside the horse instead.',cn:'告诉他手臂已经有点累了，今天只牵着马走。',fx:[['rel','roderic','respect',2],['tag','knows_own_limits',1],['flag','roderic_shared_action',true]],goto:'a3'},
  {en:'Tell him the horse has better memory than you do.',cn:'告诉他，这匹马的记性显然比你好。',fx:[['rel','roderic','warmth',2],['tag','humor_under_pressure',1],['flag','roderic_shared_action',true]],goto:'a4'}]}},
 a1:{sp:'roderic',en:'Roderic hands you the lead without comment. “Good. Knowing where to restart is a skill too.”',cn:"Roderic把缰绳递过来。“行，那就从最简单的开始。”",end:true},
 a2:{sp:'roderic',en:'The horse follows. Roderic grins. “Fine. One try. Then you listen when I tell you to stop.”',cn:'马真的跟了上来。Roderic笑了。“行，就试一次。然后我让你停的时候你得听。”',end:true},
 a3:{sp:'roderic',en:'Roderic’s approval is immediate and almost annoyingly obvious. “Finally. Someone in this family admits when a body has limits.”',cn:"Roderic立刻点头。“总算肯说累了。你们家的人个个都爱硬撑。”",end:true},
 a4:{sp:'roderic',en:'He laughs outright. “That puts it ahead of half the capital too.”',cn:'他直接笑出了声。“那它也已经胜过半个王都的人了。”',end:true}
}};

SCENES.d6_night = {bg:'bedroom',loc:'bedroom',start:'n1',nodes:{
 n1:{sp:'elise',sprite:'elise',en:'That night, Elise sets a glass of water beside the bed. “Tomorrow everyone will look at you.”',cn:'那天晚上，Elise把一杯水放在床边。“明天所有人都会看着您。”',next:'n2'},
 n2:{sp:'elise',en:'“But they have not had the last six days.”',cn:'“但他们没有经历过前面这六天。”',next:'c1'},
 c1:{choice:{promptEn:'What do you tell her?',promptCn:'你想对她说什么？',options:[
  {en:'Then they can start learning tomorrow.',cn:'那就让他们从明天开始认识我。',fx:[['tag','ready_to_be_seen',1],['rel','elise','warmth',1]],goto:'e1'},
  {en:'I am still nervous.',cn:'我还是会紧张。',fx:[['tag','honest_vulnerability',1],['rel','elise','trust',1]],goto:'e2'},
  {en:'Stay close anyway.',cn:'不过明天还是离我近一点。',fx:[['rel','elise','warmth',2],['route','family',1],['flag','asks_family_support',true]],goto:'e3'}]}},
 e1:{sp:'elise',en:'Elise smiles. “I think some of them already have.”',cn:'Elise笑了。“我想，有些人已经开始了。”',end:true},
 e2:{sp:'elise',en:'“Good,” Elise says softly. “It would worry me more if you were not.”',cn:'“那很好。”Elise轻声说，“如果您一点都不紧张，我反而会更担心。”',end:true},
 e3:{sp:'elise',en:'“Of course.” No hesitation this time. “You will not have to look for me.”',cn:"“当然。”她答得毫不迟疑，“一抬头就能看见我。”",end:true}
}};

SCENES.d7_garden = {bg:'garden',loc:'garden',start:'n1',nodes:{
 n1:{sp:'elise',sprite:'elise',en:'Elise makes one final adjustment to your sleeve. “If you are tired, tell me. Nothing happening in that garden is worth putting you back in bed for another two months.”',cn:"Elise又替你理了理袖口。“累了就告诉我。为了见这几个人，再回床上躺两个月可不值。”",next:'prep_cb'},
 prep_cb:{branch:[{traitGte:['prioritized_recovery',1],goto:'prep_rest'},{traitGte:['pushes_limits',1],goto:'prep_push'}],else:'prep_choice'},
 prep_rest:{sp:'elise',en:'Her eyes soften. “At least this week you have usually been willing to stop before I have to order you to.”',cn:"她神情柔和了些。“这周倒还好，大多时候不用我催，您自己就知道歇一歇。”",next:'prep_choice'},
 prep_push:{sp:'elise',en:'She gives you the same look she used after your first overambitious walk across the bedroom. No explanation is required.',cn:"她看了你一眼。你在卧室逞强走得太远的那天，她也是这个眼神。",next:'prep_choice'},
 prep_choice:{choice:{promptEn:'Before you step outside...',promptCn:'在走出去之前……',options:[
  {en:'I will tell you if I need to stop.',cn:'如果需要停下来，我会告诉你。',fx:[['tag','knows_own_limits',1],['flag','d7_promised_limits',true]],goto:'entry1'},
  {en:'I will try.',cn:'我尽量。',fx:[['flag','d7_promised_try',true]],goto:'entry1'},
  {en:'Then you had better keep watching me.',cn:'那你最好一直盯着我。',fx:[['tag','humor_under_pressure',1],['rel','elise','warmth',1],['flag','d7_elise_tease',true]],goto:'entry1'}]}},

 entry1:{sp:null,sprite:'none',en:'Rosecourt has always had white roses. Today they line the paths beside polished silver, pale linen, music, and enough noble titles to fill a court register.',cn:"白玫瑰沿着小径盛开。花丛旁摆起铺着浅色桌布的长桌，银器擦得发亮，乐声已经响起。来客们的头衔，足够填满一本宫廷名册。",next:'entry2'},
 entry2:{sp:null,en:'The flowers receive polite admiration. When you appear at the top of the garden steps, considerably more attention turns toward you.',cn:"宾客们原本正客气地赞着花。你一出现在台阶上，许多人便转过头来。",next:'dress_cb'},
 dress_cb:{branch:[{flag:'uses_old_symbol',goto:'dress_old'},{flag:'chooses_new_presentation',goto:'dress_new'},{flag:'formal_rosier_presentation',goto:'dress_formal'}],else:'family_cb'},
 dress_old:{sp:null,en:'A murmur passes through two older guests when they recognize the old heir pin. “He wore it before,” someone says too quietly to count as conversation.',cn:"两位年长宾客认出了那枚旧胸针，低声交谈起来。“他以前也戴这个。”你隐约听见一句。",next:'family_cb'},
 dress_new:{sp:null,en:'The new white-rose clasp earns a second glance from several guests who know Rosier heraldry well enough to notice that it is not one of the old heir’s usual pieces.',cn:'新的白玫瑰扣让几位熟悉Rosier纹章的人多看了一眼——他们显然知道，这不是过去那位继承人惯用的饰物。',next:'family_cb'},
 dress_formal:{sp:null,en:'The formal Rosier crest needs no explanation. It says only that the heir has appeared in public under the family name.',cn:"正式的Rosier家徽端正地别在胸前，表明了你今日的身份。",next:'family_cb'},
 family_cb:{branch:[{flag:'asks_family_support',goto:'family_warm'},{traitGte:['family_distance',1],goto:'family_space'}],else:'entry3'},
 family_warm:{sp:'lucien',sprite:'lucien',en:'Lucien waits at the foot of the steps, close enough to offer support without turning it into a spectacle. Elise is already where she promised she would be: easy to find.',cn:"Lucien等在台阶下，离得不远，需要时就能扶你一把。Elise也在近旁，抬眼便能看见。",next:'entry3'},
 family_space:{sp:'lucien',sprite:'lucien',en:'Lucien does not reach for you. He simply waits at the foot of the steps, leaving the distance between you for you to decide.',cn:'Lucien没有伸手。他只是等在台阶下，把你们之间最后那点距离留给你自己决定。',next:'entry3'},
 entry3:{sp:null,sprite:'none',en:'Across the garden, Damien is already trapped in a knot of political conversation. Alaric stands near the shade as though sunlight and small talk are equally suspicious. Roderic has found the refreshments.',cn:"花园另一边，Damien正被几位宾客拉着谈政事。Alaric待在树荫下，暂时没人找他寒暄。Roderic已经找到点心，吃上了。",next:'ally1'},

 ally1:{sp:null,en:'Countess Harcourt, an old Rosier ally, is one of the first to approach. Her concern looks genuine. “You are thinner than the last time I saw you.”',cn:'Rosier多年的盟友Harcourt伯爵夫人是最先走近的人之一。她的担心看起来确实真诚。“你比我上次见到时瘦了不少。”',next:'ally2'},
 ally2:{sp:null,en:'She lowers her voice. “Are the physicians truly satisfied? Can you manage an afternoon like this?”',cn:'她压低声音。“医生真的已经放心了吗？像今天这样的下午，你身体撑得住吗？”',next:'ally_choice'},
 ally_choice:{choice:{promptEn:'How do you answer the first public question about your recovery?',promptCn:'第一次有人公开问起你的恢复状况，你怎么回答？',options:[
  {en:'Not completely. But I am much better than I was a week ago.',cn:'还没有完全恢复。不过比一周前已经好很多了。',fx:[['rel','damien','political_trust',1],['rel','alaric','respect',1],['rel','roderic','respect',1],['tag','honest_uncertainty',1],['flag','d7_ally_honest',true]],goto:'ally_honest_cb'},
  {en:'Recovery takes time. Rosier, however, has no need to reconsider its heir.',cn:'恢复需要时间。不过Rosier还没有重新考虑继承人的必要。',fx:[['rel','damien','political_trust',2],['rel','roderic','respect',1],['tag','public_composure',1],['flag','d7_ally_formal',true]],goto:'ally_end'},
  {en:'I walked here myself. My father did not have to bring the bed with me.',cn:'我是自己走过来的。至少父亲今天不用把床一起抬到花园。',fx:[['rel','roderic','warmth',2],['rel','damien','personal_trust',1],['rel','alaric','curiosity',1],['tag','humor_under_pressure',1],['flag','d7_ally_humor',true]],goto:'ally_humor_cb'},
  {en:'Thank you for worrying. But if Rosier were truly that fragile, there would not be a garden party today.',cn:'谢谢您担心。不过如果Rosier真的那么脆弱，今天就不会有这场赏花宴了。',fx:[['rel','damien','political_trust',2],['rel','alaric','respect',1],['rel','roderic','warmth',1],['tag','responsible_choice',1],['flag','d7_ally_reassure',true]],goto:'ally_end'}]}},
 ally_honest_cb:{branch:[{traitGte:['honest_uncertainty',2],goto:'ally_honest_consistent'},{traitGte:['knows_own_limits',2],goto:'ally_limits_consistent'}],else:'ally_end'},
 ally_honest_consistent:{sp:'elise',sprite:'elise',en:'Elise does not look surprised. By now, admitting the limits of what you know—or what your body can do—has become something she has heard from you more than once.',cn:"Elise并不意外。这几天，你已不止一次坦言自己记不得，或是身体还撑不住。",next:'ally_end'},
 ally_limits_consistent:{sp:'roderic',sprite:'roderic',en:'From several steps away, Roderic gives the smallest approving nod. Apparently “not pretending to be invincible” still qualifies as progress.',cn:'几步之外，Roderic极轻地朝你点了一下头。看来“不假装自己无所不能”依然算是一种进步。',next:'ally_end'},
 ally_humor_cb:{branch:[{traitGte:['humor_under_pressure',2],goto:'ally_humor_consistent'}],else:'ally_end'},
 ally_humor_consistent:{sp:'elise',sprite:'elise',en:'Elise closes her eyes for half a second. It is exactly the expression of someone who has heard you joke at the worst possible moment before.',cn:"Elise短暂地闭了闭眼。你在这种时候开玩笑，她已经不是第一次听到了。",next:'ally_end'},
 ally_end:{sp:null,sprite:'none',en:'Countess Harcourt studies you for another moment, then smiles with less worry than before. “That is enough for me. I am glad to see you standing here.”',cn:'Harcourt伯爵夫人又看了你一会儿，随后露出的笑意比刚才少了些担忧。“这就够了。能看到你站在这里，我很高兴。”',next:'signals'},

 signals:{sp:null,en:'The conversation breaks apart. Across the lawn, Damien raises his glass once in acknowledgment. Alaric looks from Harcourt back to you. Roderic catches your eye and silently mouths: “Still alive?”',cn:'谈话散开。草坪另一边，Damien举杯朝你示意了一下。Alaric从Harcourt身上收回视线，再看向你。Roderic则正好和你对上眼，用口型问了一句：“还活着？”',next:'mid_choice'},
 mid_choice:{choice:{promptEn:'You have a few minutes before the next guest reaches you. Whose signal do you answer?',promptCn:'下一位宾客走来之前还有几分钟。你想回应谁？',options:[
  {en:'Go to Damien and ask what Harcourt was really confirming.',cn:'去找Damien，问Harcourt刚才真正想确认什么。',fx:[['rel','damien','personal_trust',1],['flag','d7_midpoint_seek_damien',true]],goto:'mid_damien'},
  {en:'Go to Alaric. He has been watching your wording again.',cn:'去找Alaric。他显然又在观察你的措辞。',fx:[['rel','alaric','curiosity',1],['flag','d7_midpoint_seek_alaric',true]],goto:'mid_alaric'},
  {en:'Go to Roderic and tell him noble society is worse than rehabilitation.',cn:'去找Roderic，告诉他贵族社交比复健还累。',fx:[['rel','roderic','warmth',1],['flag','d7_midpoint_seek_roderic',true]],goto:'mid_roderic'},
  {en:'Find Lucien and Elise for a moment.',cn:'先去找Lucien和Elise。',fx:[['route','family',1],['flag','d7_midpoint_seek_family',true]],goto:'mid_family'}]}},
 mid_damien:{sp:'damien',sprite:'damien',en:'“Three things,” Damien says. “Whether you can stand. Whether you can speak. Whether your father still has to answer for you.”',cn:'“三件事。”Damien说，“你能不能站，你能不能说，以及你的父亲是不是还需要替你回答。”',next:'mid_damien_cb'},
 mid_damien_cb:{branch:[{traitGte:['personal_recognition',1],goto:'mid_damien_personal'}],else:'mid_damien_end'},
 mid_damien_personal:{sp:'damien',en:'When you look at him rather than the crowd, his expression shifts slightly. “And before you ask: no. I have not finished forming my own answer.”',cn:"他看了看你，又望向人群。“先别问我怎么想。我还没想好。”",next:'mid_damien_end'},
 mid_damien_end:{sp:'damien',en:'He glances toward Harcourt. “The third question, at least, she has answered.”',cn:'他朝Harcourt的方向看了一眼。“至少第三个问题，她已经得到答案了。”',next:'enemy1'},
 mid_alaric:{sp:'alaric',sprite:'alaric',en:'“You noticed.” Alaric does not attempt to deny it. “I have been observing you since you woke.”',cn:'“你发现了。”Alaric完全没有否认，“从你醒来以后，我一直在观察你。”',next:'mid_alaric_cb'},
 mid_alaric_cb:{branch:[{traitGte:['asserts_boundary',1],goto:'mid_alaric_boundary'},{traitGte:['evidence_first',1],goto:'mid_alaric_evidence'}],else:'mid_alaric_end'},
 mid_alaric_boundary:{sp:'alaric',en:'He adds, with perfect seriousness: “From outside the boundary.”',cn:"他认真补了一句：“没有越过你说过的界限。”",next:'mid_alaric_end'},
 mid_alaric_evidence:{sp:'alaric',en:'“Current conclusion?” he repeats. “More complicated than yesterday. Which is usually a sign that the evidence has improved.”',cn:"他想了想。“今天比昨天还难下结论。不过，至少知道得更多了。”",next:'enemy1'},
 mid_alaric_end:{sp:'alaric',en:'“Harcourt came worried. She left reassured without you pretending certainty. That is useful data.”',cn:"“Harcourt来时很担心，走的时候已经放心不少。你没有装作全都记得，也照样应付得来。”",next:'enemy1'},
 mid_roderic:{sp:'roderic',sprite:'roderic',en:'“Worse than rehabilitation?” Roderic looks delighted. “Excellent. I have been saying that for years.”',cn:'“比复健还累？”Roderic看起来非常满意，“很好。这话我说了好多年了。”',next:'mid_roderic_cb'},
 mid_roderic_cb:{branch:[{traitGte:['pushes_limits',1],goto:'mid_roderic_push'},{traitGte:['knows_own_limits',2],goto:'mid_roderic_limits'}],else:'mid_roderic_end'},
 mid_roderic_push:{sp:'roderic',en:'“At least today you are admitting you are tired before attempting to conquer the entire garden on principle.”',cn:'“至少今天你是在试图凭意志征服整个花园之前，就肯承认自己累了。”',next:'mid_roderic_end'},
 mid_roderic_limits:{sp:'roderic',en:'“And you are still upright. Sensible choices. Terrible habit. Keep it.”',cn:"“至少还站得稳。看来不逞强确实有用。继续保持，我可不想扶你回去。”",next:'mid_roderic_end'},
 mid_roderic_end:{sp:'roderic',en:'He tilts his glass toward the approaching guests. “Go on. I want to see what question they try next.”',cn:'他朝又走近的人群歪了歪杯子。“去吧。我想看看他们下一题准备问什么。”',next:'enemy1'},
 mid_family:{sp:'elise',sprite:'elise',en:'Elise’s first question is not whether you handled Harcourt well. “Do you need to sit down?”',cn:'Elise第一句没有问你刚才应对得好不好。“需要坐一下吗？”',next:'mid_family2'},
 mid_family2:{sp:'lucien',sprite:'lucien',en:'Lucien looks toward the waiting guests. “Do you want to continue?”',cn:'Lucien看了一眼还在等着交谈的宾客。“还想继续吗？”',next:'mid_family_choice'},
 mid_family_choice:{choice:{promptEn:'What matters right now?',promptCn:'现在你想怎么回答？',options:[
  {en:'Yes. I can keep going.',cn:'嗯。我还能继续。',fx:[['tag','public_composure',1],['flag','d7_family_continue',true]],goto:'mid_family_end'},
  {en:'I do not want to. But I am going to continue anyway.',cn:'我其实不想。但我还是会继续。',fx:[['tag','honest_vulnerability',1],['tag','responsible_choice',1],['rel','lucien','trust',1],['flag','family_growth',true]],goto:'mid_family_end'},
  {en:'Give me five minutes first.',cn:"让我先歇五分钟。",fx:[['tag','knows_own_limits',1],['rel','elise','trust',1],['flag','d7_took_break',true]],goto:'mid_family_end'}]}},
 mid_family_end:{sp:'lucien',en:'Lucien nods once. No lecture, no correction. “Then that is what we do.”',cn:'Lucien只点了一下头。没有说教，也没有纠正。“那就这么办。”',next:'enemy1'},

 enemy1:{sp:null,sprite:'none',en:'The next approach is smoother. Marquis Valcourt smiles before he says your name, which makes Damien’s warning from two days ago suddenly very specific.',cn:"下一位走来的Valcourt侯爵，还没开口便先露出满脸笑意。你想起Damien前两天的提醒。",next:'enemy2'},
 enemy2:{sp:null,en:'“Last winter, during the northern storage-tax dispute, you made a remark everyone at court remembered.” He waits half a beat. “Surely that much has returned to you?”',cn:'“去年冬天北境仓储税争论时，您说过一句让整个宫廷都印象深刻的话。”他停了半拍，“这点总该已经想起来了吧？”',next:'enemy_choice'},
 enemy_choice:{choice:{promptEn:'He is not asking about the tax. He is asking what you remember.',promptCn:'他问的其实不是税。他在问你到底记得多少。',options:[
  {en:'I do not remember. If you want to discuss it, tell me what happened.',cn:'我不记得。如果您想谈这件事，那就告诉我发生了什么。',fx:[['rel','alaric','respect',2],['rel','roderic','respect',1],['rel','damien','personal_trust',1],['tag','honest_uncertainty',1],['flag','d7_enemy_honest',true]],goto:'enemy_honest_cb'},
  {en:'You seem considerably more interested in whether I remember than in what I said.',cn:'比起我当时说了什么，您似乎更在意我到底记不记得。',fx:[['rel','damien','political_trust',2],['rel','alaric','curiosity',1],['rel','roderic','warmth',1],['tag','tracks_political_motive',1],['flag','d7_enemy_motive',true]],goto:'enemy_end'},
  {en:'Since I do not remember, this is convenient. Tell me your version first.',cn:'既然我不记得，那倒正方便。请您先讲讲您的版本。',fx:[['rel','alaric','respect',2],['rel','alaric','curiosity',1],['rel','damien','political_trust',1],['rel','roderic','respect',1],['tag','independent_reasoning',1],['flag','d7_enemy_reverse',true]],goto:'enemy_evidence_cb'},
  {en:'You told me I made a remark. You still have not told me which side I supported.',cn:'您告诉我，我当时说过一句话。可您还没告诉我，我到底支持哪一边。',fx:[['rel','alaric','respect',2],['rel','damien','political_trust',2],['tag','evidence_first',1],['flag','d7_enemy_gap',true]],goto:'enemy_evidence_cb'}]}},
 enemy_honest_cb:{branch:[{traitGte:['honest_uncertainty',3],goto:'enemy_honest_consistent'}],else:'enemy_end'},
 enemy_honest_consistent:{sp:'alaric',sprite:'alaric',en:'Alaric does not move. There is no surprise on his face; by now he has heard you say “I don’t know” often enough to know it is not surrender.',cn:"Alaric站在原地，神情毫不意外。你坦言自己不记得，他已经听过好几次了。",next:'enemy_end'},
 enemy_evidence_cb:{branch:[{traitGte:['independent_reasoning',2],goto:'enemy_evidence_consistent'},{traitGte:['evidence_first',2],goto:'enemy_evidence_consistent'}],else:'enemy_end'},
 enemy_evidence_consistent:{sp:'alaric',sprite:'alaric',en:'One of Alaric’s brows rises by a fraction. It is the same pattern again: evidence before conclusion, even when the evidence is a man trying to trap you.',cn:"Alaric微微挑眉。这次你也没有急着接话，先问清了对方到底在说什么。",next:'enemy_end'},
 enemy_end:{sp:null,sprite:'none',en:'Valcourt’s smile survives. His confidence does not. He withdraws with a polite remark about the roses.',cn:"Valcourt仍挂着笑，却没再往下问。他客气地夸了几句玫瑰，便告辞走开。",next:'enemy_react'},
 enemy_react:{branch:[
  {all:[{relGte:['damien','political_trust',5]},{any:[{flag:'d7_enemy_motive'},{flag:'d7_enemy_gap'}]}],goto:'enemy_damien'},
  {all:[{relGte:['alaric','respect',4]},{any:[{flag:'d7_enemy_reverse'},{flag:'d7_enemy_gap'},{flag:'d7_enemy_honest'}]}],goto:'enemy_alaric'},
  {relGte:['roderic','warmth',3],goto:'enemy_roderic'}
 ],else:'accident1'},
 enemy_damien:{sp:'damien',sprite:'damien',en:'Damien passes close enough to speak without stopping. “He knows less about you now than he did when he walked over.”',cn:'Damien从你身边经过，近到足够低声说一句话，却没有停下。“他现在知道的，比走过来之前还少。”',next:'accident1'},
 enemy_alaric:{sp:'alaric',sprite:'alaric',en:'Alaric studies Valcourt’s retreating back. “You left him an empty space and allowed him to fill it himself.” A pause. “Effective.”',cn:"Alaric望着Valcourt的背影。“你没急着回答，他自己倒说了不少。很有效。”",next:'accident1'},
 enemy_roderic:{sp:'roderic',sprite:'roderic',en:'Roderic leans nearer as Valcourt leaves. “Next time someone asks you a question like that, tell me first.” “Why?” “I want a better view.”',cn:'Valcourt离开时，Roderic稍微靠近了一点。“下次再有人这么问你，提前告诉我。”“为什么？”“我想站近点看。”',next:'accident1'},

 accident1:{sp:null,sprite:'none',en:'The third test does not arrive in the form of a question.',cn:'第三次考验不是以问题的形式出现的。',next:'accident2'},
 accident2:{sp:null,en:'A young Rosecourt maid, Mira, crosses behind a cluster of guests carrying a tray of dark berry wine. Someone steps backward at exactly the wrong moment. Her foot catches. Silver strikes stone.',cn:'Rosecourt的一名年轻女仆Mira端着深色莓酒从一群宾客身后经过。恰在这时，有人向后退了一步。她的脚被什么绊住，银制托盘撞上石地。',next:'accident3'},
 accident3:{sp:null,en:'The wine splashes across Countess Bellacourt’s pale custom gown from waist to hem. The fabric is unmistakably expensive—and, judging by her expression, not replaceable by simply ordering another.',cn:"深色酒液泼上Bellacourt伯爵夫人的浅色礼服，从腰际洇开一大片。她低头看了一眼，脸色顿时变了。那身定制衣料显然价格不菲。",next:'accident4'},
 accident4:{sp:null,en:'Mira hits one wrist against the paving before dropping to her knees. She hides the hand almost immediately and begins apologizing so quickly that the words blur together.',cn:'Mira摔下去时一只手腕先撞上了石地。她几乎立刻把那只手藏到身侧，跪下来连声道歉，快得让人听不清完整句子。',next:'accident5'},
 accident5:{sp:null,en:'Near the edge of the group, a young noble who had stepped back is suddenly very interested in adjusting his cuff. Another guest murmurs, “I thought she was caught on something.” No one sounds certain.',cn:"人群边上，刚刚往后退过的年轻贵族低头摆弄起袖扣。有人小声说：“她是不是被什么绊了一下？”可那人似乎也没看清。",next:'accident6'},
 accident6:{sp:'elise',sprite:'elise',en:'Elise takes half a step toward Mira, then stops herself. Her eyes flick once to the maid’s hidden wrist, then to you.',cn:'Elise下意识朝Mira迈了半步，又硬生生停住。她的视线先落到女仆藏起来的手腕上，又看向你。',next:'accident7'},
 accident7:{sp:null,sprite:'none',en:'Lucien does not move. Bellacourt is angry, Mira may be hurt, and nobody yet knows whether the fall was carelessness, bad luck, or something deliberate. The garden goes quiet anyway.',cn:"Lucien暂时没有上前。Bellacourt夫人余怒未消，Mira藏着手腕，还跪在地上。四周逐渐静了下来，摔倒的原因却没人能说清。",next:'accident8'},
 accident8:{sp:null,sprite:'none',en:'Somewhere behind you, a voice begins, “Rosecourt’s household has become...” and wisely stops. For the first time today, this is not a test you can answer with a polished sentence alone.',cn:"身后有人低声道：“Rosecourt府里如今居然……”话没说完就收了声。这次，光应付几句显然不够。",next:'accident_choice'},
 accident_choice:{choice:{promptEn:'The whole garden is waiting to see what the Rosier heir does with a real problem.',promptCn:'整个花园都在等着看，Rosier继承人会怎么处理一个真正的问题。',options:[
  {en:'Get Mira up first. Rosier will cover the gown; investigate blame afterward.',cn:'先让Mira起来。裙子的损失由Rosier负责，责任之后再查。',fx:[['rel','damien','political_trust',2],['rel','roderic','respect',2],['rel','alaric','respect',1],['tag','kindness_without_performance',1],['tag','responsible_choice',1],['flag','d7_accident_people_first',true],['flag','mira_fall_unresolved',true]],goto:'accident_people_cb'},
  {en:'Rosier will compensate the Countess. But before anyone is punished, find out why Mira fell.',cn:'Rosier会赔偿伯爵夫人的损失。但在处罚任何人之前，先查清Mira为什么会摔倒。',fx:[['rel','alaric','respect',2],['rel','damien','political_trust',1],['rel','roderic','respect',1],['tag','evidence_first',1],['tag','deliberate_accountability',1],['flag','d7_accident_investigate',true],['flag','mira_fall_unresolved',true]],goto:'accident_evidence_cb'},
  {en:'Countess, if today required a legend, I had hoped to use the roses rather than your gown. Rosier will make this right.',cn:"夫人，我原盼着今天能让您记住这里的玫瑰，没想到竟出了这样的岔子。您的损失，Rosier一定负责。",fx:[['rel','roderic','warmth',2],['rel','damien','personal_trust',1],['rel','damien','political_trust',1],['rel','alaric','curiosity',1],['tag','social_ease',1],['tag','responsible_choice',1],['flag','d7_accident_charm',true]],goto:'accident_charm_cb'},
  {en:'The loss is Rosier’s responsibility. It will be handled. Let us not turn one accident into public theater.',cn:'损失由Rosier负责，会处理妥当。没必要把一次意外变成公开审判。',fx:[['rel','damien','political_trust',1],['tag','authority_first',1],['flag','d7_accident_authority',true]],goto:'accident_authority_cb'}]}},
 accident_people_cb:{branch:[{flag:'old_nait_protectiveness_known',goto:'accident_elise_memory'},{flag:'asked_past',goto:'accident_elise_memory'}],else:'accident_resolve'},
 accident_elise_memory:{sp:'elise',sprite:'elise',en:'Elise looks at you for a long second. Days ago she told you about the old Nait sitting beside a feverish kitchen apprentice through the night. She says nothing now.',cn:"Elise看了你片刻，没有说话。几天前，她才说起你曾守着发烧的厨房学徒过夜的事。",next:'accident_resolve'},
 accident_evidence_cb:{branch:[{traitGte:['deliberate_accountability',2],goto:'accident_alaric_memory'},{traitGte:['evidence_first',2],goto:'accident_alaric_memory'}],else:'accident_resolve'},
 accident_alaric_memory:{sp:'alaric',sprite:'alaric',en:'Alaric’s attention sharpens. You made the same kind of choice over his blocked suppliers: do not reverse or punish first merely because action looks decisive.',cn:"Alaric抬眼望过来。谈到材料封锁的旧账时，你也主张先查清楚再处理。",next:'accident_resolve'},
 accident_charm_cb:{branch:[{traitGte:['humor_under_pressure',2],goto:'accident_roderic_memory'}],else:'accident_resolve'},
 accident_roderic_memory:{sp:'roderic',sprite:'roderic',en:'Roderic turns away for a moment, unsuccessfully hiding a grin. Apparently using humor when a room goes silent has become a recognizable habit.',cn:"Roderic别开脸，嘴角的笑意却没藏住。你又在所有人绷着脸的时候说了句玩笑。",next:'accident_resolve'},
 accident_authority_cb:{sp:null,sprite:'none',en:'The order works. The crowd moves again. Mira is led away, though whether she was hurt—and why she fell—remains unanswered for now.',cn:'命令确实有效。人群重新流动起来，Mira也被带走了。只是她有没有受伤、又到底为什么会摔倒，目前都还没有答案。',next:'social_shift'},
 accident_resolve:{sp:null,sprite:'none',en:'Bellacourt’s anger does not disappear, but the scene stops being a spectacle. Compensation can be arranged. The exact cause of Mira’s fall can wait until witnesses are questioned.',cn:'Bellacourt的恼火当然没有凭空消失，但事情至少不再是一场供人围观的闹剧。赔偿可以安排，Mira摔倒的真正原因则可以等问过目击者以后再查。',next:'social_shift'},

 social_shift:{sp:null,en:'The party continues. Ten minutes later, a baron who earlier asked only whether you were strong enough to stand approaches again.',cn:'赏花宴继续。十分钟后，一位之前只问过“您身体撑不撑得住”的男爵再次走近。',next:'social_shift2'},
 social_shift2:{sp:null,en:'This time he asks, “Lord Rosier, northern grain prices have moved strangely this month. I would be interested in your view.”',cn:'这一次，他问的是：“Rosier阁下，这个月北部粮价的波动有些异常。不知道您怎么看？”',next:'social_shift3'},
 social_shift3:{sp:null,en:'It is the first question of the afternoon addressed to your judgment rather than your illness.',cn:'这是整个下午第一次，有人询问的是你的判断，而不是你的病情。',fx:[['rep',2],['flag','garden_party_public_turn',true]],next:'family_reward'},
 family_reward:{sp:'lucien',sprite:'lucien',en:'Across the garden, Lucien meets your eye. He does not applaud, step in, or announce victory. He simply lifts his glass once.',cn:"花园另一头，Lucien与你目光相遇。他没有上前，只遥遥举了举杯。",next:'family_reward2'},
 family_reward2:{sp:'elise',sprite:'elise',en:'Later, when you pass close enough, Elise murmurs, “Your father has finally started drinking the wine he has been carrying around for an hour.”',cn:'后来你从Elise身边经过时，她低声说：“老爷终于开始喝那杯已经端了一个小时的酒了。”',next:'end_scene'},
 end_scene:{sp:null,sprite:'none',en:'By sunset, the official purpose of the Spring Garden Party has been fulfilled. The roses were admired. The unofficial purpose has been answered as well.',cn:"日落时，宾客们陆续告辞。这场赏花宴上，该看的花都看过了，想打量继承人的客人也各自有了判断。",end:true}
}};

SCENES.d7_closing = {bg:'garden',loc:'garden',start:'n1',nodes:{
 n1:{sp:'lucien',sprite:'lucien',en:'As the last formal conversations thin out, Lucien comes to stand beside you. “You handled today well.”',cn:'最后几轮正式寒暄渐渐散去时，Lucien走到你身边。“今天处理得很好。”',next:'n2'},
 n2:{sp:null,sprite:'none',en:'The question hangs there without being asked: well as what?',cn:"他停了一下，又补了一句。",next:'n3'},
 n3:{sp:'lucien',sprite:'lucien',en:'Lucien seems to read it anyway. “Not like the old Nait. Not like the heir they expected.” A pause. “Like yourself.”',cn:"“不必拿从前的你来比，也不必照着他们的期待来。我说的是，你今天做得很好。”",next:'n4'},
 n4:{sp:'elise',sprite:'elise',en:'Elise appears at exactly the right moment. “And now, like someone who should sit down.”',cn:"Elise恰在这时走来。“好了，夸也夸过了，该坐下歇歇了。”",next:'last_choice'},
 last_choice:{choice:{promptEn:'The party is almost over. Where do you spend the last ten minutes of your first public day?',promptCn:'赏花宴快结束了。第一次公开露面的最后十分钟，你想留给哪里？',options:[
  {en:'Find Damien on the terrace before he leaves.',cn:'去露台找还没离开的Damien。',fx:[['rel','damien','personal_trust',1],['tag','personal_recognition',1],['flag','d7_final_seek_damien',true]],goto:'final_damien'},
  {en:'Find Alaric. His gloves are on, but he is still here.',cn:'去找Alaric。他已经戴上手套，却还没有离开。',fx:[['rel','alaric','warmth',1],['rel','alaric','curiosity',1],['flag','d7_final_seek_alaric',true]],goto:'final_alaric'},
  {en:'Go toward the stable yard. Roderic claims he is waiting for his horse.',cn:'去马厩方向。Roderic声称自己是在等马。',fx:[['rel','roderic','warmth',1],['flag','d7_final_seek_roderic',true]],goto:'final_roderic'},
  {en:'Stay with Lucien and Elise while Rosecourt settles down.',cn:'留下来陪Lucien和Elise，看着Rosecourt慢慢安静下来。',fx:[['route','family',1],['rel','lucien','warmth',1],['rel','elise','warmth',1],['flag','d7_final_seek_family',true]],goto:'final_family'},
  {en:'Go back to your room. Today has been enough.',cn:'回房。今天已经够长了。',fx:[['tag','knows_own_limits',1],['flag','d7_final_rest',true]],goto:'final_rest'}]}},
 final_damien:{sp:'damien',sprite:'damien',en:'Damien is alone for perhaps the first time all afternoon. “After tonight, a great many people will revise their assessment of you.”',cn:'Damien大概是整个下午第一次真正独自站着。“今晚之后，会有很多人重新评估你。”',next:'final_damien2'},
 final_damien2:{sp:'damien',en:'He looks at you instead of the departing carriages. “I expect I will as well.”',cn:'他没有看正在离开的马车，而是看着你。“我想，我也会。”',next:'check_damien'},
 final_alaric:{sp:'alaric',sprite:'alaric',en:'Alaric has already put on his gloves. He makes no move toward the gate when you approach. “I originally assumed memory loss would make you easier to understand.”',cn:"Alaric已经戴好手套，见你走近，却没有急着告辞。“本以为你失忆以后，会好懂一些。”",next:'final_alaric2'},
 final_alaric2:{sp:'alaric',en:'“And now?” A small pause. “The opposite.”',cn:"他顿了顿。“看来我想错了。”",next:'check_damien'},
 final_roderic:{sp:'roderic',sprite:'roderic',en:'Roderic’s horse is already being held three paces away, making his claim that he is “waiting for it” unconvincing.',cn:'Roderic的马已经被牵到三步之外，所以他所谓“在等马”的说法显得相当没有说服力。',next:'final_roderic2'},
 final_roderic2:{sp:'roderic',en:'“You were fairly impressive today.” When you look at him, he adds, “Do not make that face. I am deliberately keeping the compliment modest.”',cn:"“你今天还挺像样。”见你看他，他又补充，“别这么看我。偶尔夸一句，你听着就是了。”",next:'check_damien'},
 final_family:{sp:'elise',sprite:'elise',en:'The servants begin clearing the last glasses. Elise hands you your outer coat without asking whether you remember where it came from.',cn:"仆人们收起最后几只酒杯。Elise拿来你的外套，递到你手里。",next:'final_family2'},
 final_family2:{sp:'lucien',sprite:'lucien',en:'Lucien watches the last carriage pass beyond the gates. “Come on. Let us go back to the main house.”',cn:'Lucien看着最后一辆马车驶过大门。“走吧。我们回主楼。”',next:'check_damien'},
 final_rest:{sp:'elise',sprite:'elise',en:'Elise does not argue when you say you are done. “Good. I was beginning to wonder whether I would have to invent an emergency.”',cn:"听你说想回房，Elise立刻点头。“再不走，我都要找个借口把您带回去了。”",next:'final_rest2'},
 final_rest2:{sp:null,sprite:'none',en:'The music continues behind you as the doors close. Choosing to stop is also a choice the week has taught Rosecourt to recognize.',cn:"门在身后合上，花园里还传来乐声。今天就到这里，你可以休息了。",next:'check_damien'},

 check_damien:{branch:[{all:[{relGte:['damien','political_trust',4]},{relGte:['damien','personal_trust',2]},{any:[{traitGte:['responsible_choice',1]},{traitGte:['personal_recognition',1]}]}],goto:'stir_damien'}],else:'check_alaric'},
 stir_damien:{sp:null,sprite:'damien',en:'Damien’s attention has changed over the course of the week. What began as assessment now contains a personal curiosity he has not named aloud.',cn:"这一周，Damien问起你的事时，已不全是在打听Rosier的近况。有些问题，他只在没有旁人的时候才问。",fx:[['flag','damien_first_stirring',true]],next:'check_alaric'},
 check_alaric:{branch:[{all:[{relGte:['alaric','respect',4]},{relGte:['alaric','curiosity',3]},{any:[{traitGte:['independent_reasoning',2]},{traitGte:['honest_uncertainty',2]},{traitGte:['asserts_boundary',1]}]}],goto:'stir_alaric'}],else:'check_roderic'},
 stir_alaric:{sp:null,sprite:'alaric',en:'Alaric still has questions. The difference is that an increasing number of them are about you rather than the anomaly surrounding you.',cn:"Alaric仍有许多问题。不过，他问起你怎么想的时候，渐渐多过了询问异象。",fx:[['flag','alaric_first_stirring',true]],next:'check_roderic'},
 check_roderic:{branch:[{all:[{relGte:['roderic','respect',4]},{relGte:['roderic','warmth',2]},{flag:'roderic_shared_action'}],goto:'stir_roderic'}],else:'check_family'},
 stir_roderic:{sp:null,sprite:'roderic',en:'Roderic has already begun speaking about “next time” as though another ride, another argument, another afternoon together requires no special arrangement.',cn:"Roderic已经几次提到“下次”。再骑一回马，或再争上几句，他说起来都很自然。",fx:[['flag','roderic_first_stirring',true]],next:'check_family'},
 check_family:{branch:[{any:[{flag:'d7_final_seek_family'},{flag:'asks_family_support'},{flag:'family_growth'},{routeGte:['family',2]}],goto:'family_belong'}],else:'closing_end'},
 family_belong:{sp:null,sprite:'none',en:'Somewhere during the first week, “the Rosier household” has begun to overlap with something more personal: people whose habits, worries, and presence are becoming familiar.',cn:"才过了一周，你已渐渐熟悉Lucien和Elise的习惯：谁会在门口等着，谁总要多叮嘱一句。Rosecourt里的人，已不再全然陌生。",fx:[['flag','family_first_belonging',true]],next:'closing_end'},
 closing_end:{sp:null,sprite:'none',en:'The first week at Rosecourt has reached its end.',cn:'Rosecourt的第一周，走到了尾声。',fx:[['flag','week1_callback_complete',true]],end:true},

 summary1:{sp:null,sprite:'none',en:'THE FIRST WEEK AT ROSECOURT',cn:'ROSECOURT的第一周',next:'summary_cb1'},
 summary_cb1:{branch:[{traitGte:['honest_uncertainty',2],goto:'sum_honest'},{traitGte:['humor_under_pressure',2],goto:'sum_humor'},{traitGte:['independent_reasoning',2],goto:'sum_thought'},{traitGte:['public_composure',2],goto:'sum_composed'}],else:'sum_open'},
 sum_honest:{sp:null,en:'What people saw: someone willing to say “I do not know” without surrendering judgment.',cn:"别人记住了你的坦诚：不记得的事，你会直说；眼前的事，你仍会自己判断。",next:'summary_cb2'},
 sum_humor:{sp:null,en:'What people saw: someone who can let a room breathe when pressure becomes too heavy.',cn:"别人也记住了你的玩笑。几次气氛僵住，都是你先让大家笑了出来。",next:'summary_cb2'},
 sum_thought:{sp:null,en:'What people saw: someone who asks what a question is really trying to prove before accepting its premise.',cn:"面对试探，你没有急着作答，而是先问清对方究竟想知道什么。",next:'summary_cb2'},
 sum_composed:{sp:null,en:'What people saw: someone capable of standing in public without allowing the public to define the entire conversation.',cn:"众人都在打量你，你依然稳住了场面，没有任由他们牵着话题走。",next:'summary_cb2'},
 sum_open:{sp:null,en:'What people saw: not a finished answer, but a person making decisions in real time.',cn:"你还没弄清许多事，却已在这一周里陆续作出了自己的决定。",next:'summary_cb2'},
 summary_cb2:{branch:[{flag:'damien_first_stirring',goto:'sum_damien'},{route:['damien',2],goto:'sum_damien'},{flag:'alaric_first_stirring',goto:'sum_alaric'},{route:['alaric',2],goto:'sum_alaric'},{flag:'roderic_first_stirring',goto:'sum_roderic'},{route:['roderic',2],goto:'sum_roderic'}],else:'sum_family_check'},
 sum_damien:{sp:null,sprite:'damien',en:'Damien no longer seems interested only in whether Rosier is politically stable.',cn:'Damien似乎已经不再只关心Rosier在政治上是否稳定。',next:'sum_more1'},
 sum_more1:{branch:[{flag:'alaric_first_stirring',goto:'sum_alaric_after'},{flag:'roderic_first_stirring',goto:'sum_roderic_after'}],else:'sum_family_check'},
 sum_alaric_after:{sp:null,sprite:'alaric',en:'Alaric’s questions are becoming increasingly personal, even when he continues to phrase them like research.',cn:"Alaric问起的私事渐渐多了，尽管问起来，仍像在讨论研究。",next:'sum_more2'},
 sum_more2:{branch:[{flag:'roderic_first_stirring',goto:'sum_roderic_after'}],else:'sum_family_check'},
 sum_alaric:{sp:null,sprite:'alaric',en:'Alaric’s questions are becoming increasingly personal, even when he continues to phrase them like research.',cn:"Alaric问起的私事渐渐多了，尽管问起来，仍像在讨论研究。",next:'sum_alaric_next'},
 sum_alaric_next:{branch:[{flag:'roderic_first_stirring',goto:'sum_roderic_after'}],else:'sum_family_check'},
 sum_roderic_after:{sp:null,sprite:'roderic',en:'Roderic has already started assuming there will be a next time.',cn:'Roderic已经开始理所当然地假设：你们还会有下一次。',next:'sum_family_check'},
 sum_roderic:{sp:null,sprite:'roderic',en:'Roderic has already started assuming there will be a next time.',cn:'Roderic已经开始理所当然地假设：你们还会有下一次。',next:'sum_family_check'},
 sum_family_check:{branch:[{flag:'family_first_belonging',goto:'sum_family'}],else:'sum_end'},
 sum_family:{sp:null,sprite:'none',en:'And Rosecourt has begun, quietly, to resemble more than the place where you happened to wake.',cn:"Rosecourt也渐渐熟悉起来。除了那间醒来时的卧室，这里又多了几处你愿意去的地方。",next:'sum_end'},
 sum_end:{sp:null,sprite:'none',en:'You still do not have to decide who you were. Week one ends with a smaller, more immediate fact: people have begun responding to who you are now.',cn:"过去仍有许多空白。不过，这一周你说过的话、做过的事，身边的人都已看在眼里。",fx:[['flag','week1_callback_complete',true]],end:true}
}};

/* ============================================================
   MASTER FLOW — Week 1 + playable Week 2–3
   ============================================================ */
const FLOW = [
  { type:'scene', day:1, period:'morning', loc:'bedroom', scene:'d1_wake' },
  { type:'scene', day:1, period:'evening', loc:'bedroom', scene:'d1_evening' },
  { type:'dayEnd' },
  { type:'scene', day:2, period:'morning', loc:'bedroom', scene:'d2_medical' },
  { type:'scene', day:2, period:'afternoon', loc:'sitting_room', scene:'d2_lucien' },
  { type:'scene', day:2, period:'late_afternoon', loc:'corridor', scene:'d2_corridor' },
  { type:'scene', day:2, period:'late_afternoon', loc:'library', scene:'d2_library' },
  { type:'schedule', day:2, period:'evening', titleCn:'黄昏时分，你想去哪里？', options:[
    { scene:'d2_conservatory', loc:'rose_conservatory', hintEn:'Warm glass, damp earth, and traces of a life before yours.', hintCn:'温暖的玻璃、湿润的泥土，还有母亲留下的一点生活痕迹。' },
    { scene:'d2_garden', loc:'garden', hintEn:'The roses are finally blooming.', hintCn:'Elise说，白玫瑰终于开了。' },
    { scene:'d2_rest', loc:'bedroom', hintEn:'Your body is still mending.', hintCn:'身体仍在痊愈，早些休息。' },
  ]},
  { type:'dayEnd' },
  { type:'scene', day:3, period:'morning', loc:'library', scene:'d3_alaric' },
  { type:'schedule', day:3, period:'afternoon', titleCn:'午后的庄园，你想去哪里？', options:[
    { scene:'d3_garden', loc:'garden', hintEn:'Elise is pruning roses — and stories.', hintCn:"找Elise聊聊旧事，她正在花园里修剪玫瑰。" },
    { scene:'d3_training', loc:'training', hintEn:'Word arrived about a visitor tomorrow.', hintCn:'有消息传来：明天有位访客。' },
    { scene:'d3_rest', loc:'bedroom', hintEn:'Let the rain read to you.', hintCn:"在房里歇歇，听一下午雨声。" },
  ]},
  { type:'scene', day:3, period:'night', loc:'bedroom', scene:'d3_night_dream' },
  { type:'dayEnd' },
  { type:'scene', day:4, period:'morning', loc:'bedroom', scene:'d4_breakfast' },
  { type:'scene', day:4, period:'afternoon', loc:'sitting_room', scene:'d4_political_map' },
  { type:'scene', day:4, period:'afternoon', loc:'training', scene:'d4_roderic_arrival' },
  { type:'schedule', day:4, period:'evening', titleCn:'知道了赏花宴真正的意义以后，你想怎么度过今晚？', options:[
    { scene:'d4_library', loc:'library', hintEn:'Someone left something by the chalk circle.', hintCn:'去图书室。白垩圆圈旁似乎有人留下了东西。' },
    { scene:'d4_garden', loc:'garden', hintEn:'The same white roses will host the party.', hintCn:"去花园看看。赏花宴就快到了。" },
    { scene:'d4_rest', loc:'bedroom', hintEn:'Tomorrow begins the preparation in earnest.', hintCn:'休息。接下来两天需要体力。', fx:[['tag','prioritized_recovery',1],['health',4]] },
  ]},
  { type:'dayEnd' },
  { type:'scene', day:5, period:'morning', loc:'bedroom', scene:'d5_invitation' },
  { type:'scene', day:5, period:'afternoon', loc:'sitting_room', scene:'d5_damien' },
  { type:'dayEnd' },
  { type:'scene', day:6, period:'afternoon', loc:'library', scene:'d6_alaric' },
  { type:'scene', day:6, period:'evening', loc:'training', scene:'d6_roderic' },
  { type:'scene', day:6, period:'night', loc:'bedroom', scene:'d6_night' },
  { type:'dayEnd' },
  { type:'scene', day:7, period:'morning', loc:'garden', scene:'d7_garden' },
  { type:'scene', day:7, period:'afternoon', loc:'garden', scene:'d7_closing' },
  { type:'weekSummary', day:7, period:'evening', loc:'garden' },
  { type:'dayEnd' },

  { type:'scene', day:8, period:'morning', loc:'duke_study', scene:'d8_breakfast' },
  { type:'schedule', day:8, period:'afternoon', titleCn:'第二周的第一个自由下午。', options:[
    {scene:'d8_library',loc:'library',hintEn:'Measurements and questions.',hintCn:'去图书室找Alaric，看他最近在测什么。',fx:[['route','alaric',1]]},
    {scene:'d8_family',loc:'garden',hintEn:'Walk the rose paths with Elise.',hintCn:'和Elise在玫瑰园走走。',fx:[['route','family',1]]},
    {scene:'d8_group',loc:'garden',hintEn:'Invite everyone to dinner.',hintCn:'试着把大家都叫来吃晚饭。',fx:[['route','ensemble',1]]},
  ]},
  { type:'dayEnd' },
  { type:'scene', day:9, period:'morning', loc:'sitting_room', scene:'d9_old_name' },
  { type:'schedule', day:9, period:'afternoon', titleCn:'事情过去以后，你想找谁？', options:[
    {scene:'d9_roderic',loc:'training',hintEn:'A rival gives less flattering history.',hintCn:'Roderic大概不会替过去的你说好话。',fx:[['route','roderic',1]]},
    {scene:'d9_alaric_followup',loc:'library',hintEn:'Evidence before conclusions.',hintCn:'去找Alaric，把情绪换成证据。',fx:[['route','alaric',1]]},
    {scene:'d9_elise_followup',loc:'garden',hintEn:'Home first.',hintCn:'和Elise走走，让今天安静下来。',fx:[['route','family',1]]},
  ]},
  { type:'dayEnd' },
  { type:'scene', day:10, period:'morning', loc:'market', scene:'d10_city_first' },
  { type:'schedule', day:10, period:'afternoon', titleCn:'王城第一次真正向你开放。', options:[
    {scene:'d10_market',loc:'market',hintEn:'Breakfast, gossip, ordinary city life.',hintCn:'从市集开始认识这座城。',fx:[['route','family',1],['route','ensemble',1]]},
    {scene:'d10_academy',loc:'academy',hintEn:'Follow the blue uniforms.',hintCn:'去王立魔法学院看看。',fx:[['route','alaric',1]]},
    {scene:'d10_palace',loc:'palace',hintEn:'A road you already partly know.',hintCn:'再去一趟王宫，这次不是正式接见。',fx:[['route','damien',1]]},
  ]},
  { type:'dayEnd' },
  { type:'scene', day:11, period:'morning', loc:'library', scene:'d11_letter' },
  { type:'dayEnd' },
  { type:'scene', day:12, period:'morning', loc:'market', scene:'d12_city_day' },
  { type:'schedule', day:12, period:'afternoon', titleCn:'今天想和谁一起认识王城？', options:[
    {scene:'d12_roderic_city',loc:'market',hintEn:'Roderic knows the city from ground level.',hintCn:'和Roderic去逛市集。',fx:[['route','roderic',1]]},
    {scene:'d12_damien_private',loc:'conservatory',hintEn:'A private invitation inside the palace.',hintCn:'接受Damien的私人温室邀请。',fx:[['route','damien',1]]},
    {scene:'d12_alaric_city',loc:'academy',hintEn:'Return to the academy.',hintCn:'再去学院找Alaric。',fx:[['route','alaric',1]]},
    {scene:'d12_group_city',loc:'market',hintEn:'Invite everybody. Surely this is sensible.',hintCn:'把大家都叫出来。应该不会出事。',fx:[['route','ensemble',1]]},
  ]},
  { type:'dayEnd' },
  { type:'scene', day:13, period:'evening', loc:'library', scene:'d13_anomaly' },
  { type:'dayEnd' },
  { type:'scene', day:14, period:'afternoon', loc:'garden', scene:'d14_week2_close' },
  { type:'dayEnd' },

  { type:'scene', day:15, period:'morning', loc:'old_road', scene:'d15_outskirts_first' },
  { type:'schedule', day:15, period:'afternoon', titleCn:'郊外第一次开放，你想往哪边走？', options:[
    {scene:'d15_ride',loc:'old_road',hintEn:'Ride farther with Roderic.',hintCn:'和Roderic继续沿旧道骑行。',fx:[['route','roderic',1]]},
    {scene:'d15_family_out',loc:'estate_village',hintEn:'Visit the Rosier estate village with Elise.',hintCn:'和Elise去Rosier领村。',fx:[['route','family',1]]},
    {scene:'d15_group_out',loc:'riverside',hintEn:'A group picnic by the river.',hintCn:'把大家都拐去河边野餐。',fx:[['route','ensemble',1]]},
  ]},
  { type:'dayEnd' },
  { type:'scene', day:16, period:'morning', loc:'duke_study', scene:'d16_stewardship' },
  { type:'dayEnd' },
  { type:'schedule', day:17, period:'afternoon', titleCn:'三个区域都在等你。今天把时间花在哪里？', options:[
    {scene:'d17_academy_field',loc:'old_road',hintEn:'Alaric found a second anomaly.',hintCn:'Alaric在郊外发现了第二处异象。',fx:[['route','alaric',1]]},
    {scene:'d17_palace_policy',loc:'palace',hintEn:'Damien wants to discuss your first estate decision.',hintCn:'Damien想谈谈你第一次领地决策。',fx:[['route','damien',1]]},
    {scene:'d17_family_followup',loc:'estate_village',hintEn:'Ask the village what the report missed.',hintCn:'回领村看看报告没写到什么。',fx:[['route','family',1]]},
    {scene:'d17_group_problem',loc:'riverside',hintEn:'Everyone is free at the same time. Suspicious.',hintCn:'大家居然同时有空。很可疑。',fx:[['route','ensemble',1]]},
  ]},
  { type:'dayEnd' },
  { type:'scene', day:18, period:'morning', loc:'sitting_room', scene:'d18_free_map' },
  { type:'schedule', day:18, period:'afternoon', titleCn:'庄园、王城、郊外——选你今天想去的地方。', options:[
    {scene:'d18_family',loc:'duke_study',hintEn:'A recurring report waits on your desk.',hintCn:'留在庄园，陪父亲处理固定领务。',fx:[['route','family',1]]},
    {scene:'d18_alaric',loc:'academy',hintEn:'An impossible paper at the academy.',hintCn:'去学院找Alaric。',fx:[['route','alaric',1]]},
    {scene:'d18_roderic',loc:'old_road',hintEn:'The old road again.',hintCn:'去郊外和Roderic骑马。',fx:[['route','roderic',1]]},
    {scene:'d18_damien',loc:'conservatory',hintEn:'A deliberately unofficial invitation.',hintCn:'接受Damien“不正式”的邀请。',fx:[['route','damien',1]]},
    {scene:'d18_group',loc:'market',hintEn:'Make the schedules bend.',hintCn:'召集大家，一起进城。',fx:[['route','ensemble',1]]},
  ]},
  { type:'dayEnd' },
  { type:'scene', day:19, period:'morning', loc:'bedroom', scene:'d19_identity_echo' },
  { type:'dayEnd' },
  { type:'scene', day:20, period:'afternoon', loc:'riverside', scene:'d20_field_anomaly' },
  { type:'dayEnd' },
  { type:'ending', day:21, period:'afternoon', loc:'garden', scene:'d21_three_weeks' },
];

/* ============================================================
   LORE DATABASE (world codex)
   - unlock: {day:n} | {flag:'x'} | {flags:[...]} (flags = any-of)
   - tags: matched against the player's chat text (lowercased) for
     on-demand AI injection (Contract §16 — never inject unrelated
     lore into prompts)
   - chars: characters this entry is always relevant to in chat
   - ai:false  → never injected into prompts (spoiler boundary)
   ============================================================ */
const LORE = {
  collapse: {
    titleEn:'The Two-Month Sleep', titleCn:'两个月的昏睡',
    tags:['coma','collapse','sleep','昏睡','昏迷','两个月','晕倒','倒下'],
    chars:['elise','lucien','alaric'], knownBy:['elise','lucien','alaric'],
    unlock:{day:1}, ai:true,
    textEn:'Two months ago, Nait Rosier collapsed in the library and did not wake. The physicians found no wound, no poison, no curse-mark. The court was told only that the heir was "recovering".',
    textCn:'两个月前，Nait Rosier 在图书室昏倒，就此不醒。医师查不出伤口、毒物或咒痕。宫廷只被告知：继承人"正在休养"。',
  },
  rosecourt: {
    titleEn:'Rosecourt Manor', titleCn:'Rosecourt 庄园',
    tags:['rosecourt','manor','庄园','玫瑰','roses','白玫瑰'],
    chars:['elise','lucien'], knownBy:['elise','lucien'],
    unlock:{day:1}, ai:true,
    textEn:'Seat of House Rosier, famous for its white roses — hedges, arches, and one stubborn vine climbing the manor wall. The late Duchess planted the white ones; after she passed, the old Nait threatened to dismiss any gardener who let one wilt.',
    textCn:'Rosier 家的府邸，以白玫瑰闻名——树篱、拱架，还有一株固执攀上外墙的藤蔓。白玫瑰是已故夫人种下的；她走后，从前的 Nait 曾扬言要解雇任何让一朵花枯萎的园丁。',
  },
  rosier_house: {
    titleEn:'House Rosier', titleCn:'Rosier 家',
    tags:['rosier','家族','继承','heir','公爵','duke'],
    chars:['elise','lucien'], knownBy:['elise','lucien','alaric','roderic','damien'],
    unlock:{day:1}, ai:true,
    textEn:'An old ducal house. Duke Lucien leads it; Nait is the sole heir. The old Nait was a storm the Duke allowed to form — proud, sharp-tongued, fiercely loyal to those inside the hedge.',
    textCn:'古老的公爵世家。Lucien 公爵当家，Nait 是唯一的继承人。从前的 Nait 是一场被纵容成形的风暴——骄傲、牙尖嘴利，对篱笆以内的人护短到底。',
  },
  four_houses: {
    titleEn:'The Four Great Houses', titleCn:'四大家族纹章',
    tags:['house','crest','sigil','纹章','家族','royal','rosier','aurelian','wycliffe','varenne'],
    chars:['damien','roderic','alaric','lucien'], knownBy:[],
    unlock:{day:1}, ai:true, image:'assets/ui/four_house_crests.webp',
    textEn:'A quick heraldic guide: Rosier bears the white rose within thorns; Aurelian, the royal house, bears a raven with outstretched wings and a flowing sash; Wycliffe bears a side-facing horse head; Varenne bears a stag. These emblems appear on seals, stationery, gates, and formal interiors across the world.',
    textCn:'四大家族的纹章简表：Rosier 家为荆棘环绕的白玫瑰；王室 Aurelian 家为展翼回首的渡鸦与柔软绶带；Wycliffe 家为侧面的马首；Varenne 家为鹿。它们会出现在蜡封、信纸、城门与正式场所的装饰之中。',
  },
  secondary_gender: {
    titleEn:'Secondary Gender', titleCn:'第二性别',
    tags:['omega','alpha','beta','信息素','pheromone','抑制剂','suppressant','heat','rut','第二性别'],
    chars:['elise'], knownBy:['elise','lucien','alaric','roderic','damien'],
    unlock:{day:1}, ai:true,
    textEn:'Beyond male and female, everyone carries a secondary gender: Alpha, Beta, or Omega. Pheromones color attention and instinct — never thought, never obedience. Suppressants are ordinary medicine; Nait\'s formula is unchanged since before the coma.',
    textCn:'在男女之外，人人还有第二性别：Alpha、Beta 或 Omega。信息素影响注意与本能——但读不了心，也强迫不了服从。抑制剂是寻常药物；Nait 的配方自昏迷前从未变过。',
  },
  evelyne: {
    titleEn:'Duchess Evelyne', titleCn:'Evelyne 公爵夫人',
    tags:['evelyne','母亲','夫人','duchess','mother','信','letter'],
    chars:['elise','lucien'], knownBy:['elise','lucien'],
    unlock:{flags:['kept_letter','letter_seen']}, ai:true,
    textEn:'The late Duchess. She planted the white roses the year Nait was born — white, she said, because any other color would argue with the roses\' own business of being roses. A letter in her hand survives in the library.',
    textCn:'已故的公爵夫人。Nait 出生那年她种下白玫瑰——要白的，她说，因为其他任何颜色都会和玫瑰身为玫瑰这件事争辩。图书室里还留着一封她手写的信。',
  },
  magic: {
    titleEn:'Magic & Mages', titleCn:'魔法与法师',
    tags:['魔法','magic','法师','mage','ward','结界'],
    chars:['alaric'], knownBy:['alaric','lucien','damien','roderic','elise'],
    unlock:{flag:'met_alaric'}, ai:true,
    textEn:'Magic leaves traces instruments can read — wards, signatures, residue. Mages like Alaric Varenne examine anomalies the way physicians read symptoms: precisely, and without sentiment.',
    textCn:'魔法会留下仪器可读的痕跡——结界、署名、残余。Alaric Varenne 这样的法师查看异象，如同医师读症状：精确，不带感情。',
  },
  chalk_dent: {
    titleEn:'The Chalk Circle', titleCn:'白垩圆与凹痕',
    tags:['chalk','circle','dent','凹痕','白垩','圆圈'],
    chars:['alaric'], knownBy:['alaric'],
    unlock:{flag:'met_alaric'}, ai:true,
    textEn:'A chalk circle marks the spot where Nait fell. Inside it, the air still holds a shape, like a dent in a cushion — whatever passed through Nait did not leave; it paused, like a traveler waiting for something.',
    textCn:'白垩的圆标出 Nait 倒下的位置。圆内，空气至今仍维持着一个形状，像坐垫上的凹痕——穿过 Nait 的东西并未离开，只是停下了，像在等什么的旅人。',
  },
  wycliffe_feud: {
    titleEn:'The Wycliffe Feud', titleCn:'与 Wycliffe 的旧怨',
    tags:['wycliffe','roderic','骑术','riding','tournament','比武','恩怨','feud'],
    chars:['roderic'], knownBy:['roderic'],
    unlock:{flag:'heard_roderic'}, ai:true,
    textEn:'Two years of shouting across tournament lists. Roderic mocked Nait\'s riding; Nait had Roderic\'s attendant reassigned to border patrol and his knights uninvited from the Rosier hunt. He always shouted first; Nait always shouted last.',
    textCn:'两年隔场对喊。Roderic 嘲笑过 Nait 的骑术；Nait 则把他的侍从调去边境巡逻，把他的骑士从 Rosier 猎会名单上划掉。总是 Roderic 先喊，但总是 Nait 喊最后一句。',
  },
  court: {
    titleEn:'The Court', titleCn:'宫廷',
    tags:['court','宫廷','王宫','palace','王储','prince','damien'],
    chars:['damien'], knownBy:['damien','lucien','elise','alaric','roderic'],
    unlock:{day:5}, ai:true,
    textEn:'Nothing from the palace is ever informal — it only means the knives stay sheathed. The court noticed the Rosier heir\'s absence, and absences get filled with guesses.',
    textCn:'王宫里没有真正的"非正式"——那只是意味着刀不出鞘。王室的渡鸦纹章在宫门与信蜡上随处可见；宫廷也注意到了 Rosier 继承人的缺席，而缺席总会被猜测填满。',
  },
  royal_city: {
    titleEn:'The Royal City', titleCn:'王城',
    tags:['city','royal city','王城','市集','market','academy','学院'],
    chars:['damien','alaric','elise'], knownBy:['damien','alaric','elise','lucien','roderic'],
    unlock:{flag:'city_unlocked'}, ai:true,
    textEn:'The royal city layers court, academy, market, guilds, servants, students and ordinary households on the same streets; the royal raven crest marks the gates and palace district. Nait was known here before the coma, but not by everyone in the same way.',
    textCn:'王城把宫廷、学院、市集、行会、仆从、学生与普通家庭叠在同一片街巷里；城门与宫区常可见王室渡鸦纹章。昏迷前的 Nait 在这里颇有名气——但不同人记住的，并不是同一个版本。',
  },
  outskirts: {
    titleEn:'Beyond the West Gate', titleCn:'西门之外',
    tags:['outskirts','countryside','郊外','领村','河岸','road','旧道'],
    chars:['roderic','lucien','elise'], knownBy:['roderic','lucien','elise'],
    unlock:{flag:'outskirts_unlocked'}, ai:true,
    textEn:'Beyond the west gate lie estate villages, old roads, river crossings and the practical geography nobles reduce to reports. Rosier responsibility becomes less abstract here.',
    textCn:'西门之外是领村、旧道、渡口，以及贵族们常常压缩进报告里的真实地理。到了这里，“Rosier 的责任”开始不再只是抽象名词。',
  },
  stewardship: {
    titleEn:'Rosier Stewardship', titleCn:'Rosier 领地治理',
    tags:['estate','stewardship','领地','治理','财政','领民','bridge','桥'],
    chars:['lucien','elise','damien','roderic'], knownBy:['lucien','elise','damien','roderic'],
    unlock:{flag:'estate_tutorial_started'}, ai:true,
    textEn:'Lucien begins teaching Nait estate administration in the second week: petitions first, then small decisions. Reports are evidence, not reality; every financial choice reaches real people.',
    textCn:'第二周起，Lucien 开始让 Nait 接触领地事务：先读陈情，再做小型决策。报告是证据，不是现实本身；每一个财政选择最终都会落到具体的人身上。',
  },
  identity: {
    titleEn:'Who Is Nait Rosier?', titleCn:'如今的 Nait 是谁',
    tags:[],
    chars:[],
    unlock:{day:1}, ai:false,   // spoiler boundary — never injected into prompts
    textEn:'The question the early weeks are quietly asking. Forgotten memory, body memory, magical anomaly — the evidence contradicts itself on purpose. The game stores evidence, not answers. The interpretation is yours.',
    textCn:'贯穿最初几周的问题。被遗忘的记忆、身体的记忆、魔法异象——证据故意彼此矛盾。这个游戏保管证据，不保管答案。解读权在你。',
  },
};

/* ============================================================
   DAY_FLAVOR: authored fallback ambience (Contract §21/§22 —
   the game must never depend on AI output).
   ============================================================ */

const DAY_FLAVOR = {
  1: [ {en:'The first morning after two months. The manor moves quietly around you.', cn:'两个月后的第一个清晨。庄园在你周围放轻了动作。'},
       {en:'White curtains, white roses beyond the glass, a name you have to grow into.', cn:'白纱帘，玻璃外的白玫瑰，和一个需要你重新长大的名字。'} ],
  2: [ {en:'Rain before dawn; the corridors smell of wet gravel and lamp oil.', cn:'黎明前落过雨，走廊里有湿碎石与灯油的气味。'},
       {en:'Somewhere below, the kitchen is already arguing about breakfast.', cn:'楼下某处，厨房已经在为早餐争论。'} ],
  3: [ {en:'The rain has settled in for the day, patient as a debt collector.', cn:'雨打算赖上一整天，耐心得像个收债人。'},
       {en:'A servant passes with folded linen, humming something out of tune.', cn:'一个仆人抱着叠好的亚麻布走过，哼着跑了调的曲子。'} ],
  4: [ {en:'Sun at last. The roses steam gently, giving back the rain.', cn:'终于放晴。玫瑰蒸着水汽，把雨水一点点还回去。'},
       {en:'Practice steel rings from the training ground before breakfast.', cn:'早饭前，训练场的练习剑声已经响了。'} ],
  5: [ {en:'A palace outrider was seen at the gate. The manor pretends not to notice.', cn:'有人在门口看见了王宫的前导骑。庄园假装没注意。'},
       {en:'The good silver is out. Elise has opinions about it.', cn:'那套好银器被取出来了。Elise对此有意见。'} ],
  6: [ {en:'All day, carriages. All day, the manor holds its breath.', cn:'一整天都是马车声。一整天，庄园都屏着呼吸。'},
       {en:'White roses were cut for the palace ballroom at dawn.', cn:'天没亮，白玫瑰就被剪下送往王宫舞厅。'} ],
  7: [ {en:'The seventh morning. The week is already becoming a story people tell.', cn:'第七个清晨。这一周已经开始变成人们口中的故事。'},
       {en:'The rain has moved on. The windows are still open.', cn:'雨已经走了。窗还开着。'} ],
  8: [ {en:'The second week begins with ink, petitions, and breakfast going cold.', cn:'第二周从墨水、陈情和渐渐变凉的早餐开始。'} ],
  9: [ {en:'Old reputations arrive before invitations do.', cn:'旧名声总比邀请先一步抵达。'} ],
  10:[ {en:'Beyond Rosecourt, the royal city is louder than memory.', cn:'Rosecourt之外，王城比记忆更喧闹。'} ],
  11:[ {en:'Old handwriting is a peculiar kind of witness.', cn:'旧笔迹是一种很奇怪的证人。'} ],
  12:[ {en:'The city begins to have routes instead of impressions.', cn:'王城开始拥有道路，而不再只是一团印象。'} ],
  13:[ {en:'At dusk, the library remembers the wrong kind of rain.', cn:'黄昏时，图书室记起了一场不该存在的雨。'} ],
  14:[ {en:'Two weeks. People have begun asking for your time.', cn:'两周。人们开始主动来占用你的时间。'} ],
  15:[ {en:'The west gate opens onto a sky too large for the manor.', cn:'西门之外，是一片庄园装不下的天空。'} ],
  16:[ {en:'A signature is smaller than a bridge and heavier than one.', cn:'一个签名比桥小得多，却可能比桥更重。'} ],
  17:[ {en:'Reports, roads, policy, weather: the same problem changes with the room.', cn:'报告、道路、政策、天气——同一个问题换个房间就换了样子。'} ],
  18:[ {en:'Three directions send invitations before noon.', cn:'中午之前，邀请从三个方向一起抵达。'} ],
  19:[ {en:'The body knows a stubborn window latch.', cn:'身体记得一扇固执的窗闩。'} ],
  20:[ {en:'The anomaly has learned the road beyond Rosecourt.', cn:'异象似乎也学会了离开Rosecourt的路。'} ],
  21:[ {en:'Three weeks. The map is almost yours.', cn:'三周。整张地图已经快要属于你。'} ],
};
