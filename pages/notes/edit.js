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
    this._saving = false
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
  onUnload: function () {
    clearTimeout(this._dissolveTimer)
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
    if (this._saving || this.data.dissolving) {
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
    this._saving = true
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
      title: voice.MODAL_ERASE_TITLE,
      content: voice.ERASE_NOTE,
      confirmText: voice.MODAL_ERASE_CONFIRM,
      confirmColor: '#A83232',
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
