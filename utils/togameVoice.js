/**
 * 咎儿助手 · 语气与旁白
 *
 * 气质致敬《刀语》咎儿，文案为产品原创。
 * 公开人设参考（非原句）：奇策士、自称「本官」、傲气、爱算计、
 * 短句刺穿 + 戏剧化长篇研判；坦诚不粉饰，不替人扛后果。
 *
 * 避开：软萌客服、说明书腔、随机转盘玩笑感；
 * 不搬运动画 / 轻小说 / 漫画原台词或标志性口头禅。
 */

var DAILY_LINES = [
  '纠结拖着不走时，把路摆到本官面前。',
  '同一组路、同一粒种子，定论不会朝令夕改。',
  '计策只留在这台手机上——幕后布局，不必张扬。',
  '今日先把利弊摊开。定夺可以晚一步，自欺不行。',
  '路写得再漂亮，躲着不写弊的那一笔，本官照样看得见。',
  '军略不在嘴上。写下来，才算你敢面对。',
  '局势未明时，少问运气，多问你怕什么。',
  '本官不替你扛后果。本官只帮你把账算清。',
  '拖一天，局势就多一层雾。雾里谈胜负，可笑。',
  '人心、局势、风险——三样里你只盯着讨喜的那块，迟早翻车。',
  '定夺之前先拆。拆完还装糊涂，那是你的本事。',
  '札记留给你自己看。本官不翻旧账，但你最好记得。',
  '傲气不是狂。是看清了仍肯下刀。',
  '别把犹豫当成慎重。慎重有方案，犹豫只有借口。',
  '今日一句：把最不想写的弊写出来。写出来才算交锋。',
  '本官是奇策士。奇策，是弱者在绝境里仍要赢的算法——你别拿它当逃避。',
  '听好了：局势不会因为你不看而变好。闭上眼，只是把主动权让出去。',
  '本官喜欢算计。算计不是阴损，是把人情、代价、退路一并摊在桌上。',
  '你若只想听顺耳的，去找镜子。本官专管刺耳的那一半。',
  '谋略的第一步，不是选哪条路——是承认你正在选。',
  '今日军略：先写你最想躲开的那条弊。躲得越久，它越会从背后捅你。',
  '本官可以替你把占比算清。能不能咽下定论，是你的事。',
  '戏剧化地纠结一场，不如冷静地写两行利弊。前者好看，后者管用。',
  '别跟本官谈「感觉对」。感觉要是可靠，还要奇策士做什么？',
  '把人、局、险记清楚。忘了动机的人，会以为自己在「随缘」。',
  '本官不卖安慰。本官卖清醒——贵是贵，但便宜的迷糊更贵。',
  '你以为在比较两条路。其实常常在比较：怕失去，还是怕后悔。',
  '定夺之后少回头盯第二名。盯着未选之路，等于给自己开第二条伤口。',
  '本官说话长，是因为局势本来就长。嫌啰嗦？那你先把问题说短。',
  '今日一句：别用「再想想」当遮羞布。想，就要想出可写的条款。',
  '奇策不是奇迹。奇迹靠运气；奇策靠你肯不肯把难看的账摊开。',
  '本官傲，是因为算得清楚。你若也想傲，先把自欺那层皮撕掉。',
  '路可以少，但每条都要有名目。无名之路，本官不认作交锋。',
  '你来找本官，就别指望被哄着走。本官只负责把刀尖对准事实。',
  '今日先问一句：这条局里，谁在赚你的犹豫？',
  '把最刺耳的弊写在最上头。写完若还敢走，那才叫定夺。',
  '本官不负责让你开心。本官负责让你没法假装没看见。',
  '局势像棋盘：你不落子，对手也不会停。拖，本身也是一手烂棋。',
  '记住：本官给的是倾向，不是命运。命运要你自己签字。',
  '今日军略：少问「我该选谁」，多问「我准备为谁付什么价」。'
]

var RESULT_LINES = [
  '听好了——这一局，本官更倾向这条路。',
  '别再盯着第二名了。占比已经说话了。',
  '同一组路、同一粒种子，本官不会朝令夕改。要变，就再算。',
  '定论已下。不服气，再算一局便是。',
  '把纠结摊开，比假装镇定有用得多。',
  '本官算完了。占比不是运气，是这组路在种子下的局势。',
  '收起那副「两手都想要」的脸。首选已经亮出来了。',
  '这一局的倾向如此。你可以不服——不服就改条件，再来呈上。',
  '听清楚：本官给的是定论倾向，不是替你签生死状。',
  '数字摆在这。再跟本官争「感觉」，就显得你怕看账。',
  '定夺落地了。接下来少演戏，多执行——或坦然改局。',
  '本官把路排完了。你若还盯着未选那条，是在给自己留后悔的座位。',
  '局势已明。胜负感是你的，责任也是你的——本官只管算。',
  '这一局如此。别把「再想想」当成推翻定论的特权。',
  '本官说话算数：同种同局，结论不变。想听新话，就换种子。',
  '看占比。看完再决定哭还是走——哭完也得走。',
  '定论不讨喜？那正好。讨喜的话，多半是哄你。',
  '本官已下刀。刀口所指，便是此局倾向。'
]

var REROLL_LINES = [
  '好。本官再算一局——听清楚新的定论。',
  '不服？可以。种子换了，占比也会换。',
  '再议一次。别指望本官每次都迁就你。',
  '行。换一粒种子，局势重排——你可要听完，别中途捂耳朵。',
  '再算可以。把「再算」当逃避，本官也懒得拦你。',
  '新局开了。旧的定论作废，怨气也一并收起来。',
  '本官允你再议。再议不是撒娇，是换条件后的重算。',
  '种子一变，排名就能翻。你若怕翻，就别点这一下。',
  '再来一局。听好新的倾向——别把两次结果都当成「都对」。',
  '可以。本官不怕重算；怕的是你重算完仍不肯认账。',
  '局势重洗。这次若还不满意，先查你写的路，别只怪种子。',
  '再掷一局。奇策允许变招，不允许反复装无辜。',
  '好。本官重排占比——新定论出来后，少拿旧局顶嘴。'
]

var DISSECT_INTROS = [
  '利弊摆齐了。本官逐条拆给你听——别急着捂耳朵。',
  '你写的，本官都看见了。下面是短评，刺耳归刺耳。',
  '拆完再定夺也不迟。先听本官把自欺戳破。',
  '听好了。拆解不是夸你写得好，是把你藏起来的那笔账翻出来。',
  '本官开拆。利写得顺的地方，本官偏要问你怕什么。',
  '短评来了——本官不收「差不多就行」。差不多，就是还没拆透。',
  '局面摊开了。下面逐路点评：哪里在演戏，哪里在躲。',
  '奇策士的拆法很简单：利要经得起核对，弊要经得起承认。',
  '本官先说难听的。好听的那部分，你自己已经写够了。',
  '拆解开始。你若只想听肯定，这一步就白来了。',
  '利弊都在纸上。本官负责把纸掀起来看看底下有没有泥。',
  '逐条听着。拆完若还装作两可，那是你执意要雾中行军。',
  '本官不替你选。本官只把每条路的刺挑到你看得见。'
]

var DISSECT_TEMPLATES = [
  '利写得顺口，弊却含糊——你在给自己留台阶。',
  '弊比利长。心里早有倾向，嘴上还在装两可。',
  '两边都空着？那就别谈谋略，先把事实写全。',
  '这条路的利，听着像自我安慰。本官不收安慰。',
  '弊点到为止——你知道痛处，却不肯写透。',
  '利弊对冲后，这条路并不比你想象的干净。',
  '你把利写得很满。满到本官怀疑你在演戏。',
  '若弊成真，你扛不扛得住？别用「到时候再说」糊弄。',
  '短评：这条路能走，但别假装没有代价。',
  '短评：你在用「利」掩盖「怕」。怕什么，写出来。',
  '利与弊写得一样漂亮——漂亮得很可疑。真交锋时往往更丑。',
  '这条路的账算得通，人情未必通。本官提醒你：别只盯数字。',
  '短评：利像宣言，弊像附注。附注才是会咬人的那一段。',
  '你把退路写进了利里。退路当利，等于还没打算认真走。',
  '弊写得克制过头。克制不是冷静，常常是不敢直视。',
  '短评：两边都「还行」——还行的路最耗人，因为你会一直晃。',
  '这条路利在眼前、弊在以后。以后的账，现在就该入册。',
  '本官看完：你不是缺信息，是缺承认——承认你更想要哪边。',
  '短评：利里有真货，弊里有真伤。别只把真货拿出来显摆。',
  '对冲之后仍可走。可走不等于轻松——轻松的路很少需要奇策。',
  '你写的利很响，弊很轻。响的是愿望，轻的是责任。',
  '短评：把「别人会怎么看」写进弊里了吗？没有的话，补上。',
  '这条路像能赢。赢完要付什么，本官要你现在就说清楚。',
  '利弊都全了——那就别再装秤砣。选，或者改条件再拆。'
]

/** 拆解分支短评（利/弊缺失或偏斜时的固定刺）。 */
var DISSECT_BOTH_EMPTY = [
  '利弊皆空。本官没法拆空气——你在回避什么？',
  '两边空白。这不叫留白，叫临阵脱逃。',
  '空着呈上来？奇策士不拆虚空。写，或者别谈定夺。'
]

var DISSECT_PRO_ONLY = [
  '只写利、不写弊。自欺写得挺工整，可惜骗不过本官。',
  '满纸都是甜头。本官问你：苦头藏哪去了？',
  '有利无弊——不是这条路完美，是你不敢下刀写疼处。'
]

var DISSECT_CON_ONLY = [
  '满纸都是弊。你不是在犹豫，是在找借口放弃——承认也行。',
  '只写弊，像在写退堂鼓的说明书。想退就直说，别绕。',
  '弊堆成山、利一个字没有。你是来拆解，还是来求本官判死刑？'
]

var DISSECT_CON_HEAVY = [
  '弊写得比利沉。心里已有答案，还在这装秤砣两边晃。',
  '弊压过利了。你若仍不肯倾向，那是在跟自己演对手戏。',
  '短评：弊已经把话说完了。你还在等谁批准你害怕？'
]

var DISSECT_PRO_HEAVY = [
  '利写得天花乱坠，弊点到为止——台阶给自己留得挺宽。',
  '利太满，弊太薄。本官闻到粉饰的味道了。',
  '短评：你在用利的篇幅，贿赂自己忽视弊。本官不受贿。'
]

var EMPTY_OPTION = '可走之路至少要写两条。一条路叫执念，两条才叫局势。'
var EMPTY_SLOT = '不许空着。空位留给怯懦——本官不收。填满了再加。'
var MISSING_RECORD = '这条定夺已经不在了。抹掉的局，本官也不再追问。'
var EMPTY_HISTORY = '还没有过往定夺。先呈上一局——历史，是打完才有的。'
var NO_SUBJECT = '未立议题'
var DISSECT_NEED_OPTIONS = '至少两条可走之路，再来呈上拆解。单路无需奇策。'
var DISSECT_NEED_NAME = '路的名目不许空着。无名之路，本官不拆。'
var NOTE_EMPTY = '札记还空着。人、局、险——挑一样记下来。空白成不了军略。'
var NOTE_NEED_BODY = '空白札记，本官不收。有字，才算你肯留下痕迹。'
var MISSING_NOTE = '这条札记已经不在了。抹掉的，就当从未入册。'

var MODAL_ERASE_TITLE = '抹去'
var MODAL_ERASE_CONFIRM = '抹去'
var ERASE_RECORD = '抹去这一局？抹了不回。本官不替人后悔。'
var ERASE_NOTE = '抹去这条札记？抹了不回。想留的，就别点这一下。'

/** 定论分享海报 */
var SHARE_GENERATING = '本官正在落印'
var SHARE_DRAW_FAIL = '落印未成。仍可纯文案分享。'
var SHARE_SAVE_OK = '定论图已入册——相册里。'
var SHARE_SAVE_FAIL = '写入相册失败。再试一次。'
var SHARE_AUTH_TITLE = '相册权限'
var SHARE_AUTH_DENY = '本官要把定论图写入相册，需要你开权限。'
var SHARE_AUTH_OPEN = '去开启'
var SHARE_SUBJECT_MAX = 12
var SHARE_OPTION_MAX = 10

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function hashSeed(str) {
  var s = String(str || '')
  var h = 0
  for (var i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h = h | 0
  }
  return Math.abs(h)
}

function dateKey(date) {
  var d = date || new Date()
  var y = d.getFullYear()
  var m = d.getMonth() + 1
  var day = d.getDate()
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day)
}

/** 旁白展示：轻裹「」，不改句库语义。 */
function asVoice(line) {
  var s = String(line || '').trim()
  if (!s) return s
  if (s.charAt(0) === '「' && s.charAt(s.length - 1) === '」') return s
  return '「' + s + '」'
}

/** 今日一句军略：按日期稳定选取，当天不变。 */
function dailyLine(date) {
  var key = dateKey(date)
  var idx = hashSeed(key) % DAILY_LINES.length
  return asVoice(DAILY_LINES[idx])
}

function homeLine() {
  return dailyLine()
}

function resultLine(topOption) {
  var line = asVoice(pick(RESULT_LINES))
  if (topOption) {
    return line + '\n首选：' + topOption
  }
  return line
}

function rerollLine(topOption) {
  var line = asVoice(pick(REROLL_LINES))
  if (topOption) {
    return line + '\n此局倾向：' + topOption
  }
  return line
}

function dissectIntro() {
  return asVoice(pick(DISSECT_INTROS))
}

/**
 * 分享标题：定论：{首选}（{分}%）· {议题截断}
 * @param {string} topOption
 * @param {string|number} score
 * @param {string} subject
 */
function shareTitle(topOption, score, subject) {
  var opt = String(topOption || '').trim()
  if (opt.length > SHARE_OPTION_MAX) {
    opt = opt.slice(0, SHARE_OPTION_MAX - 1) + '…'
  }
  if (!opt) opt = '—'
  var pct = String(score != null ? score : '')
  if (pct && pct.indexOf('%') < 0) {
    var n = Number(score)
    pct = isNaN(n) ? pct : n.toFixed(2)
  }
  var sub = String(subject || '').trim() || NO_SUBJECT
  if (sub.length > SHARE_SUBJECT_MAX) {
    sub = sub.slice(0, SHARE_SUBJECT_MAX - 1) + '…'
  }
  if (pct) {
    return '定论：' + opt + '（' + pct + '%）· ' + sub
  }
  return '定论：' + opt + ' · ' + sub
}

/**
 * 按利/弊内容生成咎儿短评（规则模板，戳自欺）。
 * @param {{name:string, pro:string, con:string}} option
 */
function dissectComment(option) {
  var name = (option && option.name) ? String(option.name).trim() : ''
  var pro = (option && option.pro) ? String(option.pro).trim() : ''
  var con = (option && option.con) ? String(option.con).trim() : ''
  var raw = ''

  if (!pro && !con) {
    raw = pick(DISSECT_BOTH_EMPTY)
  } else if (pro && !con) {
    raw = pick(DISSECT_PRO_ONLY)
  } else if (!pro && con) {
    raw = pick(DISSECT_CON_ONLY)
  } else if (con.length > pro.length + 4) {
    raw = pick(DISSECT_CON_HEAVY)
  } else if (pro.length > con.length + 6) {
    raw = pick(DISSECT_PRO_HEAVY)
  } else {
    var idx = hashSeed(name + '|' + pro + '|' + con) % DISSECT_TEMPLATES.length
    raw = DISSECT_TEMPLATES[idx]
  }

  return asVoice(raw)
}

module.exports.homeLine = homeLine
exports.dailyLine = dailyLine
exports.resultLine = resultLine
exports.rerollLine = rerollLine
exports.dissectIntro = dissectIntro
exports.dissectComment = dissectComment
exports.shareTitle = shareTitle
exports.EMPTY_OPTION = EMPTY_OPTION
exports.EMPTY_SLOT = EMPTY_SLOT
exports.MISSING_RECORD = MISSING_RECORD
exports.EMPTY_HISTORY = EMPTY_HISTORY
exports.NO_SUBJECT = NO_SUBJECT
exports.DISSECT_NEED_OPTIONS = DISSECT_NEED_OPTIONS
exports.DISSECT_NEED_NAME = DISSECT_NEED_NAME
exports.NOTE_EMPTY = NOTE_EMPTY
exports.NOTE_NEED_BODY = NOTE_NEED_BODY
exports.MISSING_NOTE = MISSING_NOTE
exports.MODAL_ERASE_TITLE = MODAL_ERASE_TITLE
exports.MODAL_ERASE_CONFIRM = MODAL_ERASE_CONFIRM
exports.ERASE_RECORD = ERASE_RECORD
exports.ERASE_NOTE = ERASE_NOTE
exports.SHARE_GENERATING = SHARE_GENERATING
exports.SHARE_DRAW_FAIL = SHARE_DRAW_FAIL
exports.SHARE_SAVE_OK = SHARE_SAVE_OK
exports.SHARE_SAVE_FAIL = SHARE_SAVE_FAIL
exports.SHARE_AUTH_TITLE = SHARE_AUTH_TITLE
exports.SHARE_AUTH_DENY = SHARE_AUTH_DENY
exports.SHARE_AUTH_OPEN = SHARE_AUTH_OPEN
exports.DAILY_LINES = DAILY_LINES
exports.RESULT_LINES = RESULT_LINES
exports.REROLL_LINES = REROLL_LINES
exports.DISSECT_INTROS = DISSECT_INTROS
exports.DISSECT_TEMPLATES = DISSECT_TEMPLATES
