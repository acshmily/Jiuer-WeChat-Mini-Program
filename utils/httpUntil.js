const jtwUntil = require('../utils/jwtUntil.js')
const jwt = jtwUntil.getToken()
/**
 * http封装
 */
function postHttp(path, data, callback){
  var respone  = wx.request({
      url: getApp().globalData.SERVICE_URL+path,
      header: {
        'Authorization': `Bearer ${jwt}`
      },
      data: data,
      method:'POST',
      success: function (re){

        return typeof callback == "function" && callback(re.data)
        
      },
      fail: function (re){

        return typeof callback == "function" && callback(re.data)
       
      }
      
    })
    //return respone
}
function getHttp(path,callback){
  var respone = wx.request({
    url: getApp().globalData.SERVICE_URL + path,
    header: {
      'Authorization': `Bearer ${jwt}`
    },
    method:'GET',
    success:function(re){
      

      return typeof callback == "function" && callback(re.data)
    },
    fail: function (re){
      

      return typeof callback == "function" && callback(re.data)
    }
  })
  //return respone
}
function delHttp(path,callback){
  wx.request({
    url: getApp().globalData.SERVICE_URL + path,
    header: {
      'Authorization': `Bearer ${jwt}`
    },
    method:'DELETE',
    success: function (re){

      return typeof callback == "function" && callback(re.data)
    },
    fail: function (re){

      return typeof callback == "function" && callback(re.data)
    }
  })
}
function putHttp(path, data, callback){
  
  var res = wx.request({
    url: getApp().globalData.SERVICE_URL + path,
    header: {
      'Authorization': `Bearer ${jwt}`
    },
    method: 'PUT',
    data:data,
    success: function (re) {
    
      return typeof callback == "function" && callback(re.data)
      
    },
    fail: function (re) {
      return typeof callback == "function" && callback(re.data)
    }
  })
 

}
module.exports.postHttp = postHttp
exports.getHttp = getHttp
exports.putHttp = putHttp
exports.delHttp = delHttp