const noteStore = require('../../utils/noteStore.js')
const voice = require('../../utils/togameVoice.js')
const dissolve = require('../../utils/dissolve.js')

function preview(body) {
  var text = String(body || '').replace(/\s+/g, ' ').trim()
  if (text.length <= 36) {
    return text
  }
  return text.slice(0, 36) + '…'
}

function tagKey(tag) {
  if (tag === '人') return 'ren'
  if (tag === '险') return 'xian'
  return 'ju'
}

Page({
  data: {
    list: [],
    emptyText: voice.NOTE_EMPTY,
    dissolvingId: ''
  },
  onShow: function () {
    if (this.data.dissolvingId) {
      return
    }
    this.reloadList()
  },
  reloadList: function () {
    var records = noteStore.list()
    var list = []
    for (var i = 0; i < records.length; i++) {
      list.push({
        id: records[i].id,
        tag: records[i].tag,
        tagKey: tagKey(records[i].tag),
        preview: preview(records[i].body),
        updatedAt: records[i].updatedAt || records[i].createdAt
      })
    }
    this.setData({
      list: list,
      dissolvingId: ''
    })
  },
  playRemove: function (id) {
    var self = this
    if (!id || this.data.dissolvingId) {
      return
    }
    this.setData({
      dissolvingId: id
    })
    clearTimeout(this._dissolveTimer)
    this._dissolveTimer = setTimeout(function () {
      noteStore.remove(id)
      self.reloadList()
    }, dissolve.DURATION)
  },
  remove: function (e) {
    var id = e.currentTarget.dataset.id
    var self = this
    if (this.data.dissolvingId) {
      return
    }
    wx.showModal({
      title: '抹去',
      content: '抹去这条札记？抹了不回。',
      confirmText: '抹去',
      confirmColor: '#8B2E2E',
      success: function (res) {
        if (!res.confirm) {
          return
        }
        self.playRemove(id)
      }
    })
  }
})
