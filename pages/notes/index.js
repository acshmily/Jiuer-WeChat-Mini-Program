const noteStore = require('../../utils/noteStore.js')
const voice = require('../../utils/togameVoice.js')

function preview(body) {
  var text = String(body || '').replace(/\s+/g, ' ').trim()
  if (text.length <= 36) {
    return text
  }
  return text.slice(0, 36) + '…'
}

Page({
  data: {
    list: [],
    emptyText: voice.NOTE_EMPTY
  },
  onShow: function () {
    var records = noteStore.list()
    var list = []
    for (var i = 0; i < records.length; i++) {
      list.push({
        id: records[i].id,
        tag: records[i].tag,
        preview: preview(records[i].body),
        updatedAt: records[i].updatedAt || records[i].createdAt
      })
    }
    this.setData({
      list: list
    })
  },
  remove: function (e) {
    var id = e.currentTarget.dataset.id
    var self = this
    wx.showModal({
      title: '抹去',
      content: '抹去这条札记？抹了不回。',
      confirmText: '抹去',
      confirmColor: '#8B2E2E',
      success: function (res) {
        if (!res.confirm) {
          return
        }
        noteStore.remove(id)
        self.onShow()
      }
    })
  }
})
