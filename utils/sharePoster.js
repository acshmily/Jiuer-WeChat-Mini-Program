/**
 * 定论分享海报 · Canvas 2D
 * Token 硬编码（canvas 读不到 CSS 变量）：冰墨朱红。
 */

var COLORS = {
  bg: '#F4F6F8',
  ink: '#12151C',
  muted: '#5A6573',
  primary: '#3A6F8F',
  accent: '#A83232',
  lineSoft: '#C5CCD6',
  surface: '#FFFFFF'
}

var POSTER_W = 750
var POSTER_H = 1334
var MAX_BARS = 6
var PAD_X = 56
var ACCENT_BAR = 8

/** 小程序码本地资源（相对小程序根目录） */
var QR_SRC = '/images/mp-qrcode.jpg'
var QR_SIZE = 148
var QR_MARGIN = 48
var QR_CAPTION = '扫码问咎儿'
var QR_CAPTION_GAP = 8
var FOOTER_RESERVE = 200

/**
 * @param {string} text
 * @param {number} maxLen
 */
function truncate(text, maxLen) {
  var s = String(text || '').trim()
  if (!s) return ''
  if (s.length <= maxLen) return s
  return s.slice(0, Math.max(0, maxLen - 1)) + '…'
}

/**
 * 按像素宽度换行（中文友好）。
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} maxWidth
 * @param {number} [maxLines]
 * @returns {string[]}
 */
function wrapText(ctx, text, maxWidth, maxLines) {
  var raw = String(text || '').replace(/\r\n/g, '\n')
  var paragraphs = raw.split('\n')
  var lines = []
  var limit = maxLines || 99
  var p
  for (p = 0; p < paragraphs.length; p++) {
    var para = paragraphs[p]
    if (!para) {
      if (lines.length < limit) lines.push('')
      continue
    }
    var buf = ''
    var i
    for (i = 0; i < para.length; i++) {
      var next = buf + para.charAt(i)
      if (ctx.measureText(next).width > maxWidth && buf) {
        lines.push(buf)
        if (lines.length >= limit) {
          var last = lines[lines.length - 1]
          if (last.charAt(last.length - 1) !== '…') {
            lines[lines.length - 1] = truncate(last, Math.max(1, last.length))
          }
          return lines
        }
        buf = para.charAt(i)
      } else {
        buf = next
      }
    }
    if (buf) {
      lines.push(buf)
      if (lines.length >= limit) return lines
    }
  }
  return lines
}

function formatScore(score) {
  var n = Number(score)
  if (isNaN(n)) return String(score || '0')
  return n.toFixed(2)
}

/**
 * 预加载本地图片为 CanvasImage（失败返回 null）。
 * @param {*} canvas Canvas 节点（type=2d）
 * @param {string} src
 * @returns {Promise<*>}
 */
function loadCanvasImage(canvas, src) {
  return new Promise(function (resolve) {
    var settled = false
    var timer = setTimeout(function () {
      done(null)
    }, 2500)
    var done = function (val) {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve(val)
    }
    var viaGetImageInfo = function () {
      wx.getImageInfo({
        src: src,
        success: function (info) {
          done(info && info.path ? info.path : null)
        },
        fail: function () {
          done(null)
        }
      })
    }
    if (!canvas || typeof canvas.createImage !== 'function') {
      viaGetImageInfo()
      return
    }
    var img = canvas.createImage()
    img.onload = function () {
      done(img)
    }
    img.onerror = function () {
      viaGetImageInfo()
    }
    img.src = src
  })
}

/**
 * 右下角小程序码 + 文案；与左下脚注错开。
 * @param {CanvasRenderingContext2D} ctx
 * @param {*} qrImage createImage 结果或本地 path；falsy 则跳过
 */
function drawQrBlock(ctx, qrImage) {
  if (!qrImage) return

  var qrX = POSTER_W - QR_MARGIN - QR_SIZE
  var captionH = 28
  var blockH = QR_SIZE + QR_CAPTION_GAP + captionH
  var qrY = POSTER_H - QR_MARGIN - blockH
  var cx = qrX + QR_SIZE / 2
  var cy = qrY + QR_SIZE / 2
  var r = QR_SIZE / 2

  // 圆形裁切：去掉 JPG 白角与方框，直接落在冷灰底上
  try {
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(qrImage, qrX, qrY, QR_SIZE, QR_SIZE)
    ctx.restore()
  } catch (e) {
    return
  }

  ctx.fillStyle = COLORS.muted
  ctx.font = '400 20px sans-serif'
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillText(QR_CAPTION, cx, qrY + QR_SIZE + QR_CAPTION_GAP)
  ctx.textAlign = 'left'
}

/**
 * 在已准备好尺寸的 canvas 上绘制定论海报。
 * @param {*} canvas Canvas 节点（type=2d）
 * @param {{
 *   subject: string,
 *   topOption: string,
 *   topScore: string|number,
 *   items: Array<{option:string, score:string|number}>,
 *   voiceLine: string,
 *   createdAt: string,
 *   seed: number|string
 * }} payload
 * @param {*} [qrImage] 可选；缺省不画码
 */
function draw(canvas, payload, qrImage) {
  var data = payload || {}
  var dpr = 1
  try {
    dpr = wx.getSystemInfoSync().pixelRatio || 1
  } catch (e) {
    dpr = 1
  }
  canvas.width = POSTER_W * dpr
  canvas.height = POSTER_H * dpr
  var ctx = canvas.getContext('2d')
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)

  // 底
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, POSTER_W, POSTER_H)

  // 左朱红竖条
  ctx.fillStyle = COLORS.accent
  ctx.fillRect(0, 0, ACCENT_BAR, POSTER_H)

  var x = PAD_X
  // 有码时正文略收窄，避免与右下码抢位（条形仍用全宽到码区上方）
  var contentW = POSTER_W - PAD_X - 48
  var y = 64

  // 品牌
  ctx.fillStyle = COLORS.ink
  ctx.font = '700 36px sans-serif'
  ctx.textBaseline = 'top'
  ctx.fillText('咎儿助手', x, y)
  y += 52

  ctx.font = '700 48px sans-serif'
  ctx.fillText('定论', x, y)
  y += 70

  // 议题
  ctx.fillStyle = COLORS.muted
  ctx.font = '400 28px sans-serif'
  var subjectLine = '议题：' + truncate(data.subject || '未立议题', 18)
  ctx.fillText(subjectLine, x, y)
  y += 56

  // 此局／首选
  ctx.fillStyle = COLORS.accent
  ctx.font = '700 22px sans-serif'
  ctx.fillText('此局／首选', x, y)
  y += 40

  ctx.fillStyle = COLORS.ink
  ctx.font = '700 56px sans-serif'
  var topName = truncate(data.topOption || '—', 12)
  ctx.fillText(topName, x, y)
  y += 72

  ctx.fillStyle = COLORS.accent
  ctx.font = '700 72px sans-serif'
  var scoreText = formatScore(data.topScore) + '%'
  ctx.fillText(scoreText, x, y)
  y += 88

  // 硬边分隔
  ctx.fillStyle = COLORS.ink
  ctx.fillRect(x, y, 120, 3)
  y += 36

  // 旁白（2–3 行）
  ctx.fillStyle = COLORS.ink
  ctx.font = '400 26px sans-serif'
  var voice = String(data.voiceLine || '').replace(/\n/g, ' ')
  var voiceLines = wrapText(ctx, voice, contentW, 3)
  var vi
  for (vi = 0; vi < voiceLines.length; vi++) {
    ctx.fillText(voiceLines[vi], x, y)
    y += 38
  }
  y += 28

  // 各路占比
  ctx.fillStyle = COLORS.ink
  ctx.font = '700 26px sans-serif'
  ctx.fillText('各路占比', x, y)
  y += 44

  var items = Array.isArray(data.items) ? data.items.slice(0, MAX_BARS) : []
  var barMaxW = contentW
  var barH = 14
  var i
  for (i = 0; i < items.length; i++) {
    var item = items[i]
    var name = truncate(item.option || '', 10)
    var pct = formatScore(item.score)
    var isTop = i === 0

    ctx.fillStyle = COLORS.ink
    ctx.font = isTop ? '700 26px sans-serif' : '400 26px sans-serif'
    ctx.fillText(name, x, y)

    ctx.fillStyle = COLORS.muted
    ctx.font = '400 24px sans-serif'
    var pctLabel = pct + '%'
    var pctW = ctx.measureText(pctLabel).width
    ctx.fillText(pctLabel, x + barMaxW - pctW, y)
    y += 36

    // track
    ctx.fillStyle = COLORS.lineSoft
    ctx.fillRect(x, y, barMaxW, barH)
    // fill
    var ratio = Math.max(0, Math.min(100, Number(item.score) || 0)) / 100
    ctx.fillStyle = isTop ? COLORS.accent : COLORS.primary
    ctx.fillRect(x, y, Math.round(barMaxW * ratio), barH)
    y += barH + 28
  }

  // 页脚（靠左，为右下码留空）
  var footMaxW = qrImage
    ? POSTER_W - PAD_X - QR_MARGIN - QR_SIZE - 28
    : contentW
  y = Math.max(y + 24, POSTER_H - FOOTER_RESERVE)
  ctx.fillStyle = COLORS.muted
  ctx.font = '400 22px sans-serif'
  var foot = String(data.createdAt || '') + ' · seed ' + String(data.seed != null ? data.seed : 0)
  var footLines = wrapText(ctx, truncate(foot, 42), Math.max(160, footMaxW), 2)
  var fi
  for (fi = 0; fi < footLines.length; fi++) {
    ctx.fillText(footLines[fi], x, y)
    y += 30
  }
  ctx.font = '400 22px sans-serif'
  ctx.fillText('本地奇策 · 非占卜', x, y)

  drawQrBlock(ctx, qrImage)
}

/**
 * 查询页面内隐藏 canvas、绘制并导出临时路径。
 * @param {*} component Page 实例
 * @param {object} payload
 * @param {string} [selector]
 * @returns {Promise<string>} tempFilePath
 */
function exportTempPath(component, payload, selector) {
  var sel = selector || '#sharePosterCanvas'
  return new Promise(function (resolve, reject) {
    var query = wx.createSelectorQuery()
    if (component && typeof component.createSelectorQuery === 'function') {
      query = component.createSelectorQuery()
    }
    query
      .select(sel)
      .fields({ node: true, size: true })
      .exec(function (res) {
        if (!res || !res[0] || !res[0].node) {
          reject(new Error('canvas missing'))
          return
        }
        var canvas = res[0].node
        loadCanvasImage(canvas, QR_SRC)
          .then(function (qrImage) {
            try {
              draw(canvas, payload, qrImage)
            } catch (err) {
              reject(err)
              return
            }
            // 等一帧再导出，避免部分基础库未刷完
            setTimeout(function () {
              wx.canvasToTempFilePath({
                canvas: canvas,
                fileType: 'png',
                quality: 1,
                success: function (r) {
                  if (r && r.tempFilePath) {
                    resolve(r.tempFilePath)
                  } else {
                    reject(new Error('export empty'))
                  }
                },
                fail: function (err) {
                  reject(err || new Error('export fail'))
                }
              })
            }, 40)
          })
      })
  })
}

exports.draw = draw
exports.exportTempPath = exportTempPath
exports.loadCanvasImage = loadCanvasImage
exports.wrapText = wrapText
exports.truncate = truncate
exports.POSTER_W = POSTER_W
exports.POSTER_H = POSTER_H
exports.COLORS = COLORS
exports.QR_SRC = QR_SRC
