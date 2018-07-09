const jtwUntil = require('../../utils/jwtUntil.js')
const jwt = jtwUntil.getToken()
const httpUntil = require('../../utils/httpUntil')
const app = getApp()
Page({
    data:{
        title : '相关类型关联产品',
        itemList:[],
        pageNum :0, //定义起始页面
        firstPage :true,
        lastPage :false,
        navigationBarTitleText:'',
        tagId: 0
    },
    onLoad:function(data){
        //加载行为
        console.info("收到请求:"+data.id)
        var that =this
        var tempList = []
        httpUntil.getHttp("/infanta/category/"+data.id,function (re) {
            //console.info(re)
            if(re.statusCode == 200){
                //渲染行为
                //var content = JSON.parse(re.data)
                console.info(re.data.content)
                for(var i = 0 ;i < re.data.content.length ; i++){
                    var itemBean = Object()
                    itemBean.id = re.data.content[i].id
                    itemBean.title = re.data.content[i].title
                    itemBean.album = re.data.content[i].album
                    itemBean.brandName = re.data.content[i].brandId.brandName
                    itemBean.typeName = re.data.content[i].typeId.typeName
                    itemBean.country = re.data.content[i].brandId.country
                    tempList.push(itemBean)
                    console.info(itemBean)
                }
                console.info("pageNum :re.data.number:"+re.data.number)
                that.setData({
                    itemList : tempList,
                    firstPage : re.data.first,
                    lastPage : re.data.last,
                    pageNum :re.data.number,
                    tagId : data.id
                })
            }
        })
    },
    loadMore:function(e){
        console.info("load More")
        var pageNum = this.data.pageNum+1
        console.info("pageNum:"+pageNum)
        var that = this
        var tempList = this.data.itemList

        // show Loading
        if(this.data.lastPage){
            wx.showToast({
                title: '这是最后一页',
                icon: 'success',
                duration: 3000
            });
            return
        }
        httpUntil.getHttp("/infanta/category/"+this.data.tagId+"?page="+pageNum,function (re) {
            if(re.statusCode == 200){
                //渲染行为
                //var content = JSON.parse(re.data)
                console.info(re.data.content)
                for(var i = 0 ;i < re.data.content.length ; i++){
                    var itemBean = Object()
                    itemBean.id = re.data.content[i].id
                    itemBean.title = re.data.content[i].title
                    itemBean.album = re.data.content[i].album
                    itemBean.brandName = re.data.content[i].brandId.brandName
                    itemBean.typeName = re.data.content[i].typeId.typeName
                    itemBean.country = re.data.content[i].brandId.country
                    tempList.push(itemBean)
                    console.info(itemBean)
                }
                that.setData({
                    itemList : tempList,
                    firstPage : re.data.first,
                    lastPage : re.data.last,
                    pageNum :re.data.number
                })
                wx.hideLoading()
            }

        })
        wx.showLoading({
            title: '努力加载中',
        })
        setTimeout(function(){
            wx.hideLoading()
        },5000)

    }
})