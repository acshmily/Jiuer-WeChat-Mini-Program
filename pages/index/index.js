//index.js
//获取应用实例
const app = getApp()

Page({
  login: function (event) {
    //进入九宫格
      wx.redirectTo({
        url:'../native/native'
      })

  }
})