const deal = require('./dealOptionsUntils.js')
const util = require('./util.js')

const KEY = 'decisionHistory'
const MAX = 30
// 同毫秒多次 add（防连点兜底）也需要可区分的 id
var idSeq = 0

function read() {
    var json = wx.getStorageSync(KEY)
    if (!json) {
        return []
    }
    try {
        var list = JSON.parse(json)
        return Array.isArray(list) ? list : []
    } catch (e) {
        return []
    }
}

function write(list) {
    wx.setStorageSync(KEY, JSON.stringify(list))
}

function add(subject, options) {
    var record = {
        id: String(Date.now()) + '-' + (++idSeq),
        subject: subject,
        seed: 0,
        createdAt: util.formatTime(new Date()),
        items: deal.scoreOptions(subject, options, 0)
    }
    var list = read()
    list.unshift(record)
    if (list.length > MAX) {
        list = list.slice(0, MAX)
    }
    write(list)
    return record
}

function get(id) {
    var list = read()
    var key = String(id)
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === key) {
            return list[i]
        }
    }
    return null
}

function reroll(id) {
    var list = read()
    var found = null
    var key = String(id)
    for (var i = 0; i < list.length; i++) {
        if (list[i].id !== key) {
            continue
        }
        var texts = []
        for (var j = 0; j < list[i].items.length; j++) {
            texts.push(list[i].items[j].option)
        }
        list[i].seed = list[i].seed + 1
        list[i].items = deal.scoreOptions(list[i].subject, texts, list[i].seed)
        found = list[i]
        break
    }
    if (found) {
        write(list)
    }
    return found
}

function remove(id) {
    var key = String(id)
    var list = read().filter(function (item) {
        return item.id !== key
    })
    write(list)
    return list
}

function topOption(record) {
    if (!record || !record.items || record.items.length === 0) {
        return ''
    }
    var ranked = deal.rankByScore(record.items)
    return ranked[0].option
}

module.exports.add = add
exports.get = get
exports.reroll = reroll
exports.remove = remove
exports.list = read
exports.topOption = topOption
