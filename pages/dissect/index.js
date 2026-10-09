const voice = require('../../utils/togameVoice.js')
const dissolve = require('../../utils/dissolve.js')

var PENDING_KEY = 'pendingDecisionDraft'

Page({
  data: {
    subject: '',
    options: [],
    intro: '',
    done: false,
    dissolvingId: ''
  },
  onLoad: function () {
    this._optSeq = 0
    this._sending = false
    this.setData({
      subject: '',
      options: [this.nextOption(), this.nextOption()],
      intro: '',
      done: false,
      dissolvingId: ''
    })
  },
  onUnload: function () {
    clearTimeout(this._dissolveTimer)
  },
  nextOption: function () {
    this._optSeq = (this._optSeq || 0) + 1
    return { id: 'p' + this._optSeq, name: '', pro: '', con: '', comment: '' }
  },
  subjectInput: function (e) {
    this.setData({
      subject: e.detail.value,
      done: false,
      intro: ''
    })
  },
  fieldInput: function (e) {
    var id = e.currentTarget.dataset.id
    var field = e.currentTarget.dataset.field
    var options = this.data.options
    for (var i = 0; i < options.length; i++) {
      if (options[i].id !== id) {
        continue
      }
      var patch = {
        done: false,
        intro: ''
      }
      patch['options[' + i + '].' + field] = e.detail.value
      patch['options[' + i + '].comment'] = ''
      this.setData(patch)
      return
    }
  },
  addOption: function () {
    if (this.data.dissolvingId) {
      return
    }
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
      options: options.concat([this.nextOption()]),
      done: false,
      intro: ''
    })
  },
  delOption: function (e) {
    var id = e.currentTarget.dataset.id
    var self = this
    if (this.data.dissolvingId) {
      return
    }
    this.setData({
      dissolvingId: id
    })
    clearTimeout(this._dissolveTimer)
    this._dissolveTimer = setTimeout(function () {
      var kept = self.data.options.filter(function (row) {
        return row.id !== id
      })
      self.setData({
        options: kept,
        dissolvingId: '',
        done: false,
        intro: ''
      })
    }, dissolve.DURATION)
  },
  doDissect: function () {
    if (this.data.dissolvingId) {
      return
    }
    var options = this.data.options
    var filled = []
    for (var i = 0; i < options.length; i++) {
      var name = String(options[i].name || '').trim()
      if (!name) {
        continue
      }
      filled.push({
        id: options[i].id,
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
    if (this._sending || this.data.dissolvingId) {
      return
    }
    var names = []
    var options = this.data.options
    for (var i = 0; i < options.length; i++) {
      var name = String(options[i].name || '').trim()
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
    this._sending = true
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
