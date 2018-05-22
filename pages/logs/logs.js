//logs.js
const util = require('../../utils/util.js')
const jwtutil = require('../../utils/jwtUntil.js')
var jwt = jwtutil.getToken()
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    console.info("获取jwt" + jwt)
    wx.request({
      url: 'http://127.0.0.1:8080/api/password',
      method:'POST',
      header:{
        'Authorization': `Bearer ${jwt}`
      },
      success :re =>{
        console.info(re)
      }
    })
  }
})
