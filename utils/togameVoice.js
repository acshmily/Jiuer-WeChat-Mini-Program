/**
 * 咎儿助手 · 语气与旁白
 *
 * 人设：军师，傲气、算计清楚；短句刺一下，长句把局势说透。
 * 避开：软萌客服、说明书腔、随机转盘玩笑感。
 * 文案自写，不搬运动画原台词。
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
  '今日一句：把最不想写的弊写出来。写出来才算交锋。'
]

var RESULT_LINES = [
  '听好了——这一局，本官更倾向这条路。',
  '别再盯着第二名了。占比已经说话了。',
  '同一组路、同一粒种子，本官不会朝令夕改。要变，就再算。',
  '定论已下。不服气，再算一局便是。',
  '把纠结摊开，比假装镇定有用得多。'
]

var REROLL_LINES = [
  '好。本官再算一局——听清楚新的定论。',
  '不服？可以。种子换了，占比也会换。',
  '再议一次。别指望本官每次都迁就你。'
]

var DISSECT_INTROS = [
  '利弊摆齐了。本官逐条拆给你听——别急着捂耳朵。',
  '你写的，本官都看见了。下面是短评，刺耳归刺耳。',
  '拆完再定夺也不迟。先听本官把自欺戳破。'
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
  '短评：你在用「利」掩盖「怕」。怕什么，写出来。'
]

var EMPTY_OPTION = '可走之路至少要写两条。空着的不算。'
var EMPTY_SLOT = '不许空着。填满了再加。'
var MISSING_RECORD = '这条定夺已经不在了。'
var EMPTY_HISTORY = '还没有过往定夺。先呈上一局。'
var NO_SUBJECT = '未立议题'
var DISSECT_NEED_OPTIONS = '至少两条可走之路，再来呈上拆解。'
var DISSECT_NEED_NAME = '路的名目不许空着。'
var NOTE_EMPTY = '札记还空着。人、局、险——挑一样记下来。'
var NOTE_NEED_BODY = '空白札记，本官不收。'
var MISSING_NOTE = '这条札记已经不在了。'

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
 * 按利/弊内容生成咎儿短评（规则模板，戳自欺）。
 * @param {{name:string, pro:string, con:string}} option
 */
function dissectComment(option) {
  var name = (option && option.name) ? String(option.name).trim() : ''
  var pro = (option && option.pro) ? String(option.pro).trim() : ''
  var con = (option && option.con) ? String(option.con).trim() : ''
  var raw = ''

  if (!pro && !con) {
    raw = '利弊皆空。本官没法拆空气——你在回避什么？'
  } else if (pro && !con) {
    raw = '只写利、不写弊。自欺写得挺工整，可惜骗不过本官。'
  } else if (!pro && con) {
    raw = '满纸都是弊。你不是在犹豫，是在找借口放弃——承认也行。'
  } else if (con.length > pro.length + 4) {
    raw = '弊写得比利沉。心里已有答案，还在这装秤砣两边晃。'
  } else if (pro.length > con.length + 6) {
    raw = '利写得天花乱坠，弊点到为止——台阶给自己留得挺宽。'
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
exports.DAILY_LINES = DAILY_LINES
