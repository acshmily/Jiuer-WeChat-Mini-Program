/**
 * 获取jwt
 */
function getToken() {
  var _jwt = wx.getStorageSync('jwt')
  console.info("获取存储的token:"+_jwt)
  
  return _jwt
}
function getExprise(){
  return wx.getStorageSync('jwtExprise')
}
/**
 * 设置jwt
 */
function setToken(token) {
  var _token = JSON.stringify(token)
  var _date = new Date()

  wx.setStorageSync('jwt', token)
  wx.setStorageSync('jwtExprise', _date.getTime() + 60*60*1000*23)
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
      if(re.statusCode == 200){
        setToken(re.data)
      }else{
        wx.showToast({
          title: '刷新token失败,请稍后重试',
          icon: 'loading',
          duration: 2000
        })
      }
    }
  })
}
module.exports.getToken = getToken
exports.setToken = setToken
exports.refresh = refresh
exports.getExprise = getExprise
