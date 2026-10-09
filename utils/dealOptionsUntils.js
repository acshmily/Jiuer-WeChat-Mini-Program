// 处理选项
var makeCRCTable = function(){
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

var crc32 = function(str) {
    var crcTable = makeCRCTable()
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++ ) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
};
/**
 * 同一主题、同一选项顺序、同一个 seed，占比不变。
 * 返回值保持输入顺序，分数为合计 100 的两位小数字符串。
 */
function scoreOptions(subject, options, seed) {
    var scored = []
    var totalWeight = 0
    var i
    for (i = 0; i < options.length; i++) {
        var weight = crc32(String(seed) + '|' + subject + '|' + i + '|' + options[i])
        scored.push({
            option: options[i],
            weight: weight
        })
        totalWeight += weight
    }
    if (scored.length === 0) {
        return []
    }
    var scoreFix = 10000
    if (totalWeight === 0) {
        var even = 10000 / scored.length
        for (i = 0; i < scored.length; i++) {
            scored[i].score = even
            scoreFix -= even
        }
    } else {
        for (i = 0; i < scored.length; i++) {
            scored[i].score = scored[i].weight * 10000 / totalWeight
            scoreFix -= scored[i].score
        }
    }
    if (scoreFix !== 0) {
        scored[scored.length - 1].score += scoreFix
    }
    for (i = 0; i < scored.length; i++) {
        scored[i].score = (scored[i].score / 100).toFixed(2)
        delete scored[i].weight
    }
    return scored
}

function rankByScore(items) {
    return items.slice().sort(function (a, b) {
        return parseFloat(b.score) - parseFloat(a.score)
    })
}

module.exports.dealOptions = crc32
exports.scoreOptions = scoreOptions
exports.rankByScore = rankByScore
