const noteStore = require('../../utils/noteStore.js')
const voice = require('../../utils/togameVoice.js')
const dissolve = require('../../utils/dissolve.js')

var TAG_OPTIONS = [
  { label: '人', key: 'ren' },
  { label: '局', key: 'ju' },
  { label: '险', key: 'xian' }
]

Page({
  data: {
    id: '',
    isEdit: false,
    body: '',
    tag: '局',
    tags: TAG_OPTIONS,
    dissolving: false
  },
  onLoad: function (query) {
    var id = query && query.id ? String(query.id) : ''
    if (!id) {
      this.setData({
        id: '',
        isEdit: false,
        body: '',
        tag: '局',
        dissolving: false
      })
      return
    }
    var note = noteStore.get(id)
    if (!note) {
      wx.showModal({
        content: voice.MISSING_NOTE,
        showCancel: false,
        success: function () {
          wx.navigateBack()
        }
      })
      return
    }
    this.setData({
      id: note.id,
      isEdit: true,
      body: note.body,
      tag: note.tag,
      dissolving: false
    })
  },
  pickTag: function (e) {
    this.setData({
      tag: e.currentTarget.dataset.tag
    })
  },
  bodyInput: function (e) {
    this.setData({
      body: e.detail.value
    })
  },
  save: function () {
    if (this.data.dissolving) {
      return
    }
    var body = String(this.data.body || '').trim()
    if (!body) {
      wx.showModal({
        content: voice.NOTE_NEED_BODY,
        showCancel: false
      })
      return
    }
    if (this.data.isEdit) {
      noteStore.update(this.data.id, body, this.data.tag)
    } else {
      noteStore.add(body, this.data.tag)
    }
    wx.navigateBack()
  },
  remove: function () {
    var id = this.data.id
    var self = this
    if (!id || this.data.dissolving) {
      return
    }
    wx.showModal({
      title: '抹去',
      content: '抹去这条札记？抹了不回。',
      confirmText: '抹去',
      confirmColor: '#8B2E2E',
      success: function (res) {
        if (!res.confirm) {
          return
        }
        self.setData({
          dissolving: true
        })
        clearTimeout(self._dissolveTimer)
        self._dissolveTimer = setTimeout(function () {
          noteStore.remove(id)
          wx.navigateBack()
        }, dissolve.DURATION)
      }
    })
  }
})
