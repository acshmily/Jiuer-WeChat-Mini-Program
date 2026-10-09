const decisionStore = require('../../utils/decisionStore.js')
const voice = require('../../utils/togameVoice.js')
const dissolve = require('../../utils/dissolve.js')

var PENDING_KEY = 'pendingDecisionDraft'

Page({
  data: {
    subject: '',
    advice: [],
    aside: '',
    dissolvingId: ''
  },
  onLoad: function () {
    this._rowSeq = 0
    this._submitting = false
    this.setData({
      subject: '',
      advice: [this.nextRow(), this.nextRow()],
      aside: voice.dailyLine(),
      dissolvingId: ''
    })
  },
  onShow: function () {
    var self = this
    this._submitting = false
    var patch = {
      aside: voice.dailyLine()
    }
    var raw = wx.getStorageSync(PENDING_KEY)
    if (raw) {
      try {
        var draft = typeof raw === 'string' ? JSON.parse(raw) : raw
        if (draft && Array.isArray(draft.options) && draft.options.length >= 2) {
          patch.subject = draft.subject || ''
          patch.advice = draft.options.map(function (text) {
            var row = self.nextRow()
            row.text = String(text == null ? '' : text)
            return row
          })
        }
      } catch (e) {
        // ignore corrupt draft
      }
      wx.removeStorageSync(PENDING_KEY)
    }
    this.setData(patch)
  },
  onUnload: function () {
    clearTimeout(this._dissolveTimer)
  },
  nextRow: function () {
    this._rowSeq = (this._rowSeq || 0) + 1
    return { id: 'r' + this._rowSeq, text: '' }
  },
  addMoreInput: function () {
    if (this.data.dissolvingId) {
      return
    }
    var advice = this.data.advice
    for (var i = 0; i < advice.length; i++) {
      if (!String(advice[i].text || '').trim()) {
        wx.showModal({
          content: voice.EMPTY_SLOT,
          showCancel: false
        })
        return
      }
    }
    this.setData({
      advice: advice.concat([this.nextRow()])
    })
  },
  delItem: function (e) {
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
      var kept = self.data.advice.filter(function (row) {
        return row.id !== id
      })
      self.setData({
        advice: kept,
        dissolvingId: ''
      })
    }, dissolve.DURATION)
  },
  itemInput: function (e) {
    var id = e.currentTarget.dataset.id
    var advice = this.data.advice
    for (var i = 0; i < advice.length; i++) {
      if (advice[i].id !== id) {
        continue
      }
      if (advice[i].text === e.detail.value) {
        return
      }
      var patch = {}
      patch['advice[' + i + '].text'] = e.detail.value
      this.setData(patch)
      return
    }
  },
  subjectInput: function (e) {
    this.setData({
      subject: e.detail.value
    })
  },
  openMore: function () {
    wx.showActionSheet({
      itemList: ['正反拆解', '谋略札记', '过往定夺'],
      success: function (res) {
        var urls = [
          '/pages/dissect/index',
          '/pages/notes/index',
          '/pages/decisions/history'
        ]
        if (res.tapIndex >= 0 && res.tapIndex < urls.length) {
          wx.navigateTo({
            url: urls[res.tapIndex]
          })
        }
      }
    })
  },
  doChoose: function () {
    if (this._submitting || this.data.dissolvingId) {
      return
    }
    var options = []
    var advice = this.data.advice
    for (var i = 0; i < advice.length; i++) {
      var text = String(advice[i].text || '').trim()
      if (!text) {
        continue
      }
      options.push(text)
    }
    if (options.length < 2) {
      wx.showModal({
        content: voice.EMPTY_OPTION,
        showCancel: false
      })
      return
    }
    var self = this
    this._submitting = true
    var record = decisionStore.add(String(this.data.subject || '').trim(), options)
    wx.navigateTo({
      url: 'result?id=' + record.id,
      fail: function () {
        self._submitting = false
      }
    })
  }
})
