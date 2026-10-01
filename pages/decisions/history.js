const decisionStore = require('../../utils/decisionStore.js')
const voice = require('../../utils/togameVoice.js')

Page({
  data: {
    list: [],
    emptyText: voice.EMPTY_HISTORY
  },
  onShow: function () {
    var records = decisionStore.list()
    var list = []
    for (var i = 0; i < records.length; i++) {
      var subject = records[i].subject
      list.push({
        id: records[i].id,
        subject: subject ? subject : voice.NO_SUBJECT,
        createdAt: records[i].createdAt,
        top: decisionStore.topOption(records[i])
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
      content: '抹去这一局？抹了不回。',
      confirmText: '抹去',
      confirmColor: '#8B2E2E',
      success: function (res) {
        if (!res.confirm) {
          return
        }
        decisionStore.remove(id)
        self.onShow()
      }
    })
  }
})
