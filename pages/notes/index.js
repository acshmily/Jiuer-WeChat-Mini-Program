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
  onUnload: function () {
    clearTimeout(this._dissolveTimer)
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
      title: voice.MODAL_ERASE_TITLE,
      content: voice.ERASE_NOTE,
      confirmText: voice.MODAL_ERASE_CONFIRM,
      confirmColor: '#A83232',
      success: function (res) {
        if (!res.confirm) {
          return
        }
        self.playRemove(id)
      }
    })
  }
})
