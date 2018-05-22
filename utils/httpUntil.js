const jtwUntil = require('../utils/jwtUntil.js')
const jwt = jtwUntil.getToken()
/**
 * http封装
 */
function postHttp(path,data){
    wx.request({
      url: getApp().globalData.SERVICE_URL+path,
      header: {
        'Authorization': `Bearer ${jwt}`
      },
      data: data,
      method:'POST',
      success:re=>{
        return re
      },
      fail:re=>{
        return re
      }
      
    })
}
function getHttp(path){
  wx.request({
    url: getApp().globalData.SERVICE_URL + path,
    header: {
      'Authorization': `Bearer ${jwt}`
    },
    method:'GET',
    success:re=>{
      return re
    },
    fail:re=>{
      return re
    }
  })
}
function delHttp(path){
  wx.request({
    url: getApp().globalData.SERVICE_URL + path,
    header: {
      'Authorization': `Bearer ${jwt}`
    },
    method:'DELETE',
    success:re=>{
      return re
    },
    fail:re=>{
      return re
    }
  })
}
function putHttp(path,data){
  wx.request({
    url: getApp().globalData.SERVICE_URL + path,
    header: {
      'Authorization': `Bearer ${jwt}`
    },
    method: 'PUT',
    data:data,
    success: re => {
      return re
    },
    fail: re => {
      return re
    }
  })
}
module.exports.postHttp = postHttp
exports.getHttp = getHttp
exports.putHttp = putHttp
exports.delHttp = delHttp