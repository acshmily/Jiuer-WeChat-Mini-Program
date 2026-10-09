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
  onUnload: function () {
    clearTimeout(this._dissolveTimer)
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
      title: voice.MODAL_ERASE_TITLE,
      content: voice.ERASE_RECORD,
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
