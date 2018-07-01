const dealUntils = require('../../utils/dealOptionsUntils.js')
const jtwUntil = require('../../utils/jwtUntil.js')
const httpUtil = require('../../utils/httpUntil.js')
const jwt = jtwUntil.getToken()
Page({
    data:{
        subject: '',
        dealResult : [],
        emjoi : ''
    },
    onLoad: function(option){
        console.info(option)
        //解析Json
        let jsonObj = JSON.parse(option.jsonData)
        console.info(jsonObj)
        this.setData({
            subject : jsonObj.subject,
            dealResult : jsonObj.dealResult,
            emjoi : dealUntils.randomEmoji()
        })
        //如果允许同步.则开始同步Post
        if (jsonObj.asyncStatus == 1){
            var body = new Object()
            body.subject = jsonObj.subject
            body.chooseList = jsonObj.dealResult
            httpUtil.putHttp('/api/user-sync/decisions',body,function(re){

            })
        }
    },
    returnBefore:function (e) {
        console.info(e)
        wx.navigateBack({
            url: '/pages/decisions/index'
        })
        // wx.navigateTo({
        //     url: '/pages/decisions/index'
        // })
    }

});