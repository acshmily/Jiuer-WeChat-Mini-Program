const voice = require('../../utils/togameVoice.js')

var PENDING_KEY = 'pendingDecisionDraft'

function blankOption() {
  return { name: '', pro: '', con: '', comment: '' }
}

Page({
  data: {
    subject: '',
    options: [blankOption(), blankOption()],
    intro: '',
    done: false
  },
  subjectInput: function (e) {
    this.setData({
      subject: e.detail.value,
      done: false,
      intro: ''
    })
  },
  fieldInput: function (e) {
    var idx = e.currentTarget.dataset.idx
    var field = e.currentTarget.dataset.field
    var options = this.data.options.slice()
    var row = Object.assign({}, options[idx])
    row[field] = e.detail.value
    row.comment = ''
    options[idx] = row
    this.setData({
      options: options,
      done: false,
      intro: ''
    })
  },
  addOption: function () {
    var options = this.data.options
    for (var i = 0; i < options.length; i++) {
      if (!String(options[i].name || '').trim()) {
        wx.showModal({
          content: voice.EMPTY_SLOT,
          showCancel: false
        })
        return
      }
    }
    this.setData({
      options: options.concat([blankOption()]),
      done: false,
      intro: ''
    })
  },
  delOption: function (e) {
    var id = e.currentTarget.dataset.id
    var options = []
    for (var i = 0; i < this.data.options.length; i++) {
      if (i === id) {
        continue
      }
      options.push(this.data.options[i])
    }
    this.setData({
      options: options,
      done: false,
      intro: ''
    })
  },
  doDissect: function () {
    var options = this.data.options
    var filled = []
    for (var i = 0; i < options.length; i++) {
      var name = String(options[i].name || '').trim()
      if (!name) {
        continue
      }
      filled.push({
        name: name,
        pro: String(options[i].pro || '').trim(),
        con: String(options[i].con || '').trim(),
        comment: ''
      })
    }
    if (filled.length < 2) {
      wx.showModal({
        content: voice.DISSECT_NEED_OPTIONS,
        showCancel: false
      })
      return
    }
    for (var j = 0; j < filled.length; j++) {
      filled[j].comment = voice.dissectComment(filled[j])
    }
    this.setData({
      options: filled,
      intro: voice.dissectIntro(),
      done: true
    })
  },
  sendToDecide: function () {
    var names = []
    for (var i = 0; i < this.data.options.length; i++) {
      var name = String(this.data.options[i].name || '').trim()
      if (name) {
        names.push(name)
      }
    }
    if (names.length < 2) {
      wx.showModal({
        content: voice.DISSECT_NEED_OPTIONS,
        showCancel: false
      })
      return
    }
    wx.setStorageSync(PENDING_KEY, JSON.stringify({
      subject: this.data.subject || '',
      options: names
    }))
    var stack = getCurrentPages()
    if (stack.length > 1) {
      wx.navigateBack()
    } else {
      wx.reLaunch({
        url: '/pages/decisions/index'
      })
    }
  }
})
