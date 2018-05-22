/**
 * 获取jwt
 */
function getToken() {
  var _jwt = wx.getStorageSync('jwt')
  console.info("获取存储的token:"+_jwt)
  //var jwt = JSON.parse(_jwt)
  //console.info("获取储存的jwt")
  return _jwt
}
/**
 * 设置jwt
 */
function setToken(token) {
  var _token = JSON.stringify(token)
  wx.setStorageSync('jwt', token)
}
function refresh(){
  var token = getToken()
  wx.request({
    url: getApp().globalData.SERVICE_URL+'/wx/refresh',
    header: {
      'Authorization': `Bearer ${getToken()}`
    },
    success :re=>{
      console.log("刷新成功")
      setToken(re.data)
    }
  })
}
module.exports.getToken = getToken
exports.setToken = setToken
exports.refresh = refresh
