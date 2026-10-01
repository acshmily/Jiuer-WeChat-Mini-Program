const dealUntils = require('../../utils/dealOptionsUntils.js')
const decisionStore = require('../../utils/decisionStore.js')
const voice = require('../../utils/togameVoice.js')

Page({
  data: {
    subject: '',
    dealResult: [],
    top: null,
    voiceLine: '',
    verdictFlash: false
  },
  onLoad: function (option) {
    this.recordId = option.id
    this._barTimer = null
    this._flashTimer = null
    this.showRecord(decisionStore.get(this.recordId), false)
  },
  onUnload: function () {
    if (this._barTimer) {
      clearTimeout(this._barTimer)
      this._barTimer = null
    }
    if (this._flashTimer) {
      clearTimeout(this._flashTimer)
      this._flashTimer = null
    }
  },
  showRecord: function (record, rerolled) {
    if (!record) {
      wx.showModal({
        content: voice.MISSING_RECORD,
        showCancel: false,
        success: function () {
          wx.navigateBack()
        }
      })
      return
    }
    var ranked = dealUntils.rankByScore(record.items)
    var rows = []
    for (var i = 0; i < ranked.length; i++) {
      rows.push({
        option: ranked[i].option,
        score: ranked[i].score,
        isTop: i === 0,
        barWidth: 0
      })
    }
    var top = rows.length ? rows[0] : null
    var self = this
    this.setData({
      subject: record.subject,
      dealResult: rows,
      top: top,
      voiceLine: rerolled
        ? voice.rerollLine(top ? top.option : '')
        : voice.resultLine(top ? top.option : ''),
      verdictFlash: !!rerolled
    })
    if (this._barTimer) {
      clearTimeout(this._barTimer)
    }
    this._barTimer = setTimeout(function () {
      var animated = []
      for (var j = 0; j < rows.length; j++) {
        animated.push({
          option: rows[j].option,
          score: rows[j].score,
          isTop: rows[j].isTop,
          barWidth: rows[j].score
        })
      }
      self.setData({
        dealResult: animated
      })
      self._barTimer = null
    }, 40)
    if (rerolled) {
      if (this._flashTimer) {
        clearTimeout(this._flashTimer)
      }
      this._flashTimer = setTimeout(function () {
        self.setData({
          verdictFlash: false
        })
        self._flashTimer = null
      }, 520)
    }
  },
  reroll: function () {
    var record = decisionStore.reroll(this.recordId)
    this.showRecord(record, true)
  },
  returnBefore: function () {
    wx.navigateBack()
  }
})
