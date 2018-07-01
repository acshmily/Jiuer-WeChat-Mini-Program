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
 * 按要求排序
 * @param keyName
 * @returns {Function}
 */
var objectArraySort = function (keyName) {
    return function (objectN, objectM) {
        var valueN = objectN[keyName]
        var valueM = objectM[keyName]
        if (valueN < valueM) return 1
        else if (valueN > valueM) return -1
        else return 0
    }
}
var randomEmoji =function(){
    let list = ['(=^･ｪ･^=)','(=^‥^=)','( =①ω①=)','(=^･^=)','o(^・x・^)o','d(=^･ω･^=)b','V(=^･ω･^=)v','(=ＴェＴ=)',
        '(=;ェ;=)','(=｀ω´=)','ヽ(=^･ω･^=)丿','(=^･ω･^)y＝','＼(=^‥^)/’`','(^-人-^)','ヽ(^‥^=ゞ)','(^・ω・^ )',
        '(=^-ω-^=)','b(=^‥^=)o','(.=^・ェ・^=)','（=´∇｀=）','ヾ(=ﾟ･ﾟ=)ﾉ','~(=^‥^)ノ','~(=^‥^)/','(=ｘェｘ=)','(=；ェ；=)',
        '(=｀ェ´=)','(^･o･^)ﾉ"','<(*ΦωΦ*)>','(^._.^)ﾉ','└(=^‥^=)┐','=’①。①’=']
    return list[Math.floor(Math.random()*list.length)]
}

module.exports.dealOptions = crc32
exports.makeCRCTable = makeCRCTable
exports.objectArraySort = objectArraySort
exports.randomEmoji = randomEmoji
