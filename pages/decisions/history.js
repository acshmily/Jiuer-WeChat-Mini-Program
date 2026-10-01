const decisionStore = require('../../utils/decisionStore.js')
const voice = require('../../utils/togameVoice.js')
const dissolve = require('../../utils/dissolve.js')

Page({
  data: {
    list: [],
    emptyText: voice.EMPTY_HISTORY,
    dissolvingId: ''
  },
  onShow: function () {
    if (this.data.dissolvingId) {
      return
    }
    this.reloadList()
  },
  reloadList: function () {
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
      decisionStore.remove(id)
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
      content: '抹去这一局？抹了不回。',
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
