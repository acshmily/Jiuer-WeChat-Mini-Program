const decisionStore = require('../../utils/decisionStore.js')
const voice = require('../../utils/togameVoice.js')
const sharePoster = require('../../utils/sharePoster.js')

Page({
  data: {
    subject: '',
    dealResult: [],
    top: null,
    voiceLine: '',
    verdictFlash: false,
    shareTitle: '',
    shareImagePath: '',
    posterBusy: false,
    createdAt: '',
    seed: 0
  },
  onLoad: function (option) {
    this.recordId = option.id
    this._barTimer = null
    this._flashTimer = null
    this._posterToken = 0
    try {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    } catch (e) {
      // 旧基础库忽略
    }
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
    var items = Array.isArray(record.items) ? record.items : []
    // 带原始下标排序：reroll 前后同名路 key 稳定，条形动画才能同节点过渡
    var ranked = items
      .map(function (item, i) {
        return { origin: i, option: item.option, score: item.score }
      })
      .sort(function (a, b) {
        return parseFloat(b.score) - parseFloat(a.score)
      })
    var rows = []
    for (var i = 0; i < ranked.length; i++) {
      rows.push({
        key: 'o' + ranked[i].origin,
        option: ranked[i].option,
        score: ranked[i].score,
        isTop: i === 0,
        barWidth: 0
      })
    }
    var top = rows.length ? rows[0] : null
    var voiceLine = rerolled
      ? voice.rerollLine(top ? top.option : '')
      : voice.resultLine(top ? top.option : '')
    var shareTitle = voice.shareTitle(
      top ? top.option : '',
      top ? top.score : '',
      record.subject
    )
    var self = this
    this.setData({
      subject: record.subject,
      dealResult: rows,
      top: top,
      voiceLine: voiceLine,
      verdictFlash: !!rerolled,
      shareTitle: shareTitle,
      shareImagePath: '',
      createdAt: record.createdAt || '',
      seed: record.seed != null ? record.seed : 0
    })
    if (this._barTimer) {
      clearTimeout(this._barTimer)
    }
    this._barTimer = setTimeout(function () {
      var animated = []
      for (var j = 0; j < rows.length; j++) {
        animated.push({
          key: rows[j].key,
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
    this.refreshPoster({
      subject: record.subject,
      top: top,
      items: rows,
      voiceLine: voiceLine,
      createdAt: record.createdAt || '',
      seed: record.seed != null ? record.seed : 0
    })
  },
  refreshPoster: function (snapshot, attempt) {
    var self = this
    var tries = attempt || 0
    var token = ++this._posterToken
    this.setData({ posterBusy: true })
    var payload = {
      subject: snapshot.subject,
      topOption: snapshot.top ? snapshot.top.option : '',
      topScore: snapshot.top ? snapshot.top.score : '0',
      items: snapshot.items || [],
      voiceLine: snapshot.voiceLine || '',
      createdAt: snapshot.createdAt || '',
      seed: snapshot.seed
    }
    // 等 canvas 挂载；首次失败多为低端机首帧未渲染完，延迟一拍重试一次
    setTimeout(function () {
      sharePoster
        .exportTempPath(self, payload)
        .then(function (path) {
          if (token !== self._posterToken) return
          self.setData({
            shareImagePath: path,
            posterBusy: false
          })
        })
        .catch(function () {
          if (token !== self._posterToken) return
          if (tries < 1) {
            self.refreshPoster(snapshot, tries + 1)
            return
          }
          self.setData({
            shareImagePath: '',
            posterBusy: false
          })
          wx.showToast({
            title: voice.SHARE_DRAW_FAIL,
            icon: 'none'
          })
        })
    }, tries === 0 ? 80 : 400)
  },
  onShareAppMessage: function () {
    var out = {
      title: this.data.shareTitle || voice.shareTitle('', '', this.data.subject),
      path: '/pages/decisions/index'
    }
    if (this.data.shareImagePath) {
      out.imageUrl = this.data.shareImagePath
    }
    return out
  },
  onShareTimeline: function () {
    var out = {
      title: this.data.shareTitle || voice.shareTitle('', '', this.data.subject)
    }
    if (this.data.shareImagePath) {
      out.imageUrl = this.data.shareImagePath
    }
    return out
  },
  onShareTap: function () {
    if (this.data.posterBusy) {
      wx.showToast({
        title: voice.SHARE_GENERATING,
        icon: 'none'
      })
    }
  },
  savePoster: function () {
    var self = this
    if (this.data.posterBusy) {
      wx.showToast({
        title: voice.SHARE_GENERATING,
        icon: 'none'
      })
      return
    }
    if (!this.data.shareImagePath) {
      wx.showToast({
        title: voice.SHARE_DRAW_FAIL,
        icon: 'none'
      })
      return
    }
    this.ensureAlbumAuth(function (ok) {
      if (!ok) return
      wx.saveImageToPhotosAlbum({
        filePath: self.data.shareImagePath,
        success: function () {
          wx.showToast({
            title: voice.SHARE_SAVE_OK,
            icon: 'none'
          })
        },
        fail: function () {
          wx.showToast({
            title: voice.SHARE_SAVE_FAIL,
            icon: 'none'
          })
        }
      })
    })
  },
  ensureAlbumAuth: function (done) {
    wx.getSetting({
      success: function (res) {
        var auth = res.authSetting || {}
        if (auth['scope.writePhotosAlbum'] === true) {
          done(true)
          return
        }
        if (auth['scope.writePhotosAlbum'] === false) {
          wx.showModal({
            title: voice.SHARE_AUTH_TITLE,
            content: voice.SHARE_AUTH_DENY,
            confirmText: voice.SHARE_AUTH_OPEN,
            success: function (modalRes) {
              if (!modalRes.confirm) {
                done(false)
                return
              }
              wx.openSetting({
                success: function (settingRes) {
                  var ok = !!(settingRes.authSetting && settingRes.authSetting['scope.writePhotosAlbum'])
                  if (!ok) {
                    wx.showToast({
                      title: voice.SHARE_AUTH_DENY,
                      icon: 'none'
                    })
                  }
                  done(ok)
                },
                fail: function () {
                  done(false)
                }
              })
            }
          })
          return
        }
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function () {
            done(true)
          },
          fail: function () {
            wx.showToast({
              title: voice.SHARE_AUTH_DENY,
              icon: 'none'
            })
            done(false)
          }
        })
      },
      fail: function () {
        done(false)
      }
    })
  },
  reroll: function () {
    var record = decisionStore.reroll(this.recordId)
    this.showRecord(record, true)
  },
  returnBefore: function () {
    wx.navigateBack()
  }
})
