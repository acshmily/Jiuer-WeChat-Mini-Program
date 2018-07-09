const jtwUntil = require('../../utils/jwtUntil.js')
const jwt = jtwUntil.getToken()
const httpUntil = require('../../utils/httpUntil')
const app = getApp()
Page({
    data:{
        title : '标题',
        brandInfo : Object(),
        typeInfo : Object(),
        tagCollect : [],
        context : Object(),
        picUrl :[],
        navigationBarTitleText:''

    },
    onLoad:function(query){
        ///console.info(query)
        var that = this
        var context
        var tags
        //  "/infanta/item/3b39ea007bbc11e8998856000080062f"+query.id
        httpUntil.getHttp("/infanta/item/"+query.id,function (re) {
            console.info(re.data.versionId.context)
            context = JSON.parse(re.data.versionId.context)
            context.colours = context.colours.replace(',','');
            wx.setNavigationBarTitle({
                title: re.data.title//页面标题为路由参数
            })
            that.setData({
                title : re.data.title,
                brandInfo : re.data.brandId,
                typeInfo : re.data.typeId,
                tagCollect : re.data.tagCollect,
                context : context,
                picUrl :context.picurl

            })
        })

    }

})