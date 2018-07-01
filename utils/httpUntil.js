const jtwUntil = require('../utils/jwtUntil.js')
const jwt = jtwUntil.getToken()
/**
 * http封装
 */
function postHttp(path, data, callback){
  var respone  = wx.request({
      url: getApp().globalData.SERVICE_URL+path,
      header: {
        'Authorization': `Bearer ${jtwUntil.getToken()}`
      },
      data: data,
      method:'POST',
      success: function (re){

        return typeof callback == "function" && callback(re)
        
      },
      fail: function (re){

        return typeof callback == "function" && callback(re)
       
      }
      
    })
    //return respone
}
function getHttp(path,callback){
  console.info("获取当前token:"+ jwt);
  var respone = wx.request({
    url: getApp().globalData.SERVICE_URL + path,
    header: {
      'Authorization': `Bearer ${jtwUntil.getToken()}`
    },
    method:'GET',
    success:function(re){
      

      return typeof callback == "function" && callback(re)
    },
    fail: function (re){
      

      return typeof callback == "function" && callback(re)
    }
  })
  //return respone
}
function delHttp(path,callback){
  wx.request({
    url: getApp().globalData.SERVICE_URL + path,
    header: {
      'Authorization': `Bearer ${jtwUntil.getToken()}`
    },
    method:'DELETE',
    success: function (re){

      return typeof callback == "function" && callback(re)
    },
    fail: function (re){

      return typeof callback == "function" && callback(re)
    }
  })
}
function putHttp(path, data, callback){
  
  var res = wx.request({
    url: getApp().globalData.SERVICE_URL + path,
    header: {
      'Authorization': `Bearer ${jtwUntil.getToken()}`
    },
    method: 'PUT',
    data:data,
    success: function (re) {
    
      return typeof callback == "function" && callback(re)
      
    },
    fail: function (re) {
      return typeof callback == "function" && callback(re)
    }
  })
 

}
module.exports.postHttp = postHttp
exports.getHttp = getHttp
exports.putHttp = putHttp
exports.delHttp = delHttp