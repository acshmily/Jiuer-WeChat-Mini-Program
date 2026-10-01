const util = require('./util.js')

const KEY = 'strategyNotes'
const MAX = 50
const TAGS = ['人', '局', '险']

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

function normalizeTag(tag) {
  return TAGS.indexOf(tag) >= 0 ? tag : '局'
}

function add(body, tag) {
  var record = {
    id: String(Date.now()),
    body: String(body || '').trim(),
    tag: normalizeTag(tag),
    createdAt: util.formatTime(new Date()),
    updatedAt: util.formatTime(new Date())
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
  var key = String(id)
  var list = read()
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === key) {
      return list[i]
    }
  }
  return null
}

function update(id, body, tag) {
  var key = String(id)
  var list = read()
  var found = null
  for (var i = 0; i < list.length; i++) {
    if (list[i].id !== key) {
      continue
    }
    list[i].body = String(body || '').trim()
    list[i].tag = normalizeTag(tag)
    list[i].updatedAt = util.formatTime(new Date())
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

module.exports.list = read
exports.get = get
exports.add = add
exports.update = update
exports.remove = remove
exports.TAGS = TAGS
