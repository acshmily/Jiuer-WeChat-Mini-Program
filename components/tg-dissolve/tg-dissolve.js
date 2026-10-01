const dissolve = require('../../utils/dissolve.js')

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: false
  },
  externalClasses: ['host-class'],
  properties: {
    playing: {
      type: Boolean,
      value: false,
      observer: 'onPlayingChange'
    },
    /** stack=整块面板；row=选项横排；row-stretch=列表横排撑满 */
    layout: {
      type: String,
      value: 'stack'
    },
    /** 碎片数量，默认 20 */
    count: {
      type: Number,
      value: 20
    }
  },
  data: {
    shards: [],
    burstReady: false
  },
  lifetimes: {
    detached: function () {
      this._clearReady()
    }
  },
  methods: {
    _clearReady: function () {
      if (this._readyTimer) {
        clearTimeout(this._readyTimer)
        this._readyTimer = null
      }
    },
    onPlayingChange: function (playing) {
      this._clearReady()
      if (!playing) {
        this.setData({
          shards: [],
          burstReady: false
        })
        return
      }
      var count = this.properties.count || 20
      var self = this
      this.setData({
        shards: dissolve.buildShards(count),
        burstReady: false
      })
      // 下一拍再加 is-fly，触发 transition
      this._readyTimer = setTimeout(function () {
        self.setData({
          burstReady: true
        })
      }, 30)
    }
  }
})
