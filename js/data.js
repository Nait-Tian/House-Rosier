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
    en:'Elise Marlowe', cn:'Elise', sprite:'assets/char/elise.webp',
    chatAvatar:'assets/chat/elise.webp', bondPortrait:'assets/bond/elise.webp',
    spriteScale:1.08, spriteY:'-0.6vh', spriteScaleMob:1.12, spriteYMob:'-0.2vh',
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
    en:'Lucien', cn:'Lucien', sprite:'assets/char/lucien.webp',
    chatAvatar:'assets/chat/lucien.webp', bondPortrait:'assets/bond/lucien.webp',
    spriteScale:1.00, spriteY:'-0.4vh', spriteScaleMob:1.04, spriteYMob:'0vh',
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
    en:'Alaric Varenne', cn:'Alaric', sprite:'assets/char/alaric.webp',
    chatAvatar:'assets/chat/alaric.webp', bondPortrait:'assets/bond/alaric.webp',
    spriteScale:1.04, spriteY:'-0.9vh', spriteScaleMob:1.08, spriteYMob:'-0.4vh',
    titleEn:'Mage of Anomalies', titleCn:'异象法师', gender2:'Alpha',
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
    en:'Roderic Wycliffe', cn:'Roderic', sprite:'assets/char/roderic.webp',
    chatAvatar:'assets/chat/roderic.webp', bondPortrait:'assets/bond/roderic.webp',
    spriteScale:1.07, spriteY:'-0.7vh', spriteScaleMob:1.10, spriteYMob:'-0.3vh',
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
    en:'Damien', cn:'Damien', sprite:'assets/char/damien.webp',
    chatAvatar:'assets/chat/damien.webp', bondPortrait:'assets/bond/damien.webp',
    spriteScale:1.03, spriteY:'-0.8vh', spriteScaleMob:1.06, spriteYMob:'-0.4vh',
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
  duke_study:   { en:"Duke's Study",    cn:'公爵书房', zone:'manor' },
  palace:       { en:'Royal Palace',     cn:'王宫', zone:'city' },
  market:       { en:'Rosemarket Square',cn:'玫瑰市集', zone:'city' },
  academy:      { en:'Arcane Academy',   cn:'王立魔法学院', zone:'city' },
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
  frag_bracer: {
    titleEn:'The Old Bracer', titleCn:'旧护腕', kind:'unresolved_clue',
    srcEn:'Found · Training Ground', srcCn:'拾获于 · 训练场',
    descEn:'A worn practice bracer with your initials. When the wooden sword slipped toward you, your body moved first — a parry you do not remember learning. Muscle remembers what the mind has lost. Or so it seems.',
    descCn:'一只磨旧的练习护腕，内侧刻着你的名字缩写。木剑滑脱的那一瞬间，身体先于意识动了——一记你不记得学过的格挡。肌肉记得头脑遗失的事。至少，看起来是这样。',
  },
  frag_dream: {
    titleEn:'Dream of the Rainy Night', titleCn:'雨夜之梦', kind:'unresolved_clue',
    srcEn:'Found · In a Dream', srcCn:'拾获于 · 梦境',
    descEn:'White roses drenched in rain. Someone calling your name from very far away — or very near. You cannot tell whether the voice was yours. Dreams offer possibilities, not answers.',
    descCn:'被雨水浸透的白玫瑰。有人从很远——或者很近的地方唤你的名字。你分不清那是不是自己的声音。梦提供可能性，不提供答案。',
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
      cn:'光。白色的纱帘一起一伏。头像是被羊毛裹着。',
      next:'n2' },
    n2:{ sp:null,
      en:'A ceiling you should know. A room that smells of roses and medicine. Nothing comes when you reach for it.',
      cn:'一个你理应熟悉的天花板。一间弥漫着玫瑰与药草气味的房间。可当你伸手去够记忆，什么也抓不到。',
      next:'n3' },
    n3:{ sp:'elise', sprite:'elise',
      en:'—You\'re awake. You\'re really awake!',
      cn:'——你醒了。你真的醒了！',
      next:'n4' },
    n4:{ sp:'elise',
      en:'Two months, {addr}. Two whole months. The physicians said… never mind what they said. You\'re awake.',
      cn:'两个月了，{addr}。整整两个月。医师们说……算了，他们说什么都不重要了。你醒了。',
      next:'n5' },
    n5:{ sp:null,
      en:'The maid\'s eyes are red-rimmed. She knows you. You do not know her.',
      cn:'侍女的眼眶泛红。她认得你。而你并不认得她。',
      next:'c1' },
    c1:{ choice:{ promptEn:'How do you respond?', promptCn:'你要如何回应？',
      options:[
        { en:'Apologize for making her worry.',
          cn:'向她道歉，让她担心了。',
          fx:[['flag','tone_soft',true]],
          fb:{en:'Elise laughs — wet, startled, real.', cn:'Elise愣了一下，随即笑出了声，眼角还湿着。'},
          goto:'r_soft' },
        { en:'Ask plainly what happened to you.',
          cn:'直接问自己出了什么事。',
          fx:[['flag','tone_plain',true]],
          fb:{en:'She steadies herself, grateful for a straight question.', cn:'她稳了稳呼吸，似乎感激这个直接的问题。'},
          goto:'r_plain' },
        { en:'Joke that you overslept a little.',
          cn:'开个玩笑，说自己只是睡得久了些。',
          fx:[['flag','tone_wry',true]],
          fb:{en:'For a second she looks like she might cry and laugh at once.', cn:'她一时间像是又想哭又想笑。'},
          goto:'r_wry' },
      ]},
    },
    r_soft:{ sp:'elise',
      en:'Don\'t. Don\'t you dare apologize. You\'re here. That\'s everything.',
      cn:'别。别跟我道歉。你在这里，这就够了。',
      next:'m1' },
    r_plain:{ sp:'elise',
      en:'No one knows. You collapsed in the library two months ago and simply… didn\'t wake. The physicians found nothing. Nothing at all.',
      cn:'没有人知道。两个月前你在图书室昏倒，然后就……再没有醒。医师什么都查不出来。什么都查不出来。',
      next:'m1' },
    r_wry:{ sp:'elise',
      en:'"A little." Two months of "a little." —You haven\'t changed as much as they feared, have you.',
      cn:'"久了些"。整整两个月的"久了些"。——看来你没有像他们担心的那样，变成另一个人。',
      next:'m1' },
    m1:{ sp:'elise',
      en:'I\'m Elise. Elise Marlowe. Your personal maid, since you were fourteen. If you don\'t remember — we\'ll start from there.',
      cn:'我叫Elise，Elise Marlowe。从你十四岁起就是你的贴身侍女。如果你不记得了——那我们就从这里重新开始。',
      next:'m2' },
    m2:{ sp:'elise',
      en:'You are Nait Rosier, sole heir of House Rosier. This is Rosecourt Manor. And the Duke — your father — will want to see you the moment he returns tomorrow.',
      cn:'你是Nait Rosier，Rosier 家唯一的继承人。这里是Rosecourt Manor。公爵大人——你的父亲——明天一回来就会想见你。',
      next:'m3' },
    m3:{ sp:null,
      en:'Nait Rosier. The name sits on you like a borrowed coat. It fits. You just don\'t remember ever wearing it.',
      cn:'Nait Rosier。这个名字落在身上，像一件借来的外套。尺寸刚好，只是你不记得自己穿过。',
      next:'m4' },
    m4:{ sp:'elise',
      en:'Rest today. No visitors, no questions from the staff — I\'ve seen to it. Tomorrow we begin again, one small thing at a time.',
      cn:'今天只管休息。没有访客，下人们也不会来多问——我都安排好了。明天我们再一点一点重新开始。',
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
      cn:'你的抑制剂。配方和从前一样——医师留下了详细的医嘱。你是 Omega，{addr}。有些事，就算记忆松了手，身体也会替你记着。',
      next:'n3' },
    n3:{ sp:'elise',
      en:'Oh — and this. Citrus water, before bed. You used to refuse to sleep without it. Freshly torn peel, you always said. Sharp and green, like… well. Like you.',
      cn:'对了——还有这个。睡前喝的柑橘水。你以前说不喝就睡不着。要现撕的果皮，你总这么说。又冲又青，就像……嗯，就像你。',
      next:'c1' },
    c1:{ choice:{ promptEn:'The habit is yours, but you don\'t remember it.', promptCn:'习惯属于你，记忆却不属于你。',
      options:[
        { en:'Ask her to tell you more about the old you.',
          cn:'请她多讲讲从前的你。',
          fx:[['flag','asked_past',true]],
          fb:{en:'She considers it, then nods — carefully, like opening an old door.', cn:'她想了想，点了点头——小心翼翼的，像推开一扇旧门。'},
          goto:'r_ask' },
        { en:'Drink the citrus water and let today end.',
          cn:'喝下柑橘水，让今天结束。',
          fx:[['health',4]],
          fb:{en:'Sharp, green, faintly bitter. Familiar in a way you cannot explain.', cn:'又冲，又青，微微发苦。熟悉得无法解释。'},
          goto:'r_drink' },
      ]},
    },
    r_ask:{ sp:'elise',
      en:'You were… difficult. Proud. Quick with a cruel word and quicker with a loyal one. You protected your own like a hedge of thorns. People outside the hedge only ever saw the thorns.',
      cn:'你从前……不好相处。骄傲。伤人的话出口快，护短的话更快。你护着自己人的样子像一丛荆棘——而篱笆外的人，只看得见刺。',
      next:'r_ask2' },
    r_ask2:{ sp:'elise',
      en:'But that\'s their story of you. Mine is that you once sat up all night with a feverish kitchen boy because he was yours to look after. Both are true. Keep both.',
      cn:'但那是别人嘴里的你。我记得的，是你曾经守着发烧的厨房学徒坐了整夜，因为那是你要照顾的人。两个都是真的。把两个都留着。',
      next:'e1' },
    r_drink:{ sp:'elise',
      en:'Good. Sleep now. The manor kept your place — it kept everything, really. It\'s all still here, waiting for you to remember your way through it.',
      cn:'好。睡吧。庄园替你留着位置——其实它什么都留着。一切都在原地，等你重新认路。',
      next:'e1' },
    e1:{ sp:null, sprite:'none',
      en:'Sleep takes you quickly. Somewhere beneath it, rain on windows — though the night is clear.',
      cn:'睡意很快漫上来。在睡意深处，有雨敲窗的声音——尽管今夜晴空无云。',
      end:true },
  }
};

/* ---------------- DAY 2 ---------------- */
SCENES.d2_medical = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Morning. The physician comes and goes with his quiet instruments. His verdict: the body is mending. The memory — he cannot even find the wound.',
      cn:'清晨。医师带着安静的器械来了又去。他的结论是：身体在痊愈。至于记忆——他连伤口都找不到。',
      next:'n2' },
    n2:{ sp:'elise', sprite:'elise',
      en:'He says walking will help. A few steps to the window, no more. Shall we?',
      cn:'医师说走动会有帮助。走到窗边就好，不能再多。试试吗？',
      next:'c1' },
    c1:{ choice:{ promptEn:'Your legs feel like water.', promptCn:'双腿软得像水。',
      options:[
        { en:'Push yourself to walk the whole room.',
          cn:'逞强走完整整一圈。',
          fx:[['health',-4],['flag','stubborn_walk',true]],
          fb:{en:'The room sways. Elise catches your elbow without a word.', cn:'房间晃了一下。Elise一言不发地扶住你的手肘。'},
          goto:'r_push' },
        { en:'Take the few steps to the window, as told.',
          cn:'照医嘱，只走到窗边。',
          fx:[['health',6]],
          fb:{en:'Three steps. Small, real, yours.', cn:'三步。微小、真实、属于你。'},
          goto:'r_rest' },
      ]},
    },
    r_push:{ sp:'elise',
      en:'That. That right there is exactly the old you. Ambition first, body second. Sit down before I fetch the Duke\'s entire guard.',
      cn:'就是这个。这个样子，简直是从前的你。心气在前，身体在后。快坐下，不然我就把公爵大人的卫队全叫来。',
      next:'m1' },
    r_rest:{ sp:'elise',
      en:'Good. The old you would have walked the whole room out of spite, so — thank you. Genuinely.',
      cn:'很好。换作从前的你，一定会赌气走完整间屋子——所以，谢谢你。真心的。',
      next:'m1' },
    m1:{ sp:null,
      en:'Outside the window: white roses, gravel paths, a manor that kept your place for two months.',
      cn:'窗外：白玫瑰，碎石小径，一座替你留了两个月位置的庄园。',
      next:'m2' },
    m2:{ sp:'elise',
      en:'The Duke is home. He\'s been in his study since dawn, not opening the door. He asked me to bring you to the sitting room this afternoon — only if you feel able.',
      cn:'公爵大人回来了。从天亮起就关在书房里，谁也不见。他让我下午带你去会客厅——只在你觉得撑得住的时候。',
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
      cn:'坐。你根本不该站着，但我若命令你坐，你一定会拒绝。所以——我是在请求。',
      next:'n3' },
    n3:{ sp:'lucien',
      en:'Two months. I signed no announcements, received no delegations, and told the court only that the Rosier heir was recovering. They have begun to ask what from.',
      cn:'两个月。我没有签署任何公告，没有接见任何使团，只告诉宫廷：Rosier 家的继承人正在休养。他们已经开始问：休养什么。',
      next:'n4' },
    n4:{ sp:'lucien',
      en:'I don\'t care what they ask. What I need to know is simpler. When you look at me — is there anything? Anything at all?',
      cn:'我不在乎他们问什么。我需要知道的更简单。你看着我的时候——有哪怕一点感觉吗？任何一点都行。',
      next:'c1' },
    c1:{ choice:{ promptEn:'He is your father. You remember nothing.', promptCn:'他是你的父亲。而你什么都不记得。',
      options:[
        { en:'Tell him honestly: nothing. But you\'d like there to be.',
          cn:'如实告诉他：没有。但你希望会有。',
          fx:[['flag','honest_lucien',true],['rep',1]],
          fb:{en:'Something behind his composure loosens — almost imperceptibly.', cn:'他镇定之下的某处松动了——几乎难以察觉。'},
          goto:'r_honest' },
        { en:'Ask what you were like, before.',
          cn:'反问他：从前的我是什么样子？',
          fx:[['flag','asked_lucien_past',true]],
          fb:{en:'He turns to the fire, deciding where to begin.', cn:'他转向炉火，像在决定从哪里说起。'},
          goto:'r_ask' },
        { en:'Say nothing. Meet his eyes and hold them.',
          cn:'什么也不说。迎着他的目光，不躲。',
          fx:[['flag','silent_lucien',true]],
          fb:{en:'He studies you for a long moment — and nods, once.', cn:'他久久地审视你——然后点了一下头。'},
          goto:'r_silent' },
      ]},
    },
    r_honest:{ sp:'lucien',
      en:'Then we build it again. Slowly. You are my child before you are the heir — remember that order, even if you remember nothing else.',
      cn:'那我们就重新来过。慢慢来。你先是我的孩子，然后才是继承人——记住这个顺序，哪怕你别的都记不住。',
      next:'m1' },
    r_ask:{ sp:'lucien',
      en:'You were a storm I allowed to form. I cleaned up after it because I could, and because after your mother died, I couldn\'t bear to be the thing that rained on you. That was my failure, not yours.',
      cn:'你曾是一场我纵容成形的风暴。我替你收拾残局，因为我做得到，也因为你母亲走后，我不忍心做那场浇在你头上的雨。这是我的失职，不是你的过错。',
      next:'m1' },
    r_silent:{ sp:'lucien',
      en:'Hm. That, at least, is unchanged. Your mother used to answer me the same way — silence, and spine.',
      cn:'哼。至少这一点没变。你母亲从前也是这样回答我的——沉默，加一副硬骨头。',
      next:'m1' },
    m1:{ sp:'lucien',
      en:'Two matters of business. A mage named Alaric Varenne arrives tomorrow — I asked him to examine your collapse. Magic left no trace the physicians could read, but magic is what it smelled like to me.',
      cn:'两件事。一位名叫Alaric Varenne的法师明天到——我请他来查看你昏倒的原因。医师读不出魔法的痕迹，但依我看，那闻起来就是魔法。',
      next:'m2' },
    m2:{ sp:'lucien',
      en:'Second: the court holds a reception in six days. I can excuse you. I will not advise it — vanishing invites more questions than limping into the light. The choice, however, is yours.',
      cn:'第二件：六天后宫廷有一场招待会。我可以替你推掉，但我不建议——消失比带伤露面更会招来揣测。不过，去不去由你决定。',
      next:'m3' },
    m3:{ sp:null,
      en:'He does not embrace you. He does not ask again about your memory. He simply refills your tea himself — a duke, pouring — and lets the silence be comfortable.',
      cn:'他没有拥抱你，也没有再追问记忆的事。他只是亲手为你续了茶——一位公爵，亲自斟茶——然后让沉默变得不难熬。',
      end:true },
  }
};

SCENES.d2_library = {
  bg:'library', loc:'library', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Rain against tall windows. The library keeps its books the way the manor keeps your room — untouched, waiting.',
      cn:'雨敲着高窗。图书室守着它的书，如同庄园守着你的房间——原封不动，静静等待。',
      next:'n2' },
    n2:{ sp:null,
      en:'Your feet carry you past the history shelves to a reading desk by the window — a route you do not remember learning.',
      cn:'你的脚带着你绕过历史书架，停在窗边一张阅读桌前——一条你不记得学过的路线。',
      next:'n3' },
    n3:{ sp:null,
      en:'Inside the desk: a letter, preserved between sheets of rice paper. The seal is a white rose. The hand is a woman\'s.',
      cn:'桌屉里有一封信，用绵纸衬着保存。火漆印是一朵白玫瑰。字迹出自女性之手。',
      next:'n4' },
    n4:{ sp:null, memory:'frag_letter',
      en:'"…and you still leave the window open on rainy nights, my love, exactly as you did at six years old. Some things the rain is meant to come in and touch." — E.R.',
      cn:'「……你仍然会在雨夜留一扇窗，亲爱的，和你六岁时一模一样。有些东西，是注定要放雨水进来碰一碰的。」——E.R.',
      next:'c1' },
    c1:{ choice:{ promptEn:'A letter from the late Duchess Evelyne. Your mother.', promptCn:'一封来自已故Evelyne公爵夫人的信。你的母亲。',
      options:[
        { en:'Keep the letter. It belongs with you now.',
          cn:'收好这封信。现在它属于你了。',
          fx:[['flag','kept_letter',true]],
          fb:{en:'The paper is warm from the lamp. Or from your hands.', cn:'信纸被灯烘得微暖。也或许是被你的手。'},
          goto:'e1' },
        { en:'Read it once more, then put it back.',
          cn:'再读一遍，然后放回原处。',
          fx:[['flag','letter_seen',true]],
          fb:{en:'Some things should stay where the rain can touch them.', cn:'有些东西，该留在雨水碰得到的地方。'},
          goto:'e1' },
      ]},
    },
    e1:{ sp:null,
      en:'Either way, a line of it follows you out of the library: some things the rain is meant to touch.',
      cn:'无论如何，有一行字跟着你走出了图书室：有些东西，是注定要放雨水进来碰一碰的。',
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
      cn:'体力缓慢地回来，像潮水决定重新信任海岸。',
      fx:[['health',5]],
      end:true },
  }
};

SCENES.d2_rest = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'You let the evening be simple: soup, the window, the weight of a blanket someone else tucked in.',
      cn:'你让这个夜晚保持简单：汤、窗户、以及一条别人替你掖好的被子的重量。',
      fx:[['health',10]],
      next:'n2' },
    n2:{ sp:null,
      en:'For the first time since waking, you fall asleep before the lamp is out.',
      cn:'自醒来以后，你第一次在灯熄之前睡着了。',
      end:true },
  }
};

/* ---------------- DAY 3 ---------------- */
SCENES.d3_alaric = {
  bg:'library', loc:'library', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Morning rain. Someone has drawn a circle of pale chalk around the spot where you collapsed two months ago.',
      cn:'晨雨。有人用白垩在你两个月前倒下的位置画了一个淡色的圆。',
      next:'n2' },
    n2:{ sp:null,
      en:'A man stands inside the circle\'s geometry but outside its edge — long white hair, a scholar\'s stillness, grey-green eyes that measure the room before they measure you.',
      cn:'一个男人站在圆的几何之内、边缘之外——白色长发，学者般的静，一双灰绿的眼睛先丈量了房间，然后才轮到你。',
      next:'n3' },
    n3:{ sp:'alaric', sprite:'alaric',
      en:'You\'re walking. Good. The Duke\'s letter said "recovering", which in noble correspondence can mean anything from a cold to a haunting.',
      cn:'你能走动了。很好。公爵的信里写"休养中"——在贵族书信里，这词可以从风寒一直涵盖到闹鬼。',
      next:'n4' },
    n4:{ sp:'alaric',
      en:'Alaric Varenne. I examine magical anomalies. Your two-month sleep qualifies: no wound, no poison, no curse-mark — and yet the air where you fell still holds a shape, like a dent in a cushion.',
      cn:'Alaric Varenne。我研究魔法异象。你这两个月的昏睡正够格：没有伤口，没有毒，没有咒痕——然而你倒下之处的空气至今仍维持着一个形状，像坐垫上的凹痕。',
      next:'n5' },
    n5:{ sp:'alaric',
      en:'One more thing. Your scent — citrus peel, torn fresh — reads on my instruments as a constant. Whatever happened to your memory left your signature untouched. That is unusual. Unusual is where I start.',
      cn:'还有一件事。你的气息——新撕开的柑橘皮——在我的仪器上是一条恒定的直线。无论你的记忆遭遇了什么，你的"署名"分毫未动。这不寻常。而不寻常，正是我的起点。',
      next:'c1' },
    c1:{ choice:{ promptEn:'He is watching how you answer, not just what.', promptCn:'他审视的不只是你答什么，还有你怎么答。',
      options:[
        { en:'Tell him the truth: you remember nothing.',
          cn:'如实相告：你什么都不记得了。',
          fx:[['rel','alaric','trust',2],['rel','alaric','curiosity',1],['flag','told_alaric_truth',true]],
          aiReact:{char:'alaric', dir:'The player told Alaric the plain truth: total memory loss. His skepticism softens by exactly one measured degree — dry, restrained, no warmth admitted to.'},
          fb:{en:'His skepticism softens — by exactly one degree, precisely measured.', cn:'他的怀疑软化了——恰好一度，精确得像量过。'},
          goto:'r_truth' },
        { en:'Ask him to show you the dent first.',
          cn:'请他先给你看那个"凹痕"。',
          fx:[['rel','alaric','curiosity',2],['rel','alaric','respect',1]],
          aiReact:{char:'alaric', dir:'The player asked to see the magical dent before asking whether it is dangerous. Alaric is quietly, scientifically pleased — the almost-smile he would deny.'},
          fb:{en:'He almost smiles. Almost.', cn:'他几乎要笑了。几乎。'},
          goto:'r_dent' },
        { en:'Decline politely. Your mind is your own.',
          cn:'婉拒。你的头脑是你自己的事。',
          fx:[['rel','alaric','trust',-1],['flag','avoided_alaric',true]],
          aiReact:{char:'alaric', dir:'The player politely declined the examination. Alaric accepts the boundary with dry courtesy, filing the refusal away as data; slightly more distant.'},
          fb:{en:'He nods — a door closing, carefully, without a sound.', cn:'他点了点头——一扇门轻轻合上，没有声响。'},
          goto:'r_avoid' },
      ]},
    },
    r_truth:{ sp:'alaric',
      en:'Nothing. Not faces, not the library, not the fall itself. — Then I\'ll be precise with you, since you\'ve been precise with me: I don\'t trust you. The old Nait Rosier once cost me a year\'s research over a corrected quotation. But data is data, and you are, currently, the most interesting data in this kingdom.',
      cn:'什么都不记得。不记得脸，不记得图书室，不记得倒下那一刻。——那我也对你精确一些，作为礼尚往来：我不信任你。从前的Nait Rosier，曾因为一处引文被纠正，让我一年的研究付诸东流。但数据就是数据。而你，目前是这座王国里最有趣的数据。',
      next:'m1' },
    r_dent:{ sp:'alaric',
      en:'Most people ask whether it\'s dangerous. You ask to see it. — Here. The ward catches light at this angle. Whatever passed through you did not leave; it paused. Like a traveler who stepped off the road to wait for something.',
      cn:'多数人问的是"危不危险"。你问的是"能不能看"。——这里。结界在这个角度会折光。穿过你的东西并未离开，它只是停下了。像旅人走下路基，在等什么。',
      next:'m1' },
    r_avoid:{ sp:'alaric',
      en:'Understood. Privacy is also data — it tells me the boundary is here. I\'ll work around it. I\'m good at working around walls. I\'ve had practice, courtesy of House Rosier.',
      cn:'明白。隐私也是数据——它告诉我边界在哪里。我会绕开它工作。我很擅长绕开墙，拜Rosier 家所赐，我练习过。',
      next:'m1' },
    m1:{ sp:'alaric',
      en:'I\'ll return tomorrow and the day after, if the Duke permits. Don\'t perform recovery for me. Recovering is a process, not a recital.',
      cn:'若公爵允许，我明天、后天都会来。不必在我面前表演康复。康复是过程，不是朗诵。',
      fx:[['flag','met_alaric',true]],
      next:'m2' },
    m2:{ sp:null, sprite:'none',
      en:'He repacks his instruments with the tenderness other men reserve for letters. The chalk circle stays.',
      cn:'他收拾器械的动作，带着旁人留给情书的那种轻柔。白垩的圆留在原地。',
      end:true },
  }
};

SCENES.d3_garden = {
  bg:'garden', loc:'garden', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Afternoon sun burns the rain off the roses. Elise finds you reading the hedges like a map.',
      cn:'午后的太阳把雨水从玫瑰上烤干。Elise找到你时，你正像读地图一样读着树篱。',
      next:'n2' },
    n2:{ sp:'elise', sprite:'elise',
      en:'So you\'ve met the mage. Let me guess: he measured something, declined to explain it, and left a chalk mark on the floor.',
      cn:'你见过那位法师了。让我猜猜：他测量了什么东西，拒绝解释，还在地板上留了个白垩记号。',
      next:'n3' },
    n3:{ sp:'elise',
      en:'There\'s history there, {addr}. He corrected your Latin in front of the whole academy salon — kindly, even. The old you froze his access to three rare-material suppliers for a year.',
      cn:'你们之间有段旧事，{addr}。他曾在学院沙龙上当众纠正你的拉丁文——甚至算得上是客气。而从前的你，冻结了他整整一年的三家稀有材料供应商。',
      next:'c1' },
    c1:{ choice:{ promptEn:'That was the old you.', promptCn:'那是从前的你。',
      options:[
        { en:'Resolve to undo the blockade, if it still stands.',
          cn:'决定解除封锁——如果它还在的话。',
          fx:[['flag','undo_blockade',true],['rel','alaric','respect',1]],
          fb:{en:'Elise raises an eyebrow — the good kind.', cn:'Elise挑了挑眉——是那种好的挑眉。'},
          goto:'e1' },
        { en:'File it away. Some accounts can\'t be paid in a day.',
          cn:'记在心里。有些账，不是一天能还清的。',
          fx:[['flag','noted_blockade',true]],
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
      cn:'消息在庄园里跑得比任何马都快：Wycliffe 家的继承人明天到访。公告写的是"致意"。骑士们的翻译是：来看看这场昏迷有没有让你变软。',
      next:'n3' },
    n3:{ sp:null,
      en:'On the fence rail, someone has left a polished riding crop — yours, the stablemaster says, kept oiled for two months. You don\'t remember it. Your hand closes around it like a handshake.',
      cn:'围栏上搁着一根擦得锃亮的马鞭——马夫长说是你的，两个月来一直上着油。你不记得它。你的手握上去，却像一次握手。',
      fx:[['flag','heard_roderic',true]],
      end:true },
  }
};

SCENES.d3_rest = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'You spend the afternoon letting the rain read to you. Recovery is a process, not a recital.',
      cn:'你让整个下午交给雨声朗读。康复是过程，不是朗诵。',
      fx:[['health',8]],
      end:true },
  }
};

/* ---------------- DAY 4 ---------------- */
SCENES.d4_breakfast = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Morning. Elise lays out clothes with the efficiency of a general and the commentary of a friend.',
      cn:'清晨。Elise摆出今天的衣服，效率像将军，语气像朋友。',
      next:'n2' },
    n2:{ sp:'elise', sprite:'elise',
      en:'The grey, not the black. The black was for the old you\'s moods. — There, look at that. Your collar\'s straight and your spine remembered how before your hands did.',
      cn:'灰的那套，不要黑的。黑色是从前的你闹情绪穿的。——看，果然。领子是直的，脊背比你的手先想起来了该怎么挺。',
      next:'n3' },
    n3:{ sp:'elise',
      en:'Lord Roderic Wycliffe arrives this afternoon. Two years of shouting at each other across tournaments, you two. If it helps: he always shouted first, but you always shouted last.',
      cn:'Roderic Wycliffe少爷下午到。你们俩在各种比武场上隔场对喊了两年。如果说有什么用的话：总是他先喊，但总是你喊最后一句。',
      next:'n4' },
    n4:{ sp:'elise',
      en:'Eat. You\'ll want your strength — he treats conversation like a cavalry charge.',
      cn:'吃吧。你会需要力气的——那人说话像骑兵冲锋。',
      end:true },
  }
};

SCENES.d4_roderic = {
  bg:'training', loc:'training', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Afternoon heat. A broad-shouldered man in riding leathers is arguing with the stablemaster — about a horse. About your horse.',
      cn:'午后的热气。一个穿骑装皮革、肩膀宽阔的男人正在和马夫长争论——为了一匹马。为了你的马。',
      next:'n2' },
    n2:{ sp:'roderic', sprite:'roderic',
      en:'—two months in a stall ruins a good animal, I don\'t care whose it— Oh. Speak of the devil. You look terrible. Less terrible than a corpse, but terrible.',
      cn:'——把一匹好马关在马厩里两个月就是糟蹋，我不管它是谁的——哦。说谁谁到。你气色真差。比尸体强点，但还是差。',
      next:'n3' },
    n3:{ sp:'roderic',
      en:'Roderic Wycliffe. Since you apparently remember nothing, I\'ll save you the guesswork: I mocked your riding at the spring tournament, and you had my attendant reassigned to border patrol and my knights uninvited from the Rosier hunt. We don\'t like each other. That\'s the honest foundation.',
      cn:'Roderic Wycliffe。既然你显然什么都不记得，我替你省掉猜测：春季比武会上我嘲笑过你的骑术，然后你就把我的侍从调去了边境巡逻，还把我的骑士们从Rosier猎会的名单上划掉了。我们互相看不顺眼。这就是诚实的地基。',
      next:'n4' },
    n4:{ sp:'roderic',
      en:'So. Is the amnesia real, or is it the most elaborate exit from a grudge in noble history?',
      cn:'所以。失忆是真的，还是贵族史上最煞费苦心的记仇退场方式？',
      next:'c1' },
    c1:{ choice:{ promptEn:'He is testing you. Loudly.', promptCn:'他在试探你。动静很大。',
      options:[
        { en:'Admit it\'s real — and ask him to reteach you to ride, someday.',
          cn:'承认是真的——并请他有朝一日重新教你骑马。',
          fx:[['rel','roderic','respect',2],['rel','roderic','warmth',1],['flag','asked_roderic_ride',true]],
          aiReact:{char:'roderic', dir:'The player admitted the amnesia is real and asked Roderic to reteach riding someday. He is startled into genuine delight and immediately covers it with loud bravado.'},
          fb:{en:'He stares. Then laughs — a real one, startled out of him.', cn:'他盯着你。然后大笑——是真的笑，猝不及防的那种。'},
          goto:'r_humble' },
        { en:'Give it back: "You still shout first, I hear."',
          cn:'顶回去："听说你还是先喊的那个。"',
          fx:[['rel','roderic','rivalry',2],['rel','roderic','respect',1]],
          aiReact:{char:'roderic', dir:'The player shot back that he is still the one who shouts first. The rivalry turns almost playful; he enjoys being met head-on.'},
          fb:{en:'The challenge in his expression turns almost playful.', cn:'他表情里的挑衅几乎变成了兴味。'},
          goto:'r_spark' },
        { en:'Say nothing. Let the silence answer.',
          cn:'不答。让沉默替你回答。',
          fx:[['rel','roderic','trust',-1]],
          aiReact:{char:'roderic', dir:'The player answered with silence. Roderic is nettled — he prefers being shouted at to being managed — and turns back to the horse.'},
          fb:{en:'"Right. That old trick." He turns back to the horse.', cn:'"行。又是老一套。"他转回去看马了。'},
          goto:'r_cold' },
      ]},
    },
    r_humble:{ sp:'roderic',
      en:'The great Nait Rosier, asking for lessons. Fine. When the physicians sign off — you and me, the quiet gelding, no audience. And I\'m telling everyone you cried. You didn\'t? Prove it by showing up.',
      cn:'了不起的Nait Rosier，开口求教。行。等医师点头——你、我、那匹最温驯的骟马，不对外开放。还有，我会跟所有人说你哭了。没哭？那就到场证明给我看。',
      next:'m1' },
    r_spark:{ sp:'roderic',
      en:'Ha! Elise told you that? Fair. And you still hold a grudge like a treasury holds coin — except you\'d have to remember it first. So here\'s the new wager: I\'ll treat you as a stranger. Strangers get a fair start. Don\'t waste it.',
      cn:'哈！Elise告诉你的？行吧。而你记仇还是记得像金库记金币——只不过这回你得先想得起来才行。这样吧：我把你当陌生人。陌生人享有公平的起点。别浪费。',
      next:'m1' },
    r_cold:{ sp:'roderic',
      en:'Two months asleep and the silence routine survives. Remarkable. What dies in there is anyone\'s guess.',
      cn:'睡了两个月，这套沉默的把戏还活着。了不起。那里面到底什么死了什么活着，谁也说不准。',
      next:'m1' },
    m1:{ sp:null,
      en:'A stablehand\'s practice sword slips off the rack, spinning toward you—',
      cn:'一个学徒的练习剑从架上滑落，打着旋朝你飞来——',
      next:'m2' },
    m2:{ sp:null, memory:'frag_bracer',
      en:'—and your hand is already there. A parry, clean and automatic, caught on the flat of your forearm like a habit the years oiled. You do not remember learning it. Your body disagrees.',
      cn:'——而你的手已经先到了。一记格挡，干净利落，完全自动，用小臂外侧稳稳接住，像一个被岁月上过油的习惯。你不记得学过它。你的身体不同意。',
      next:'m3' },
    m3:{ sp:'roderic', sprite:'roderic',
      en:'…Huh. Well. Whatever fell out of your head, that didn\'t. Keep the bracer — it\'s yours anyway. And Rosier? That was a decent parry. I don\'t say decent about people I\'m fighting.',
      cn:'……哦。行吧。不管你脑子里掉了什么出去，这个没掉。护腕留着——本来就是你的。还有，Rosier？刚才那记格挡，像话。我对还在打的人，从不说"像话"。',
      fx:[['flag','met_roderic',true],['rel','roderic','trust',1]],
      end:true },
  }
};

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
      cn:'「凹痕未移动。我亦尚未得出任何结论。——A.V.」下面还有一行小字：「你昨日的坦诚已被记录。数据就是数据。」',
      fx:[['rel','alaric','curiosity',1]],
      next:'e1' },
    cool:{ sp:null,
      en:'"The dent has not moved. Neither has my assessment. —A.V."',
      cn:'「凹痕未移动。我的评估亦未移动。——A.V.」',
      next:'e1' },
    e1:{ sp:null,
      en:'You fold the page into your pocket. Correspondence, of a kind.',
      cn:'你把纸页折好收进口袋。这也算一种通信。',
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
      cn:'坐。——这道树篱是你出生那年你母亲种下的。要白的，她说，因为其他任何颜色都会和玫瑰身为玫瑰这件事争辩。',
      next:'n3' },
    n3:{ sp:'lucien',
      en:'I have been thinking about what you asked. Or didn\'t ask. Either way, the answer I owe you is: whoever you were, you were hers too, and she would have liked your chances now. That\'s all. That\'s the whole speech.',
      cn:'我一直在想你问过的——或者没问出口的那个问题。无论如何，我欠你的答案是：无论你是谁，你也是她的孩子。而她会看好现在的你。说完了。整场演讲就这么多。',
      next:'e1' },
    e1:{ sp:null, sprite:'none',
      en:'He folds his papers. The two of you watch the roses not argue with anything.',
      cn:'他折起文件。你们一起看着玫瑰，看它们不与任何事争辩。',
      fx:[['rep',1]],
      end:true },
  }
};

SCENES.d4_rest = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Your arm aches pleasantly from the parry you never learned. You sleep like someone practicing for it.',
      cn:'手臂因为那记你从未学过的格挡而愉快地酸着。你睡得像在练习睡觉。',
      fx:[['health',7]],
      end:true },
  }
};

/* ---------------- DAY 5 ---------------- */
SCENES.d5_invitation = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Morning. A letter arrives on a silver tray — heavy cream paper, a crown sigil pressed in midnight-blue wax.',
      cn:'清晨。一封信躺在银托盘上送达——厚重的米色信纸，午夜蓝的蜡上印着王冠纹章。',
      next:'n2' },
    n2:{ sp:'elise', sprite:'elise',
      en:'From the palace. His Royal Highness invites the Rosier heir to tea this afternoon. "Informal," it says. Nothing from that palace is informal, {addr}. It just means the knives stay sheathed.',
      cn:'王宫来的。王储殿下邀Rosier 家的继承人今日午后饮茶。写的是"非正式"。那座宫殿里没有非正式，{addr}——那只是意味着刀不出鞘。',
      next:'n3' },
    n3:{ sp:'elise',
      en:'You knew each other as children. Then you grew into the habit of arriving late to his ceremonies, misordering his seating plans, and once — famously — correcting his French in front of the ambassador of the country that speaks it.',
      cn:'你们儿时相识。后来你养成了一种习惯：在他的典礼上迟到、打乱他的座次表，还有最出名的一次——当着法语国家大使的面，纠正他的法语。',
      next:'c1' },
    c1:{ choice:{ promptEn:'The reply must be written.', promptCn:'回函必须写下。',
      options:[
        { en:'Write a formal, flawless reply.',
          cn:'写一封郑重无瑕的回函。',
          fx:[['rep',1],['rel','damien','political_trust',1],['flag','reply_formal',true]],
          fb:{en:'Elise reads it twice. "The old you would have sent a scented insult."', cn:'Elise读了两遍："从前的你会回一封带香水的侮辱信。"'},
          goto:'e1' },
        { en:'Write three plain sentences and sign your name.',
          cn:'写三句大白话，签上名字。',
          fx:[['flag','reply_plain',true]],
          fb:{en:'"Bold," Elise says. "The crown prince reads everything twice."', cn:'"大胆，"Elise说，"那位王储什么都要读两遍。"'},
          goto:'e1' },
        { en:'Ask your father\'s steward to handle it.',
          cn:'交给父亲的执事处理。',
          fx:[['flag','reply_steward',true]],
          fb:{en:'Efficient. And noted — somewhere, everything is noted.', cn:'高效。而且会被记下——在某个地方，一切都被记下。'},
          goto:'e1' },
      ]},
    },
    e1:{ sp:null, sprite:'none',
      en:'The wax seal goes out before noon. By two, a palace carriage waits under the white roses.',
      cn:'蜡封在正午前送出。下午两点，一辆王宫的马车停在白玫瑰下。',
      end:true },
  }
};

SCENES.d5_damien = {
  bg:'ballroom', loc:'palace', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'The palace receives you in a small salon off the ballroom — gilded, symmetrical, and quietly impossible to relax in.',
      cn:'王宫在舞会厅旁的一间小沙龙接待你——鎏金，对称，精致得让人无法放松。',
      next:'n2' },
    n2:{ sp:null,
      en:'The crown prince rises as you enter. Pale gold hair, deep blue eyes, a courtesy so polished it shows no fingerprints.',
      cn:'王储在你进门时起身。淡金色的头发，深蓝色的眼睛，一副打磨到不留指纹的礼数。',
      next:'n3' },
    n3:{ sp:'damien', sprite:'damien',
      en:'Nait Rosier. Thank you for coming. Please, sit — I had them prepare the chair you didn\'t hate, the last time you were here. If memory serves, you said the other one "conspired against the spine."',
      cn:'Nait Rosier。谢谢你来。请坐——我让人备了你上次来时唯一不讨厌的那把椅子。如果没记错，你说另一把"与脊椎密谋作乱"。',
      next:'n4' },
    n4:{ sp:'damien',
      en:'I will not pretend this is only concern. The court has noticed your absence, and absences get filled with guesses. I prefer my variables examined, not guessed at. So I invited the variable to tea.',
      cn:'我不打算假装这只是关切。宫廷注意到了你的缺席，而缺席总会被猜测填满。我这个人，偏好把变量拿到眼前检验，而不是任由猜测。所以，我请变量来喝茶。',
      next:'n5' },
    n5:{ sp:'damien',
      en:'One observation, freely given: the old you never once looked for the exits when entering my rooms. Today you did. Make of that what you will — I intend to.',
      cn:'一条观察，免费奉送：从前的你走进我的房间，从不看一眼出口在哪里。今天你看了。随便你怎么理解——反正我会认真理解。',
      next:'c1' },
    c1:{ choice:{ promptEn:'The tea is excellent. The examination is mutual.', promptCn:'茶极好。审视是相互的。',
      options:[
        { en:'Tell him plainly: your memory is gone. Judge you as you are.',
          cn:'直说：你的记忆没有了。请按现在的你来评判。',
          fx:[['rel','damien','personal_trust',2],['flag','told_damien_truth',true]],
          aiReact:{char:'damien', dir:'The player told Damien plainly the memory is gone and asked to be judged as-is. For one unpolished moment he speaks as himself, not the crown — controlled vulnerability.'},
          fb:{en:'For a moment, he speaks as himself rather than as the crown.', cn:'有那么一刻，他不再以王储的身份说话，而是以他自己。'},
          goto:'r_truth' },
        { en:'Answer with polished deflection. The court way.',
          cn:'用圆润的外交辞令周旋。宫廷的方式。',
          fx:[['rel','damien','political_trust',2],['rep',1]],
          aiReact:{char:'damien', dir:'The player answered with polished court deflection. Damien enjoys the footwork as a professional — and notes that this dance partner has changed tempo.'},
          fb:{en:'He appreciates good footwork — and files it where he files everything.', cn:'他欣赏漂亮的步伐——然后把它归档到他那归档一切的地方。'},
          goto:'r_polite' },
        { en:'Ask what the old you was to him.',
          cn:'反问：从前的我，对你来说是什么？',
          fx:[['rel','damien','vulnerability',1],['flag','asked_damien_past',true]],
          aiReact:{char:'damien', dir:'The player asked what the old Nait was to him. The first unpolished pause of the afternoon; he gives a carefully measured inch of honesty.'},
          fb:{en:'A pause — the first unpolished second of the afternoon.', cn:'一个停顿——这个下午头一秒未经打磨的时间。'},
          goto:'r_ask' },
      ]},
    },
    r_truth:{ sp:'damien',
      en:'…That is either the worst lie ever attempted in this room, or the truth, which is more interesting. Very well. Then I will say to your face what I said behind your back: the Rosier heir was a splendid enemy of ceremony and a disaster to protocol — and the person sitting there now has not yet decided what to be. Watch yourself deciding. Few people get to.',
      cn:'……这要么是这间屋子里最拙劣的谎言，要么是真话——那就更有意思了。很好。那我就当着你的面，把你背后我说过的话重说一遍：Rosier 家的继承人曾是典礼的劲敌、规程的灾难——而现在坐在那里的这个人，还没有决定要成为什么。好好看着自己做决定。很少有人有这个机会。',
      next:'m1' },
    r_polite:{ sp:'damien',
      en:'Beautifully said and entirely empty — forgive me, I mean that as professional admiration. We\'ll do this dance properly, then. I should warn you: I have led this particular dance since I was nine, and I always know where it\'s going.',
      cn:'说得漂亮，且空无一物——恕我直言，这是专业的赞美。那我们就把这支舞好好跳完。不过我提醒你：这支舞我从九岁领舞到现在，我永远知道它要去哪里。',
      next:'m1' },
    r_ask:{ sp:'damien',
      en:'…An obligation I was fond of. There — a sentence I have never said to anyone, in a room full of listening walls. Don\'t make me regret the architecture of this conversation, Rosier.',
      cn:'……一份我心存好感的责任。好了——这句话我从未对任何人说过，而这间屋子处处是会听话的墙。别让我后悔这场对话的结构，Rosier。',
      next:'m1' },
    m1:{ sp:'damien',
      en:'The reception tomorrow — I will be there, wearing the crown\'s face. Whatever face you wear, wear it deliberately. That\'s not advice from the crown. Consider it… a wager between acquaintances. I dislike losing those.',
      cn:'明天的招待会——我会出席，戴着王储的那张脸。至于你戴哪张脸，请有意识地戴。这不是来自王储的建议。就当是……相识之人之间的一个赌约。而我不喜欢输。',
      fx:[['flag','met_damien',true]],
      next:'m2' },
    m2:{ sp:null, sprite:'none',
      en:'He sees you out himself, past three layers of protocol who all pretend not to watch.',
      cn:'他亲自送你出去，途经三层假装没有在看你们的宫廷仪仗。',
      end:true },
  }
};

/* ---------------- DAY 6 ---------------- */
SCENES.d6_reception = {
  bg:'ballroom', loc:'palace', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Evening. The reception fills the palace ballroom with candlelight, white roses, and the soft clink of reputations being tested.',
      cn:'夜晚。招待会用烛光、白玫瑰和名誉相碰的轻响，填满了王宫舞会厅。',
      next:'n2' },
    n2:{ sp:null,
      en:'You are the room\'s quiet thesis: the Rosier heir, returned from two months of silence. Every glance is a footnote.',
      cn:'你是这间屋子里安静的论题：从两个月的沉寂中归来的Rosier继承人。每道目光都是一条脚注。',
      next:'n3' },
    n3:{ sp:null,
      en:'Baroness Othmar finds you first, smiling the way people smile at unfinished business. "My dear. We heard the most creative rumors. Tell me which to retire."',
      cn:'Othmar 男爵夫人率先找上你，笑得像人们面对未竟事务时的那种笑："亲爱的。我们听到了最有创造力的传闻。告诉我该让哪一条退休。"',
      next:'c1' },
    c1:{ choice:{ promptEn:'The court is listening without listening.', promptCn:'整个宫廷都在假装没有听。',
      options:[
        { en:'Answer with grace: "The one where I died. I found it overwrought."',
          cn:'得体作答："我死过的那一条。我觉得太夸张了。"',
          fx:[['rep',2],['flag','reception_grace',true]],
          fb:{en:'Laughter — genuine, relieved — moves through the nearest circle.', cn:'笑声——真心的、松了口气的——传遍了最近的一圈人。'},
          goto:'b1' },
        { en:'Smile, excuse yourself, and withdraw early.',
          cn:'微笑告罪，提前离席。',
          fx:[['rep',-1],['flag','left_early',true]],
          fb:{en:'A clean exit. The whispering continues without you in it.', cn:'一次干净的退场。窃窃私语继续，只是里面没有了你。'},
          goto:'b1' },
        { en:'Let the silence stretch until she fills it herself.',
          cn:'让沉默延长，直到她自己来填满它。',
          fx:[['rep',1],['flag','reception_silence',true]],
          fb:{en:'She retreats, defeated by nothing at all. Elegant.', cn:'她败退给了空无一物。优雅。'},
          goto:'b1' },
      ]},
    },
    b1:{ branch:[
        { flag:'told_alaric_truth', goto:'alaric_warm' },
      ], else:'alaric_neutral' },
    alaric_warm:{ sp:'alaric', sprite:'alaric',
      en:'A familiar stillness at your shoulder. "You handled that well. Empirically." Alaric Varenne does not look at the baroness. "I told three people the truth of your condition this week. Interestingly, it made you harder to gossip about, not easier. Data."',
      cn:'一个熟悉的安静出现在你肩侧。"刚才处理得不错。经验证如此。"Alaric Varenne没有看男爵夫人。"这周我把你的真实情况告诉了三个人。有趣的是，这让你变得更难被议论，而不是更容易。数据。"',
      fx:[['rel','alaric','trust',1]],
      next:'b2' },
    alaric_neutral:{ sp:null,
      en:'Across the room, a white-haired scholar watches you the way he watches instruments. He raises his glass exactly one degree, and returns to the wall.',
      cn:'房间另一头，那位白发学者像看仪器一样看着你。他把酒杯举高了恰好一度，然后退回墙边。',
      next:'b2' },
    b2:{ branch:[
        { flag:'asked_roderic_ride', goto:'roderic_warm' },
      ], else:'roderic_neutral' },
    roderic_warm:{ sp:'roderic', sprite:'roderic',
      en:'Roderic materializes with two glasses and no permission. "You look like furniture. Drink this. —Physician signed off, by the way. Next week, the gelding, first light. Don\'t be the kind of person who\'s late to a horse."',
      cn:'Roderic端着两杯酒凭空出现，毫无请示。"你站得像件家具。喝了。——对了，医师签字了。下周，那匹骟马，天一亮。别做那种对马迟到的人。"',
      fx:[['rel','roderic','warmth',1],['rel','roderic','trust',1]],
      next:'b3' },
    roderic_neutral:{ sp:null,
      en:'By the far column, Wycliffe\'s heir is loudly not looking at you. He loses the argument with himself and nods — once, like a gate unlatching.',
      cn:'远处的柱子旁，Wycliffe 家的继承人正大张旗鼓地不看你。他在与自己的争论中败下阵来，点了一下头——一次，像门闩松开。',
      next:'b3' },
    b3:{ branch:[
        { flag:'told_damien_truth', goto:'damien_warm' },
      ], else:'damien_neutral' },
    damien_warm:{ sp:'damien', sprite:'damien',
      en:'The crown prince passes you in the current of the room, speaking without turning his head, as if to the candles. "You came, you were seen, you were interesting. The variable behaved. — For one more minute, Rosier, the exits are over there and no one would blame you."',
      cn:'王储随着人流经过你身边，没有转头，仿佛在对着蜡烛说话。"你来了，被看见了，并且有趣。变量表现得很好。——再多说一句，Rosier，出口在那边，现在离开，没人会怪你。"',
      fx:[['rel','damien','personal_trust',1],['rel','damien','vulnerability',1]],
      next:'e1' },
    damien_neutral:{ sp:null,
      en:'The crown prince catches your eye once across the ballroom, inclines his head a precise, public half-inch, and lets the crowd close over you again.',
      cn:'王储在舞厅那头与你对上视线，精确地、公开地颔首半寸，然后任由人群重新将你淹没。',
      next:'e1' },
    e1:{ sp:null, sprite:'none',
      en:'By midnight, the room has decided what to think of you — several things, contradicting one another, which is to say: you survived it.',
      cn:'午夜前，这间屋子已经决定了该怎么看你——好几件事，彼此矛盾。换句话说：你撑过来了。',
      fx:[['rep',1]],
      end:true },
  }
};

SCENES.d6_night = {
  bg:'bedroom', loc:'bedroom', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Night. Rain arrives at last, soft against the windows. You dream.',
      cn:'夜。雨终于来了，轻轻敲着窗。你做了一个梦。',
      next:'n2' },
    n2:{ sp:null, memory:'frag_dream',
      en:'White roses under rain. Someone calls your name from very far away — or very near. The voice might be yours. The window is open, and the rain is coming in to touch something.',
      cn:'雨中的白玫瑰。有人从很远——或者很近的地方唤你的名字。那声音可能是你自己的。窗开着，雨正进来，碰触着什么。',
      next:'c1' },
    c1:{ choice:{ promptEn:'The dream is already thinning.', promptCn:'梦正在变薄。',
      options:[
        { en:'Write it down before it disappears.',
          cn:'趁它消失前记下来。',
          fx:[['flag','dream_noted',true]],
          fb:{en:'Three sentences in the dark. Evidence, of a kind.', cn:'黑暗中的三行字。也算一种证据。'},
          goto:'e1' },
        { en:'Let it go. Some things belong to the rain.',
          cn:'随它去。有些东西属于雨。',
          fx:[['flag','dream_released',true]],
          fb:{en:'The roses recede. You let them.', cn:'玫瑰退远了。你由它们去。'},
          goto:'e1' },
      ]},
    },
    e1:{ sp:null,
      en:'Outside, the real rain keeps its own counsel.',
      cn:'窗外，真实的雨守着自己的秘密。',
      end:true },
  }
};

/* ---------------- DAY 7 ---------------- */
SCENES.d7_garden = {
  bg:'garden', loc:'garden', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'The seventh morning. The roses after rain look rinsed of everything except themselves.',
      cn:'第七个清晨。雨后的玫瑰像被漂洗过，除了它们自己，什么也不剩。',
      next:'n2' },
    n2:{ sp:'elise', sprite:'elise',
      en:'One week, {addr}. A week ago you didn\'t know my name. Now look at you — walking the garden before breakfast like you pay rent on it.',
      cn:'一个星期了，{addr}。一周前你还不知道我的名字。现在看看你——早饭前就在花园里散步，仿佛这地方你付了租金。',
      next:'n3' },
    n3:{ sp:'elise',
      en:'Everyone asks me, you know. The staff, the kitchen, the Duke\'s own steward. "Is the heir… back?" I tell them the truth: something is. It walks, it drinks citrus water, it leaves the window open when it rains.',
      cn:'所有人都来问我，你知道的。下人们、厨房、公爵大人的执事。"继承人……回来了吗？"我告诉他们实话：有什么回来了。它会走路，会喝柑橘水，下雨时会留一扇窗。',
      next:'n4' },
    n4:{ sp:'elise',
      en:'But that\'s my answer. Yours is the one the whole week has been quietly asking. So — who is Nait Rosier now? You don\'t have to tell me. You just have to choose which question to carry.',
      cn:'但那是我的答案。属于你的那个，是这一整个星期都在悄悄问的问题。所以——如今的Nait Rosier，是谁？你不必告诉我。你只需要选择，接下来背着哪个问题走。',
      next:'c1' },
    c1:{ choice:{ promptEn:'The question of the whole week.', promptCn:'贯穿这一周的问题。',
      options:[
        { en:'"Perhaps the old Nait is still me. I\'ll learn to carry it."',
          cn:'"也许从前的Nait仍是我。我会学着背负它。"',
          fx:[['flag','identity_accept_past',true]],
          fb:{en:'Elise nods slowly, like closing a letter she\'ll keep.', cn:'Elise缓缓点头，像收起一封会留着的信。'},
          goto:'r_past' },
        { en:'"I\'ll be the Nait standing here. The rest can catch up."',
          cn:'"我要做此刻站在这里的Nait。其余的，让它追上来。"',
          fx:[['flag','identity_new_self',true]],
          fb:{en:'"Then it\'s lucky," she says, "that this one drinks the citrus water too."', cn:'"那很幸运，"她说，"因为这一位也喝柑橘水。"'},
          goto:'r_new' },
        { en:'"I don\'t know. Perhaps not knowing is allowed."',
          cn:'"我不知道。也许不知道，也是被允许的。"',
          fx:[['flag','identity_unknown',true]],
          fb:{en:'"It is in this garden," Elise says. "I checked with the roses."', cn:'"在这座花园里是被允许的，"Elise说，"我向玫瑰核实过了。"'},
          goto:'r_unknown' },
      ]},
    },
    r_past:{ sp:null,
      en:'The hedge stands white and undecided, holding both possibilities the way it holds the rain.',
      cn:'树篱洁白地立着，不置可否，像容纳雨水一样，同时容纳两种可能。',
      next:'e1' },
    r_new:{ sp:null,
      en:'The gravel remembers your steps from a week of mornings. It approves of being walked on by the present tense.',
      cn:'碎石路记得你这一周每个清晨的脚步。它乐意被现在进行时踩在脚下。',
      next:'e1' },
    r_unknown:{ sp:null,
      en:'A window somewhere above is open, though no one asked it to be. The rain hasn\'t come yet today. It might.',
      cn:'楼上某处有一扇窗开着，尽管没有人吩咐过。今天的雨还没来。也许会来。',
      next:'e1' },
    e1:{ sp:'elise', sprite:'elise',
      en:'Come inside soon. The week\'s ending, but breakfast isn\'t. And {addr} — whoever you turn out to be, you were worth waiting two months for. That part was never in question.',
      cn:'早点进来。这个星期要结束了，但早餐不会。还有，{addr}——无论你最终是谁，你都值得那两个月的等待。这一点，从来不是问题。',
      end:true },
  }
};

SCENES.d7_closing = {
  bg:'garden', loc:'garden', start:'n1',
  nodes:{
    n1:{ sp:null, sprite:'none',
      en:'Seven days. A library chalk circle, a polished riding crop, a letter under a rose seal, a crown prince\'s wager, a dream of rain.',
      cn:'七天。一个图书室的白垩圆，一根擦亮的马鞭，一封玫瑰火漆的信，一个王储的赌约，一场关于雨的梦。',
      next:'n2' },
    n2:{ sp:null,
      en:'Rosecourt remembers more than you do. But it is beginning, carefully, to make room.',
      cn:'Rosecourt记得的比你多。但它已经开始，小心翼翼地，为你腾出位置。',
      next:'n3' },
    n3:{ sp:null,
      en:'The white roses have not finished blooming.',
      cn:'白玫瑰，还没有开完。',
      end:true },
  }
};

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

SCENES.d8_family = {bg:'garden',loc:'garden',start:'n1',nodes:{
  n1:{sp:'elise',sprite:'elise',en:'The Duke pretends he does not pace when you are late to breakfast. I pretend not to notice. We are both excellent actors.',cn:'公爵大人假装你早餐迟到时他不会来回踱步。我假装没看见。我们两个演技都很好。',next:'n2'},
  n2:{sp:null,en:'You walk the rose paths with her while gardeners work around you as if this has always been ordinary.',cn:'你和她沿着玫瑰小径慢慢走。园丁们在四周忙碌，仿佛这一切本来就很寻常。',fx:[['route','family',2],['estate','staff_trust',1]],end:true}
}};

SCENES.d8_group = {bg:'garden',loc:'garden',start:'n1',nodes:{
  n1:{sp:null,sprite:'none',en:'By dinner, a simple invitation has somehow become six chairs around a small garden table.',cn:'到了晚餐，一句随口的邀请莫名其妙变成了花园小桌旁的六把椅子。',next:'n2'},
  n2:{sp:'roderic',sprite:'roderic',en:'I was told this was informal. Why is the prince here?',cn:'我听说这是非正式晚餐。那王储为什么会在这里？',next:'n3'},
  n3:{sp:'damien',sprite:'damien',en:'Because I was told it was informal.',cn:'因为我也听说这是非正式晚餐。',next:'n4'},
  n4:{sp:'elise',sprite:'elise',en:'Wonderful. Then no one is allowed to discuss state business until dessert.',cn:'太好了。那甜点之前，谁都不许谈国事。',fx:[['route','ensemble',3],['rel','roderic','warmth',1],['rel','damien','personal_trust',1],['rel','alaric','trust',1]],end:true}
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

SCENES.d10_market = {bg:'market',loc:'market',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'At Rosemarket, Elise knows the pastry seller, two seamstresses, a bookseller, and apparently half the city.',cn:'在玫瑰市集，Elise认识点心铺老板、两位裁缝、一个书商，以及——看起来——半座王城。',next:'n2'},
 n2:{sp:'elise',sprite:'elise',en:'Servants have social networks. Nobles call them gossip because it hurts less.',cn:'仆从有自己的消息网。贵族把它叫八卦，听起来比较不刺耳。',fx:[['route','family',2],['route','ensemble',1],['estate','staff_trust',1]],end:true}
}};
SCENES.d10_academy = {bg:'academy',loc:'academy',start:'n1',nodes:{
 n1:{sp:'alaric',sprite:'alaric',en:'You found the academy without being kidnapped by a student society. Promising.',cn:'你居然没被学生社团拐走就找到学院了。很有前途。',next:'n2'},
 n2:{sp:null,en:'He shows you the public archive, then a locked door he pointedly does not open.',cn:'他带你看了公共档案室，又带你经过一扇他刻意没有打开的锁门。',fx:[['route','alaric',2],['rel','alaric','trust',1],['flag','academy_seen',true]],end:true}
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
SCENES.d12_group_city = {bg:'market',loc:'market',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'A planned lunch becomes a small expedition: market bread, academy gossip, Roderic arguing with a street musician, Damien pretending not to know the musician.',cn:'原本计划好的午餐变成了小型远征：市集面包、学院八卦、Roderic和街头乐师吵起来，以及Damien假装自己不认识那个乐师。',next:'n2'},
 n2:{sp:'alaric',sprite:'alaric',en:'I am recording this as evidence that group decision-making is structurally unsound.',cn:'我要把今天记录成证据：群体决策在结构上就是不可靠的。',fx:[['route','ensemble',3],['rel','alaric','trust',1],['rel','roderic','warmth',1],['rel','damien','personal_trust',1]],end:true}
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
SCENES.d15_family_out = {bg:'estate_village',loc:'estate_village',start:'n1',nodes:{n1:{sp:'elise',sprite:'elise',en:'These are Rosier tenants, not scenery. Some remember you as a child. Some remember your mother better.',cn:'这些是Rosier的领民，不是风景。有些人记得你小时候，有些人更记得你的母亲。',next:'n2'},n2:{sp:null,en:'A baker sends out a tray without asking payment. Elise quietly pays anyway.',cn:'面包师没收钱就送来一盘点心。Elise还是悄悄把钱留下了。',fx:[['route','family',2],['estate','welfare',1],['estate','staff_trust',1]],end:true}}};
SCENES.d15_group_out = {bg:'riverside',loc:'riverside',start:'n1',nodes:{n1:{sp:null,sprite:'none',en:'Someone suggests a picnic. No one agrees who. This is how six people end up by the river with too much bread and no knife.',cn:'有人提议野餐。没人承认是谁提的。于是六个人带着过量的面包、却没带刀，坐到了河边。',next:'n2'},n2:{sp:'damien',sprite:'damien',en:'I am crown prince of a realm that apparently cannot organize cheese.',cn:'我是一个连奶酪都组织不好的国家的王储。',fx:[['route','ensemble',3],['rel','damien','personal_trust',1],['rel','roderic','warmth',1]],end:true}}};

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
SCENES.d17_group_problem = {bg:'riverside',loc:'riverside',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'A broken cart wheel becomes a committee meeting by accident.',cn:'一只坏掉的马车轮，意外变成了一场委员会会议。',next:'n2'},
 n2:{sp:'roderic',sprite:'roderic',en:'We could simply fix it.',cn:'我们也可以直接修。',next:'n3'},
 n3:{sp:'alaric',sprite:'alaric',en:'I was establishing why it failed.',cn:'我在确认它为什么坏。',next:'n4'},
 n4:{sp:'damien',sprite:'damien',en:'And I was establishing who owns it.',cn:'而我在确认它归谁。',next:'n5'},
 n5:{sp:'elise',sprite:'elise',en:'Wonderful. Roderic, fix it. Alaric, explain it. Your Highness, find the owner. I will find lunch.',cn:'很好。Roderic修。Alaric解释。殿下找车主。我去找午饭。',fx:[['route','ensemble',4],['estate','stability',1]],end:true}
}};

SCENES.d18_free_map = {bg:'title_manor',loc:'sitting_room',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'By the eighteenth day, invitations arrive from three directions before noon.',cn:'到了第十八天，中午之前，邀请已经从三个方向一起涌来。',next:'n2'},
 n2:{sp:null,en:'For the first time, choosing where to go feels less like recovery and more like a life taking shape.',cn:'第一次，“去哪里”不再只是康复安排，而像是在给一种生活定形。',fx:[['flag','three_zone_choice_seen',true]],end:true}
}};
SCENES.d18_alaric = {bg:'academy',loc:'academy',start:'n1',nodes:{n1:{sp:'alaric',sprite:'alaric',en:'I saved the incomprehensible paper for you.',cn:'我特意把最难懂的论文留给你了。',next:'n2'},n2:{sp:null,en:'This is, somehow, a compliment.',cn:'不知怎么，这居然算一句夸奖。',fx:[['route','alaric',3],['rel','alaric','intimacy',1]],end:true}}};
SCENES.d18_roderic = {bg:'old_road',loc:'old_road',start:'n1',nodes:{n1:{sp:'roderic',sprite:'roderic',en:'You are getting less terrible at this road.',cn:'你越来越不擅长在这条路上犯错了。',next:'n2'},n2:{sp:null,en:'He says it like an accusation and slows his horse to match yours anyway.',cn:'他说得像在指控你，马速却还是慢下来和你并肩。',fx:[['route','roderic',3],['rel','roderic','warmth',1]],end:true}}};
SCENES.d18_damien = {bg:'conservatory',loc:'conservatory',start:'n1',nodes:{n1:{sp:'damien',sprite:'damien',en:'This is not an official invitation.',cn:'这不是正式邀请。',next:'n2'},n2:{sp:null,en:'The fact that he says it before greeting you makes it more significant than if he had not.',cn:'他甚至在问候之前就先说了这句，于是它反而比没说更重要。',fx:[['route','damien',3],['rel','damien','vulnerability',1]],end:true}}};
SCENES.d18_family = {bg:'sitting_room',loc:'duke_study',start:'n1',nodes:{n1:{sp:'lucien',sprite:'lucien',en:'I have moved one recurring report to your desk. You may move it back if you hate it.',cn:'我把一份固定报告移到你桌上了。你若讨厌，可以原样退回来。',next:'n2'},n2:{sp:'elise',sprite:'elise',en:'He has already told the clerk to bring it to your room every Tuesday.',cn:'他已经吩咐书记员每周二送到你房间了。',fx:[['route','family',3],['estate','staff_trust',1]],end:true}}};
SCENES.d18_group = {bg:'market',loc:'market',start:'n1',nodes:{n1:{sp:null,sprite:'none',en:'You choose the city and invite everyone. It should be impossible. Somehow, five schedules bend.',cn:'你选择进城，还顺手邀请了所有人。按理说根本凑不齐。可五份日程居然真的一起弯了。',next:'n2'},n2:{sp:'damien',sprite:'damien',en:'I moved a council briefing for this.',cn:'我为了这个挪了一场议事会。',next:'n3'},n3:{sp:'roderic',sprite:'roderic',en:'That is either touching or terrible governance.',cn:'这要么很感人，要么是很糟的治理。',fx:[['route','ensemble',4]],end:true}}};

SCENES.d19_identity_echo = {bg:'bedroom',loc:'bedroom',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'You wake knowing, with impossible certainty, that the east window sticks in damp weather.',cn:'你醒来时无比确定：东边那扇窗一到潮湿天气就会卡住。',next:'n2'},
 n2:{sp:null,en:'It does. Elise looks at the latch, then at you.',cn:'它真的卡住了。Elise看看窗闩，又看看你。',next:'c1'},
 c1:{choice:{promptEn:'What do you make of it?',promptCn:'你怎么理解这件事？',options:[
  {en:'Maybe I really am Nait, and memory is returning sideways.',cn:'也许我本来就是Nait，只是记忆从别的方向回来。',fx:[['flag','identity_continuity_hint',true]],goto:'e'},
  {en:'Maybe this body remembers things I do not.',cn:'也许只是这具身体记得，而我不记得。',fx:[['flag','identity_transference_hint',true]],goto:'e'},
  {en:'Either way, I know how to open the window now.',cn:'不管是哪种解释，至少我现在知道怎么开这扇窗。',fx:[['flag','identity_self_defined',true]],goto:'e'}]}},
 e:{sp:'elise',sprite:'elise',en:'That may be the most sensible thing anyone has said about your memory so far.',cn:'这大概是到目前为止，关于你记忆这件事最实际的一句话。',end:true}
}};

SCENES.d20_field_anomaly = {bg:'riverside',loc:'riverside',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'At the river, the strange pressure returns — not in the air this time, but under the water.',cn:'在河边，那种奇怪的压迫感又出现了。这一次不在空气里，而在水下。',next:'n2'},
 n2:{sp:'alaric',sprite:'alaric',en:'Do not touch it.',cn:'别碰。',next:'n3'},
 n3:{sp:'roderic',sprite:'roderic',en:'For once, I agree with the wizard before he explains himself.',cn:'难得一次，我在法师解释之前就赞同他。',next:'n4'},
 n4:{sp:'damien',sprite:'damien',en:'And for once, I am pleased all of us are here.',cn:'也难得一次，我很庆幸大家都在。',next:'n5'},
 n5:{sp:null,en:'The anomaly has left Rosecourt. Or perhaps Rosecourt was never its boundary.',cn:'异象已经离开了Rosecourt。或者说，Rosecourt从来不是它的边界。',fx:[['route','ensemble',2],['flag','anomaly_network_confirmed',true]],end:true}
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

SCENES.d8_group = {bg:'garden',loc:'garden',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'By dinner, a simple invitation has somehow become six chairs around a small garden table.',cn:'到了晚餐，一句随口的邀请莫名其妙变成了花园小桌旁的六把椅子。',next:'n2'},
 n2:{sp:'roderic',sprite:'roderic',en:'I was told this was informal. Why is the prince here?',cn:'我听说这是非正式晚餐。那王储为什么会在这里？',next:'n3'},
 n3:{sp:'damien',sprite:'damien',en:'Because I was also told it was informal.',cn:'因为我也听说这是非正式晚餐。',next:'c1'},
 c1:{choice:{promptEn:'Everyone looks at you, including Alaric, who is pretending not to.',promptCn:'所有人都看向你，包括那个假装没看的Alaric。',options:[
  {en:'“No titles until dessert.”',cn:'“甜点之前不许叫头衔。”',fx:[['route','ensemble',2],['rel','damien','personal_trust',1]],goto:'r1'},
  {en:'“I wanted to see whether all of you can survive one dinner together.”',cn:'“我只是想看看你们能不能一起活过一顿晚餐。”',fx:[['route','ensemble',2],['rel','roderic','warmth',1]],goto:'r2'}]}},
 r1:{sp:'damien',en:'Dangerous precedent.',cn:'这是个危险的先例。',next:'n4'},
 r2:{sp:'alaric',sprite:'alaric',en:'An uncontrolled experiment. I object to the methodology.',cn:'无控制变量实验。我反对这种方法。',next:'n4'},
 n4:{sp:'elise',sprite:'elise',en:'Wonderful. Then state business, magic catastrophes, and old grudges are all banned until dessert.',cn:'很好。那甜点之前，国事、魔法灾难和陈年旧怨全部禁止。',next:'c2'},
 c2:{choice:{promptEn:'Dessert arrives. The ban technically expires.',promptCn:'甜点来了。禁令从技术上来说已经失效。',options:[
  {en:'Ask everyone for one harmless thing they actually enjoy.',cn:'让每个人说一件真正喜欢、而且不会引发争吵的小事。',fx:[['route','ensemble',2],['rel','alaric','trust',1],['rel','roderic','warmth',1]],goto:'e1'},
  {en:'Ask who knew the old Nait best — and immediately regret it.',cn:'问谁最了解从前的Nait——然后立刻后悔。',fx:[['route','ensemble',1],['flag','group_old_nait_views',true]],goto:'e2'}]}},
 e1:{sp:null,en:'The answers are unexpectedly ordinary. Tea. Horses. Winter oranges. Old maps. Elise looks pleased with the experiment.',cn:'答案意外地普通。茶、马、冬天的橙子、旧地图。Elise看起来对这场实验很满意。',end:true},
 e2:{sp:'roderic',en:'That depends. Do you mean “best” as in fondly, accurately, or with the most embarrassing evidence?',cn:'那得看你说的“了解”是哪种。最喜欢、最准确，还是手里掌握的黑历史最多？',end:true}
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

SCENES.d10_academy = {bg:'academy',loc:'academy',start:'n1',nodes:{
 n1:{sp:'alaric',sprite:'alaric',en:'You found the academy without being kidnapped by a student society. Promising.',cn:'你居然没被学生社团拐走就找到学院了。很有前途。',next:'c1'},
 c1:{choice:{promptEn:'He offers you the public archive or the observation gallery first.',promptCn:'他问你想先看公共档案室，还是观测廊。',options:[
  {en:'Public archive. Start with records.',cn:'先去公共档案室。从记录开始。',fx:[['route','alaric',2],['rel','alaric','curiosity',1]],goto:'r1'},
  {en:'Observation gallery. Start with how magic is measured.',cn:'先去观测廊。从魔法是怎么被测量的开始。',fx:[['route','alaric',2],['rel','alaric','respect',1]],goto:'r2'}]}},
 r1:{sp:'alaric',en:'Predictable. I mean that as praise.',cn:'很好猜。我这句话是夸奖。',next:'n2'},
 r2:{sp:'alaric',en:'Good. Numbers without instruments are merely decorative certainty.',cn:'很好。没有仪器支撑的数字，只是装饰性的确定感。',next:'n2'},
 n2:{sp:null,en:'On the way, he passes a locked black door and very deliberately does not explain it.',cn:'路上，他经过一扇上锁的黑门，而且非常刻意地没有解释。',next:'c2'},
 c2:{choice:{promptEn:'The omission is almost an invitation.',promptCn:'这种刻意不解释，几乎像一种邀请。',options:[
  {en:'Ask what is behind the door.',cn:'直接问门后是什么。',fx:[['route','alaric',1],['rel','alaric','trust',1]],goto:'e1'},
  {en:'Say nothing, but remember the door.',cn:'什么都不问，但记住这扇门。',fx:[['route','alaric',1],['flag','academy_locked_door_noticed',true]],goto:'e2'}]}},
 e1:{sp:'alaric',en:'Restricted archive. And no, that was not permission. Yet.',cn:'限制档案室。以及，不，那不是许可。至少现在不是。',fx:[['flag','academy_seen',true]],end:true},
 e2:{sp:'alaric',en:'You are learning restraint. I had not prepared for this development.',cn:'你居然开始学会克制了。我没为这个发展做好准备。',fx:[['flag','academy_seen',true]],end:true}
}};

SCENES.d15_family_out = {bg:'estate_village',loc:'estate_village',start:'n1',nodes:{
 n1:{sp:'elise',sprite:'elise',en:'Reports call this “the western tenant cluster.” People who live here call it home.',cn:'报告里把这里叫“西部佃户聚落”。住在这里的人叫它家。',next:'c1'},
 c1:{choice:{promptEn:'A village steward begins giving you the polished version of everything.',promptCn:'村务管事开始向你汇报一个过分漂亮的版本。',options:[
  {en:'Let him finish before asking questions.',cn:'先让他完整讲完，再提问。',fx:[['route','family',1],['estate','staff_trust',1]],goto:'r1'},
  {en:'Ask to hear from someone who uses the bridge every day.',cn:'直接问能不能听听每天过桥的人怎么说。',fx:[['route','family',2],['estate','welfare',1]],goto:'r2'}]}},
 r1:{sp:'elise',en:'Good. Now you know what he wanted you to know. Next we find out what he forgot.',cn:'很好。现在你知道他希望你知道什么了。接下来去看看他忘了什么。',next:'c2'},
 r2:{sp:'elise',en:'Excellent. His expression just taught you something too.',cn:'很好。他刚才那个表情本身也提供了信息。',next:'c2'},
 c2:{choice:{promptEn:'A woman mentions winter flooding almost as an afterthought.',promptCn:'一位妇人顺口提到冬季涨水。',options:[
  {en:'Ask her to show you where the water reaches.',cn:'请她带你看水位最高会到哪里。',fx:[['route','family',2],['estate','welfare',1],['flag','bridge_flood_risk_seen',true]],goto:'e1'},
  {en:'Ask why the report did not mention flooding.',cn:'问为什么报告里没有写涨水。',fx:[['route','family',1],['estate','staff_trust',1]],goto:'e2'}]}},
 e1:{sp:'elise',en:'This is why boots are part of governance.',cn:'这就是为什么治理领地需要一双好靴子。',end:true},
 e2:{sp:'elise',en:'Because paper stays dry. People do not.',cn:'因为纸总是干的。人不是。',end:true}
}};

SCENES.d17_group_problem = {bg:'riverside',loc:'riverside',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'A broken cart wheel becomes a committee meeting by accident.',cn:'一只坏掉的马车轮，意外变成了一场委员会会议。',next:'n2'},
 n2:{sp:'roderic',sprite:'roderic',en:'We could simply fix it.',cn:'我们也可以直接修。',next:'n3'},
 n3:{sp:'alaric',sprite:'alaric',en:'I was establishing why it failed.',cn:'我在确认它为什么坏。',next:'n4'},
 n4:{sp:'damien',sprite:'damien',en:'And I was establishing who owns it.',cn:'而我在确认它归谁。',next:'c1'},
 c1:{choice:{promptEn:'The owner is watching this with increasing alarm.',promptCn:'车主正越来越惊恐地看着这一幕。',options:[
  {en:'Put Roderic in charge of the wheel and Alaric in charge of the cause.',cn:'让Roderic负责修轮子，Alaric负责查原因。',fx:[['route','ensemble',2],['estate','stability',1]],goto:'r1'},
  {en:'Ask Damien to stop making the poor owner feel audited.',cn:'请Damien先别让可怜的车主觉得自己正在被审计。',fx:[['route','ensemble',2],['rel','damien','personal_trust',1]],goto:'r2'}]}},
 r1:{sp:'roderic',en:'Finally. Government by common sense.',cn:'终于。常识治理。',next:'n5'},
 r2:{sp:'damien',en:'I was being reassuring.',cn:'我刚才是在让他安心。',next:'n5'},
 n5:{sp:'elise',sprite:'elise',en:'Wonderful. I will find lunch before any of you create a ministry.',cn:'很好。我去找午饭，趁你们还没为这只轮子成立一个部门。',next:'c2'},
 c2:{choice:{promptEn:'When the wheel is fixed, there is still half an afternoon left.',promptCn:'轮子修好后，下午还剩一半。',options:[
  {en:'Keep everyone together and walk to the river.',cn:'干脆大家一起走去河边。',fx:[['route','ensemble',2],['rel','roderic','warmth',1],['rel','alaric','trust',1]],goto:'e1'},
  {en:'Ask the owner what usually breaks on this road.',cn:'问车主这条路上平时最容易坏什么。',fx:[['route','ensemble',1],['estate','stability',1],['flag','road_user_feedback',true]],goto:'e2'}]}},
 e1:{sp:null,en:'The argument moves to lunch, then to weather, then somehow to whether court uniforms are intentionally uncomfortable.',cn:'争论从午饭一路转到天气，最后莫名其妙变成了宫廷制服是不是故意设计得这么难受。',end:true},
 e2:{sp:'damien',en:'There. A better report than half the ones sent to the capital.',cn:'看。比送到王都的一半报告都更有用。',end:true}
}};

SCENES.d18_alaric = {bg:'academy',loc:'academy',start:'n1',nodes:{
 n1:{sp:'alaric',sprite:'alaric',en:'I saved the incomprehensible paper for you.',cn:'我特意把最难懂的论文留给你了。',next:'c1'},
 c1:{choice:{promptEn:'There are two chairs. One is already pulled out beside his.',promptCn:'桌边有两把椅子，其中一把已经被拉到他旁边。',options:[
  {en:'Sit beside him and ask where the paper goes wrong.',cn:'坐到他旁边，问这篇论文到底错在哪。',fx:[['route','alaric',2],['rel','alaric','intimacy',1]],goto:'r1'},
  {en:'Tell him he only invited you here to complain professionally.',cn:'说他叫自己来只是为了专业地抱怨论文。',fx:[['route','alaric',2],['rel','alaric','warmth',1]],goto:'r2'}]}},
 r1:{sp:'alaric',en:'Page twelve. But I wanted to see whether you would find page seven first.',cn:'第十二页。但我想看看你会不会先发现第七页。',next:'c2'},
 r2:{sp:'alaric',en:'Incorrect. I can complain professionally without assistance.',cn:'错误。我不需要协助也可以专业地抱怨。',next:'c2'},
 c2:{choice:{promptEn:'An hour later, the margin is full of notes.',promptCn:'一小时后，页边已经写满了批注。',options:[
  {en:'Ask why he keeps bringing unfinished questions to you.',cn:'问他为什么总把还没想完的问题带来找自己。',fx:[['route','alaric',2],['rel','alaric','trust',1]],goto:'e1'},
  {en:'Point out that this has started to feel like a routine.',cn:'指出这件事已经快变成固定日常了。',fx:[['route','alaric',2],['rel','alaric','intimacy',1]],goto:'e2'}]}},
 e1:{sp:'alaric',en:'Because you ask different questions than I do. It is useful.',cn:'因为你会问和我不一样的问题。很有用。',end:true},
 e2:{sp:'alaric',en:'...Yes. I had noticed.',cn:'……是。我注意到了。',end:true}
}};

SCENES.d18_roderic = {bg:'old_road',loc:'old_road',start:'n1',nodes:{
 n1:{sp:'roderic',sprite:'roderic',en:'You are getting less terrible at this road.',cn:'你越来越不擅长在这条路上犯错了。',next:'c1'},
 c1:{choice:{promptEn:'He slows his horse to match yours.',promptCn:'他把马速慢下来，和你并肩。',options:[
  {en:'“That almost sounded like praise.”',cn:'“这听起来几乎像夸奖了。”',fx:[['route','roderic',2],['rel','roderic','warmth',1]],goto:'r1'},
  {en:'Challenge him to race to the old milestone.',cn:'挑战他赛到前面的旧里程碑。',fx:[['route','roderic',2],['rel','roderic','rivalry',1]],goto:'r2'}]}},
 r1:{sp:'roderic',en:'Do not get greedy.',cn:'别得寸进尺。',next:'c2'},
 r2:{sp:'roderic',en:'There you are. I was worried recovery had made you sensible.',cn:'这才对。我还担心康复把你变得太理智了。',next:'c2'},
 c2:{choice:{promptEn:'At the milestone, he looks toward the estate road instead of turning back.',promptCn:'到了里程碑，他没有立刻掉头，而是看向领地方向。',options:[
  {en:'Ask what he thinks Rosier actually needs from its heir.',cn:'问他觉得Rosier真正需要继承人做什么。',fx:[['route','roderic',2],['rel','roderic','trust',1],['estate','stability',1]],goto:'e1'},
  {en:'Ask what he expects from you personally.',cn:'问他个人对自己有什么期待。',fx:[['route','roderic',2],['rel','roderic','intimacy',1]],goto:'e2'}]}},
 e1:{sp:'roderic',en:'Show up. See things yourself. And stop letting polished reports do all your riding for you.',cn:'亲自出现。亲眼去看。还有，别让漂亮报告替你走完所有路。',end:true},
 e2:{sp:'roderic',en:'At the moment? Keep surprising me. It is annoyingly effective.',cn:'现在？继续让我意外吧。烦人，但挺有效。',end:true}
}};

SCENES.d18_damien = {bg:'conservatory',loc:'conservatory',start:'n1',nodes:{
 n1:{sp:'damien',sprite:'damien',en:'This is not an official invitation.',cn:'这不是正式邀请。',next:'c1'},
 c1:{choice:{promptEn:'He says it before greeting you.',promptCn:'他甚至在问候之前就先说了这句话。',options:[
  {en:'“Then what is it?”',cn:'“那它是什么？”',fx:[['route','damien',2],['rel','damien','vulnerability',1]],goto:'r1'},
  {en:'“Should I be worried you had to clarify?”',cn:'“你还需要特意澄清，我是不是该担心？”',fx:[['route','damien',2],['rel','damien','personal_trust',1]],goto:'r2'}]}},
 r1:{sp:'damien',en:'Tea. Conversation. Two people who are temporarily not performing their offices.',cn:'喝茶。聊天。两个暂时不用扮演自己职务的人。',next:'c2'},
 r2:{sp:'damien',en:'Probably. I have become suspiciously attached to distinctions lately.',cn:'大概吧。我最近对这种区别变得可疑地执着。',next:'c2'},
 c2:{choice:{promptEn:'Rain taps softly against the conservatory glass.',promptCn:'雨轻轻敲着温室的玻璃。',options:[
  {en:'Ask what Damien would do if he were not crown prince for one day.',cn:'问Damien，如果有一天不用做王储，他会做什么。',fx:[['route','damien',2],['rel','damien','vulnerability',1]],goto:'e1'},
  {en:'Tell him he can ask you something he would never ask in court.',cn:'告诉他，他可以问一个在宫廷里绝不会问的问题。',fx:[['route','damien',2],['rel','damien','personal_trust',1]],goto:'e2'}]}},
 e1:{sp:'damien',en:'Sleep until noon. Then disappear into a bookshop where no one recognizes me. A scandalous use of sovereignty.',cn:'睡到中午。然后躲进一家没人认得我的书店。对王权来说真是离经叛道的用法。',end:true},
 e2:{sp:'damien',en:'Do you miss the person you were, even when you do not remember them?',cn:'即使你不记得从前的自己……你会想念那个人吗？',end:true}
}};

SCENES.d18_family = {bg:'sitting_room',loc:'duke_study',start:'n1',nodes:{
 n1:{sp:'lucien',sprite:'lucien',en:'I have moved one recurring report to your desk. You may move it back if you hate it.',cn:'我把一份固定报告移到你桌上了。你若讨厌，可以原样退回来。',next:'c1'},
 c1:{choice:{promptEn:'Elise is standing behind him with the expression of someone who knows this is not true.',promptCn:'Elise站在他身后，表情明明白白写着：这话不可信。',options:[
  {en:'“You have already decided I am keeping it, haven’t you?”',cn:'“你已经决定让我继续看这份报告了，对吧？”',fx:[['route','family',2],['rel','lucien','trust',1]],goto:'r1'},
  {en:'Ask what Lucien looked for when he first started reading the same report.',cn:'问Lucien，他年轻时第一次看这份报告会先找什么。',fx:[['route','family',2],['estate','staff_trust',1]],goto:'r2'}]}},
 r1:{sp:'elise',sprite:'elise',en:'He told the clerk to deliver it every Tuesday three days ago.',cn:'他三天前就吩咐书记员每周二送来了。',next:'c2'},
 r2:{sp:'lucien',en:'What had changed from the previous month. Your grandfather taught me to distrust isolated numbers.',cn:'和上个月相比有什么变化。你祖父教我不要相信孤零零的数字。',next:'c2'},
 c2:{choice:{promptEn:'Lucien pushes the report toward you and waits.',promptCn:'Lucien把报告推到你面前，没有再开口。',options:[
  {en:'Ask him to stay while you read the first page.',cn:'请他留下，陪自己看完第一页。',fx:[['route','family',2],['rel','lucien','warmth',1]],goto:'e1'},
  {en:'Tell him you will bring him your questions at dinner.',cn:'告诉他，晚餐时再把自己的问题带给他。',fx:[['route','family',2],['rel','lucien','trust',1],['estate','staff_trust',1]],goto:'e2'}]}},
 e1:{sp:'lucien',en:'Of course.',cn:'当然。',end:true},
 e2:{sp:'lucien',en:'Good. Bring disagreements too.',cn:'很好。不同意见也一起带来。',end:true}
}};

SCENES.d18_group = {bg:'market',loc:'market',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'You choose the city and invite everyone. It should be impossible. Somehow, five schedules bend.',cn:'你选择进城，还顺手邀请了所有人。按理说根本凑不齐。可五份日程居然真的一起弯了。',next:'n2'},
 n2:{sp:'damien',sprite:'damien',en:'I moved a council briefing for this.',cn:'我为了这个挪了一场议事会。',next:'n3'},
 n3:{sp:'roderic',sprite:'roderic',en:'That is either touching or terrible governance.',cn:'这要么很感人，要么是很糟的治理。',next:'c1'},
 c1:{choice:{promptEn:'Alaric has already stopped at a bookstall.',promptCn:'Alaric已经在一家书摊前停下来了。',options:[
  {en:'Let everyone split up and regroup for lunch.',cn:'让大家先各逛各的，午饭再集合。',fx:[['route','ensemble',2],['rel','alaric','warmth',1]],goto:'r1'},
  {en:'Insist on staying together and see how long it lasts.',cn:'坚持大家一起走，看看能撑多久。',fx:[['route','ensemble',3],['rel','roderic','warmth',1]],goto:'r2'}]}},
 r1:{sp:'elise',sprite:'elise',en:'Sensibly managed. Suspiciously so.',cn:'管理得很合理。合理得让我怀疑。',next:'c2'},
 r2:{sp:'damien',en:'Seven minutes. A respectable result.',cn:'七分钟。已经是值得尊敬的成绩了。',next:'c2'},
 c2:{choice:{promptEn:'At lunch, there is one empty chair left at the table.',promptCn:'午饭时，桌边还剩最后一把空椅子。',options:[
  {en:'Leave it empty and order extra food for whoever wanders in.',cn:'空着吧，再多点一份，谁路过谁坐。',fx:[['route','ensemble',2],['estate','reputation',1]],goto:'e1'},
  {en:'Ask everyone where the group should go next time.',cn:'问大家下次集体出门想去哪儿。',fx:[['route','ensemble',2],['flag','group_future_plan',true]],goto:'e2'}]}},
 e1:{sp:null,en:'A junior academy clerk eventually takes the chair after three rounds of insisting he absolutely cannot.',cn:'最后，一位年轻学院书记员在推辞了三轮“绝对不行”之后坐下了。',end:true},
 e2:{sp:null,en:'The answers conflict immediately. Somehow that feels like a plan.',cn:'答案立刻互相冲突。不知为什么，这反而很像一个真正的计划。',end:true}
}};

SCENES.d20_field_anomaly = {bg:'riverside',loc:'riverside',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'At the river, the strange pressure returns — not in the air this time, but under the water.',cn:'在河边，那种奇怪的压迫感又出现了。这一次不在空气里，而在水下。',next:'n2'},
 n2:{sp:'alaric',sprite:'alaric',en:'Do not touch it.',cn:'别碰。',next:'c1'},
 c1:{choice:{promptEn:'The water is perfectly still around one dark patch of riverbed.',promptCn:'河床有一块暗色区域，周围的水静得不正常。',options:[
  {en:'Ask Alaric what he needs you to observe from a safe distance.',cn:'问Alaric，自己站在安全距离能帮他观察什么。',fx:[['route','alaric',1],['rel','alaric','trust',1]],goto:'r1'},
  {en:'Ask Roderic to get everyone farther back first.',cn:'先请Roderic把大家往后带一点。',fx:[['route','roderic',1],['estate','stability',1]],goto:'r2'},
  {en:'Ask Damien whether this area is on any royal survey map.',cn:'问Damien，这片区域是否出现在王室勘测记录里。',fx:[['route','damien',1],['estate','court_influence',1]],goto:'r3'}]}},
 r1:{sp:'alaric',en:'Watch the reeds. Not the water. If they move without wind, tell me immediately.',cn:'看芦苇，不要盯水。如果没风却动了，立刻告诉我。',next:'n3'},
 r2:{sp:'roderic',sprite:'roderic',en:'Finally, a magical investigation with sensible feet placement.',cn:'终于有一次魔法调查先考虑脚该站哪儿了。',next:'n3'},
 r3:{sp:'damien',sprite:'damien',en:'There is an old flood survey. I can have it at Rosecourt by morning.',cn:'有一份旧洪水勘测。我明早可以让它送到Rosecourt。',next:'n3'},
 n3:{sp:'roderic',sprite:'roderic',en:'For once, I agree with the wizard before he explains himself.',cn:'难得一次，我在法师解释之前就赞同他。',next:'n4'},
 n4:{sp:'damien',sprite:'damien',en:'And for once, I am pleased all of us are here.',cn:'也难得一次，我很庆幸大家都在。',next:'c2'},
 c2:{choice:{promptEn:'A faint ring appears beneath the surface, echoing the library chalk circle.',promptCn:'水面下浮出一圈极淡的轮廓，和图书室的白垩圆异常相似。',options:[
  {en:'Say the resemblance out loud so everyone hears it.',cn:'直接说出来，让所有人都知道它和图书室的圆很像。',fx:[['route','ensemble',2],['flag','anomaly_network_confirmed',true]],goto:'e1'},
  {en:'Ask Alaric whether the two sites could be connected.',cn:'问Alaric，两处异象有没有可能相连。',fx:[['route','alaric',1],['flag','anomaly_network_confirmed',true]],goto:'e2'}]}},
 e1:{sp:null,en:'No one dismisses the comparison. That is more frightening than disagreement would have been.',cn:'没有任何人反驳这个比较。比起争论，这反而更让人不安。',end:true},
 e2:{sp:'alaric',en:'I was hoping you would not ask that until I had a less unpleasant answer.',cn:'我本来希望你晚一点再问，至少等我有个没那么糟的答案。',end:true}
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

SCENES.d18_group = {bg:'market',loc:'market',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'You choose the city and invite everyone. It should be impossible. Somehow, five schedules bend.',cn:'你选择进城，还顺手邀请了所有人。按理说根本凑不齐。可五份日程居然真的一起弯了。',next:'n2'},
 n2:{sp:'damien',sprite:'damien',en:'I moved a council briefing for this.',cn:'我为了这个挪了一场议事会。',next:'n3'},
 n3:{sp:'roderic',sprite:'roderic',en:'That is either touching or terrible governance.',cn:'这要么很感人，要么是很糟的治理。',next:'c1'},
 c1:{choice:{promptEn:'Alaric has already stopped at a bookstall.',promptCn:'Alaric已经在一家书摊前停下来了。',options:[
  {en:'Let everyone split up and regroup for lunch.',cn:'让大家先各逛各的，午饭再集合。',fx:[['route','ensemble',1],['rel','alaric','warmth',1]],goto:'r1'},
  {en:'Insist on staying together and see how long it lasts.',cn:'坚持大家一起走，看看能撑多久。',fx:[['route','ensemble',1],['rel','roderic','warmth',1]],goto:'r2'}]}},
 r1:{sp:'elise',sprite:'elise',en:'Sensibly managed. Suspiciously so.',cn:'管理得很合理。合理得让我怀疑。',next:'c2'},
 r2:{sp:'damien',en:'Seven minutes. A respectable result.',cn:'七分钟。已经是值得尊敬的成绩了。',next:'c2'},
 c2:{choice:{promptEn:'At lunch, there is one empty chair left at the table.',promptCn:'午饭时，桌边还剩最后一把空椅子。',options:[
  {en:'Leave it empty and order extra food for whoever wanders in.',cn:'空着吧，再多点一份，谁路过谁坐。',fx:[['route','ensemble',1],['estate','reputation',1]],goto:'r3'},
  {en:'Ask everyone where the group should go next time.',cn:'问大家下次集体出门想去哪儿。',fx:[['route','ensemble',1],['flag','group_future_plan',true]],goto:'r4'}]}},
 r3:{sp:null,en:'A junior academy clerk eventually takes the chair after three rounds of insisting he absolutely cannot.',cn:'最后，一位年轻学院书记员在推辞了三轮“绝对不行”之后坐下了。',next:'c3'},
 r4:{sp:null,en:'The answers conflict immediately. Somehow that feels like a plan.',cn:'答案立刻互相冲突。不知为什么，这反而很像一个真正的计划。',next:'c3'},
 c3:{choice:{promptEn:'By late afternoon, everyone is tired enough to stop performing.',promptCn:'到了傍晚，所有人都累到懒得再维持体面。',options:[
  {en:'Suggest making one day like this a monthly habit.',cn:'提议以后每个月都找一天这样聚一次。',fx:[['route','ensemble',2],['flag','monthly_group_day',true]],goto:'e1'},
  {en:'Ask everyone for one place they would never normally invite the others.',cn:'让每个人说一个平时绝不会邀请其他人去的地方。',fx:[['route','ensemble',2],['flag','group_private_places',true]],goto:'e2'},
  {en:'Say nothing. Just notice how normal this is starting to feel.',cn:'什么也不说，只是意识到这一切正在变得很日常。',fx:[['route','ensemble',2],['rel','damien','personal_trust',1],['rel','roderic','warmth',1],['rel','alaric','warmth',1]],goto:'e3'}]}},
 e1:{sp:'roderic',en:'Monthly? Fine. But next time the prince is carrying something.',cn:'每个月？行。但下次王储必须负责拿东西。',end:true},
 e2:{sp:'alaric',sprite:'alaric',en:'That is an appalling question. I already have three answers.',cn:'这是个糟糕的问题。我已经有三个答案了。',end:true},
 e3:{sp:'elise',sprite:'elise',en:'There. That expression. Keep it.',cn:'就是这个表情。留着吧。',end:true}
}};

SCENES.d20_field_anomaly = {bg:'riverside',loc:'riverside',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'At the river, the strange pressure returns — not in the air this time, but under the water.',cn:'在河边，那种奇怪的压迫感又出现了。这一次不在空气里，而在水下。',next:'n2'},
 n2:{sp:'alaric',sprite:'alaric',en:'Do not touch it.',cn:'别碰。',next:'c1'},
 c1:{choice:{promptEn:'The water is perfectly still around one dark patch of riverbed.',promptCn:'河床有一块暗色区域，周围的水静得不正常。',options:[
  {en:'Ask Alaric what he needs you to observe from a safe distance.',cn:'问Alaric，自己站在安全距离能帮他观察什么。',fx:[['route','alaric',1],['rel','alaric','trust',1]],goto:'r1'},
  {en:'Ask Roderic to get everyone farther back first.',cn:'先请Roderic把大家往后带一点。',fx:[['route','roderic',1],['estate','stability',1]],goto:'r2'},
  {en:'Ask Damien whether this area is on any royal survey map.',cn:'问Damien，这片区域是否出现在王室勘测记录里。',fx:[['route','damien',1],['estate','court_influence',1]],goto:'r3'}]}},
 r1:{sp:'alaric',en:'Watch the reeds. Not the water. If they move without wind, tell me immediately.',cn:'看芦苇，不要盯水。如果没风却动了，立刻告诉我。',next:'n3'},
 r2:{sp:'roderic',sprite:'roderic',en:'Finally, a magical investigation with sensible feet placement.',cn:'终于有一次魔法调查先考虑脚该站哪儿了。',next:'n3'},
 r3:{sp:'damien',sprite:'damien',en:'There is an old flood survey. I can have it at Rosecourt by morning.',cn:'有一份旧洪水勘测。我明早可以让它送到Rosecourt。',next:'n3'},
 n3:{sp:'roderic',sprite:'roderic',en:'For once, I agree with the wizard before he explains himself.',cn:'难得一次，我在法师解释之前就赞同他。',next:'n4'},
 n4:{sp:'damien',sprite:'damien',en:'And for once, I am pleased all of us are here.',cn:'也难得一次，我很庆幸大家都在。',next:'c2'},
 c2:{choice:{promptEn:'A faint ring appears beneath the surface, echoing the library chalk circle.',promptCn:'水面下浮出一圈极淡的轮廓，和图书室的白垩圆异常相似。',options:[
  {en:'Say the resemblance out loud so everyone hears it.',cn:'直接说出来，让所有人都知道它和图书室的圆很像。',fx:[['route','ensemble',1],['flag','anomaly_network_confirmed',true]],goto:'r4'},
  {en:'Ask Alaric whether the two sites could be connected.',cn:'问Alaric，两处异象有没有可能相连。',fx:[['route','alaric',1],['flag','anomaly_network_confirmed',true]],goto:'r5'},
  {en:'Ask who else knew about the old flood survey.',cn:'追问还有谁知道那份旧洪水勘测。',fx:[['route','damien',1],['flag','survey_chain_questioned',true]],goto:'r6'}]}},
 r4:{sp:null,en:'No one dismisses the comparison. That is more frightening than disagreement would have been.',cn:'没有任何人反驳这个比较。比起争论，这反而更让人不安。',next:'c3'},
 r5:{sp:'alaric',en:'I was hoping you would not ask that until I had a less unpleasant answer.',cn:'我本来希望你晚一点再问，至少等我有个没那么糟的答案。',next:'c3'},
 r6:{sp:'damien',en:'My father\'s survey office. Lucien\'s predecessor. And, apparently, someone who ordered one page sealed.',cn:'我父王的勘测署、Lucien的前任——以及，显然，还有一个下令封存其中一页的人。',next:'c3'},
 c3:{choice:{promptEn:'The ring fades. The question does not.',promptCn:'水下的圆消失了。问题没有。',options:[
  {en:'Agree that all evidence should be shared between everyone from now on.',cn:'提议从现在开始，所有相关证据都在大家之间共享。',fx:[['route','ensemble',2],['flag','shared_investigation_protocol',true]],goto:'e1'},
  {en:'Ask Alaric to lead the magical side, but keep estate records with you and Lucien.',cn:'让Alaric负责魔法部分，领地记录则由自己和Lucien掌握。',fx:[['route','alaric',1],['route','family',1],['responsibility','high',1]],goto:'e2'},
  {en:'Say you want to see the sealed survey page before deciding what this means.',cn:'表示在判断这一切意味着什么之前，自己要先看到那张被封存的勘测页。',fx:[['identity','self_defined',1],['flag','sealed_survey_goal',true]],goto:'e3'}]}},
 e1:{sp:'damien',en:'Agreed. No private kingdoms of information.',cn:'同意。谁都别建立自己的情报小王国。',end:true},
 e2:{sp:'alaric',en:'Acceptable. Provided the records are copied, not summarized.',cn:'可以。前提是给我副本，不要只给摘要。',end:true},
 e3:{sp:'roderic',sprite:'roderic',en:'Good. An answer that involves actually looking at the thing. I approve.',cn:'很好。终于是一个先去看证据再说的答案。我赞成。',end:true}
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
 n1:{sp:'elise',sprite:'elise',en:'Elise helps you choose clothes for the first time since your recovery. She watches carefully, as if learning a new habit.',cn:'Elise第一次在你恢复后帮你挑选衣服。她小心地观察着，像是在重新学习一个习惯。',next:'n2'},
 n2:{sp:'nait',en:'She still calls you by the same title. The name feels familiar. The person behind it does not.',cn:'她依然用那个称呼叫你。名字很熟悉，名字背后的人却并不熟悉。',next:'c1'},
 c1:{choice:{promptEn:'How do you respond?',promptCn:'你如何回应？',options:[
  {en:'Ask if she thinks you have changed.',cn:'问她，你是不是变了。',fx:[['rel','elise','trust',1],['flag','identity_doubt',true]],fb:{en:'Elise answers honestly: Yes. But she does not say that as an accusation.',cn:'Elise诚实地回答：是。但她并没有把这当成责备。'},next:'n3'},
  {en:'Tell her you are still Rosier.',cn:'告诉她，你仍然是Rosier。',fx:[['rel','elise','trust',1],['flag','rosier_duty',true]],fb:{en:'Her expression softens. The name matters to her.',cn:'她的表情柔和下来。这个名字对她很重要。'},next:'n3'},
  {en:'Admit that you are afraid.',cn:'承认自己害怕。',fx:[['rel','elise','trust',2]],fb:{en:'Elise lowers her voice and promises she will stay.',cn:'Elise放低声音，答应会留下。'},next:'n3'}
 ]}},
 n3:{sp:'elise',en:'"Then I will get to know you again, {addr}.", Elise says.',cn:'“那么我会重新认识您，{addr}。”Elise说道。',end:true}
}};

SCENES.d4_roderic = {bg:'training',loc:'training',start:'n1',nodes:{
 n1:{sp:'roderic',sprite:'roderic',en:'Roderic looks at your stance. "Interesting. Your body remembers things your mind does not."',cn:'Roderic看着你的站姿。“有意思。你的身体记得一些你的脑子不记得的东西。”',next:'c1'},
 c1:{choice:{promptEn:'Your answer?',promptCn:'你的回答？',options:[
  {en:'Maybe the old Nait is still there.',cn:'也许过去的Nait还在。',fx:[['flag','memory_route',true]]},
  {en:'Maybe I am simply learning.',cn:'也许我只是在学习。',fx:[['flag','self_route',true]]}
 ]}}
}};

SCENES.d5_invitation = {bg:'bedroom',loc:'bedroom',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'A letter with the royal seal arrives before breakfast.',cn:'早餐前，一封带有王室印记的信送到了。',next:'n2'},
 n2:{sp:'elise',sprite:'elise',en:'"The Crown Prince wishes to meet you personally."',cn:'“王储殿下希望亲自见您。”',next:'c1'},
 c1:{choice:{promptEn:'What do you think?',promptCn:'你的想法？',options:[
 {en:'I want to know why he remembers me.',cn:'我想知道他为什么记得我。',fx:[['route','damien',1]]},
 {en:'I want to know what the old Nait did.',cn:'我想知道过去的Nait做过什么。',fx:[['flag','asked_past',true]]}
 ]}}
}};

SCENES.d5_damien = {bg:'palace',loc:'palace',start:'n1',nodes:{
 n1:{sp:'damien',sprite:'damien',en:'"You are quieter than I remember."',cn:'“你比我记忆里的安静。”',next:'c1'},
 c1:{choice:{promptEn:'Your answer?',promptCn:'你的回答？',options:[
 {en:'What was I like before?',cn:'以前的我是什么样？',fx:[['flag','identity_doubt',true]]},
 {en:'What do you think of me now?',cn:'那现在呢？你怎么看我？',fx:[['rel','damien','trust',1]]},
 {en:'Maybe you never knew me completely.',cn:'也许你从未真正了解过我。',fx:[['flag','self_route',true]]}
 ]}},
 n2:{sp:'damien',en:'"That answer sounds more like the Nait I knew."',cn:'“这个回答，反而更像我认识的Nait。”',end:true}
}};

SCENES.d6_reception = {bg:'palace',loc:'palace',start:'n1',nodes:{
 n1:{sp:'damien',sprite:'damien',en:'The court watches you return. Not the old Nait. Not yet. You.',cn:'宫廷看着你回来。不是过去的Nait。至少现在不是。是现在的你。',next:'n2'},
 n2:{sp:'alaric',sprite:'alaric',en:'"Everyone here has a version of you in their memory."',cn:'“这里每个人的记忆里，都有一个版本的你。”',next:'c1'},
 c1:{choice:{promptEn:'Your answer?',promptCn:'你的回答？',options:[
 {en:'Then I will create my own version.',cn:'那我会创造自己的版本。',fx:[['flag','self_route',true]]},
 {en:'Then I need to find the real one.',cn:'那我需要找到真正的那个。',fx:[['flag','memory_route',true]]}
 ]}}
}};

SCENES.d6_night = {bg:'bedroom',loc:'bedroom',start:'n1',nodes:{
 n1:{sp:'elise',sprite:'elise',en:'"Was today difficult?"',cn:'“今天很辛苦吗？”',next:'c1'},
 c1:{choice:{promptEn:'Before sleep...',promptCn:'睡前，你想说什么？',options:[
 {en:'I am glad you were there.',cn:'我很庆幸你在。',fx:[['rel','elise','trust',1]]},
 {en:'I still do not know who I am.',cn:'我仍然不知道自己是谁。',fx:[['flag','identity_doubt',true]]}
 ]}}
}};

SCENES.d7_garden = {bg:'garden',loc:'garden',start:'n1',nodes:{
 n1:{sp:'roderic',sprite:'roderic',en:'The white roses are blooming. Everyone sees the same flowers. Not everyone sees the same future.',cn:'白玫瑰开了。所有人看到同样的花，却不一定看到同样的未来。',next:'n2'},
 n2:{sp:'nait',en:'After a week, you finally feel that your choices are leaving traces.',cn:'一周之后，你终于感觉自己的选择正在留下痕迹。',next:'c1'},
 c1:{choice:{promptEn:'What do you accept?',promptCn:'你愿意接受什么？',options:[
 {en:'I am Nait Rosier.',cn:'我是Nait Rosier。',fx:[['flag','identity_acceptance',true],['flag','rosier_duty',true]]},
 {en:'I do not know yet.',cn:'我还不知道。',fx:[['flag','identity_doubt',true]]},
 {en:'I will decide who I become.',cn:'我要决定自己成为谁。',fx:[['flag','self_route',true]]}
 ]}}
}};

SCENES.d7_closing = {bg:'garden',loc:'garden',start:'n1',nodes:{
 n1:{sp:null,sprite:'none',en:'Week one ends. Rosecourt is no longer a completely unfamiliar place.',cn:'第一周结束。Rosecourt不再是一个完全陌生的地方。',end:true}
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
  { type:'schedule', day:2, period:'evening', titleCn:'黄昏时分，你想去哪里？', options:[
    { scene:'d2_library', loc:'library', hintEn:'Rain on tall windows.', hintCn:'雨敲着高窗，书桌的方向像有什么在等你。' },
    { scene:'d2_garden', loc:'garden', hintEn:'The roses are finally blooming.', hintCn:'Elise说，白玫瑰终于开了。' },
    { scene:'d2_rest', loc:'bedroom', hintEn:'Your body is still mending.', hintCn:'身体仍在痊愈，早些休息。' },
  ]},
  { type:'dayEnd' },
  { type:'scene', day:3, period:'morning', loc:'library', scene:'d3_alaric' },
  { type:'schedule', day:3, period:'afternoon', titleCn:'午后的庄园，你想去哪里？', options:[
    { scene:'d3_garden', loc:'garden', hintEn:'Elise is pruning roses — and stories.', hintCn:'Elise在修剪玫瑰——还有往事。' },
    { scene:'d3_training', loc:'training', hintEn:'Word arrived about a visitor tomorrow.', hintCn:'有消息传来：明天有位访客。' },
    { scene:'d3_rest', loc:'bedroom', hintEn:'Let the rain read to you.', hintCn:'让雨声替你读这个下午。' },
  ]},
  { type:'dayEnd' },
  { type:'scene', day:4, period:'morning', loc:'bedroom', scene:'d4_breakfast' },
  { type:'scene', day:4, period:'afternoon', loc:'training', scene:'d4_roderic' },
  { type:'schedule', day:4, period:'evening', titleCn:'暮色四合，你想去哪里？', options:[
    { scene:'d4_library', loc:'library', hintEn:'Someone left something by the chalk circle.', hintCn:'白垩圆圈旁，似乎有人留下了什么。' },
    { scene:'d4_garden', loc:'garden', hintEn:'A bench, the dusk, and an unhurried figure.', hintCn:'长椅、暮色，和一个不赶时间的身影。' },
    { scene:'d4_rest', loc:'bedroom', hintEn:'Your arm aches from a parry you never learned.', hintCn:'手臂因为一记你从未学过的格挡而酸着。' },
  ]},
  { type:'dayEnd' },
  { type:'scene', day:5, period:'morning', loc:'bedroom', scene:'d5_invitation' },
  { type:'scene', day:5, period:'afternoon', loc:'palace', scene:'d5_damien' },
  { type:'dayEnd' },
  { type:'scene', day:6, period:'evening', loc:'palace', scene:'d6_reception' },
  { type:'scene', day:6, period:'night', loc:'bedroom', scene:'d6_night' },
  { type:'dayEnd' },
  { type:'scene', day:7, period:'morning', loc:'garden', scene:'d7_garden' },
  { type:'scene', day:7, period:'afternoon', loc:'garden', scene:'d7_closing' },
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
