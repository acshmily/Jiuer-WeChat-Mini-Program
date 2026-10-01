/**
 * 抹去／去掉：硬边「离子」碎片参数（刀语扁平：墨／冰／朱，无柔光粒子）
 */
var TONES = ['ink', 'ice', 'crimson', 'soft']

/** 动画总时长 ms（与组件 keyframes 对齐） */
var DURATION = 480

function hash(n) {
  var x = (n * 2654435761) >>> 0
  return x
}

/**
 * 生成矩形碎片布局（确定性，同 count 同形）
 * @param {number} [count]
 * @returns {Array<{i,x,y,w,h,dx,dy,rot,delay,tone}>}
 */
function buildShards(count) {
  var n = count || 20
  var cols = 5
  var rows = 4
  var shards = []
  var i = 0
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (i >= n) {
        break
      }
      var cx = ((c + 0.5) / cols) * 100
      var cy = ((r + 0.5) / rows) * 100
      var jx = (hash(i) % 17) - 8
      var jy = (hash(i + 7) % 13) - 6
      var sideX = c < cols / 2 ? -1 : 1
      var dx = (((hash(i + 3) % 72) + 18) * sideX) + (c - (cols - 1) / 2) * 10
      var dy = ((hash(i + 11) % 56) - 18) + (r - (rows - 1) / 2) * 12
      shards.push({
        i: i,
        x: Math.round((cx + jx * 0.35) * 10) / 10,
        y: Math.round((cy + jy * 0.35) * 10) / 10,
        w: 5 + (hash(i) % 11),
        h: 2 + (hash(i + 5) % 8),
        dx: Math.round(dx),
        dy: Math.round(dy),
        rot: (hash(i + 19) % 56) - 28,
        delay: hash(i + 23) % 80,
        tone: TONES[i % TONES.length]
      })
      i++
    }
  }
  return shards
}

exports.DURATION = DURATION
exports.TONES = TONES
exports.buildShards = buildShards
