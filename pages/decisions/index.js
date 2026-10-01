const decisionStore = require('../../utils/decisionStore.js')
const voice = require('../../utils/togameVoice.js')
const dissolve = require('../../utils/dissolve.js')

var PENDING_KEY = 'pendingDecisionDraft'

Page({
  data: {
    subject: '',
    advice: ['', ''],
    aside: '',
    dissolvingIdx: -1
  },
  onLoad: function () {
    this.setData({
      subject: '',
      advice: ['', ''],
      aside: voice.dailyLine(),
      dissolvingIdx: -1
    })
  },
  onShow: function () {
    var patch = {
      aside: voice.dailyLine()
    }
    var raw = wx.getStorageSync(PENDING_KEY)
    if (raw) {
      try {
        var draft = typeof raw === 'string' ? JSON.parse(raw) : raw
        if (draft && Array.isArray(draft.options) && draft.options.length >= 2) {
          patch.subject = draft.subject || ''
          patch.advice = draft.options.slice()
        }
      } catch (e) {
        // ignore corrupt draft
      }
      wx.removeStorageSync(PENDING_KEY)
    }
    this.setData(patch)
  },
  addMoreInput: function () {
    var tempAdvice = this.data.advice.slice()
    var check = false
    for (var i = 0; i < tempAdvice.length; i++) {
      if (tempAdvice[i] == '' || tempAdvice[i] == null) {
        check = true
        break
      }
    }
    if (check) {
      wx.showModal({
        content: voice.EMPTY_SLOT,
        showCancel: false
      })
      return
    }
    tempAdvice.push('')
    this.setData({
      advice: tempAdvice
    })
  },
  delItem: function (e) {
    var id = Number(e.currentTarget.dataset.id)
    var self = this
    if (this.data.dissolvingIdx >= 0) {
      return
    }
    this.setData({
      dissolvingIdx: id
    })
    clearTimeout(this._dissolveTimer)
    this._dissolveTimer = setTimeout(function () {
      var tempList = self.data.advice
      var newList = []
      for (var i = 0; i < tempList.length; i++) {
        if (i === id) {
          continue
        }
        newList.push(tempList[i])
      }
      self.setData({
        advice: newList,
        dissolvingIdx: -1
      })
    }, dissolve.DURATION)
  },
  itemInput: function (e) {
    var tempList = this.data.advice.slice()
    tempList[e.target.id] = e.detail.value
    this.setData({
      advice: tempList
    })
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
    var options = []
    for (var i = 0; i < this.data.advice.length; i++) {
      if (this.data.advice[i] == '' || this.data.advice[i] == null) {
        continue
      }
      options.push(this.data.advice[i])
    }
    if (options.length < 2) {
      wx.showModal({
        content: voice.EMPTY_OPTION,
        showCancel: false
      })
      return
    }
    var record = decisionStore.add(this.data.subject, options)
    wx.navigateTo({
      url: 'result?id=' + record.id
    })
  }
})
