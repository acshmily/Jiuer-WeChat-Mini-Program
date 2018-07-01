const dealUntils = require('../../utils/dealOptionsUntils.js')
const jtwUntil = require('../../utils/jwtUntil.js')
const jwt = jtwUntil.getToken()
Page({
    data: {
        asyncStatus: 1,// 定义同步状态
        subject: '',
        advice: ['', ''],
        dealResult : []
    },
    onLoad:function(){
        console.info("reload")
        this.setData({
            asyncStatus: 1,// 定义同步状态
            subject: '',
            advice: ['', ''],
            dealResult : []
        })
    },
    asyncSwitch: function (e) {
        var that = this
        var status = 1
        //console.info(e.detail.value);
        if (e.type != "change") {
            return
        }

        if (e.detail.value == false) {
            status = 0
        } else {
            status = 1
        }
        that.setData({
            asyncStatus: status
        })
    },
    addMoreInput: function (e) {
        var tempAdvice = this.data.advice
        var check = false
        console.info(tempAdvice)
        tempAdvice.forEach(function (v) {
            console.info(v)
            if (v == "" || v == null) {
                check = true
            }
        })
        if (check) {
            console.info("有元素为空")
            wx.showModal({
                content: '不许空着哦>_<',
                showCancel: false,
            });
            return
        }
        tempAdvice.push('')
        console.info(e);
        this.setData({
            advice: tempAdvice
        })
    },
    delItem: function (e) {
        console.info(e)
        var tempList = this.data.advice
        var newList = []
        for (var i = 0;i<tempList.length;i++){
            if(i == e.target.id){
                continue
            }
            newList.push(tempList[i])
        }
        this.setData({
            advice: newList
        })
    },
    itemInput: function (e) {
        //console.info(e)
        var tempList = this.data.advice
        tempList[e.target.id] = e.detail.value
        console.info(tempList)
        // this.setData({
        //     advice : tempList
        // })
        this.setData({
            advice: tempList
        })
    },
    doChoose:function(e){
        var that = this
        var advice = []
        var base = ''
        var total_weight = 0
        var weight  = 0
        var effectOptionValues = 0
        const MINEFFECTNUM = 2
        //过滤空选项
        for(var i = 0; i< this.data.advice.length ; i++){
            if(this.data.advice[i] == '' || this.data.advice[i] == null ){
                continue
            }
            effectOptionValues = effectOptionValues + 1
            //advice.push(this.data.advice[i])
            base = jwt+'|'+this.data.subject+'|'+this.data.advice[i]+'|'+Date.now()

            weight = dealUntils.dealOptions(base)<0 ? dealUntils.dealOptions(base) * 0xffffffff:dealUntils.dealOptions(base)

            advice.push({
                'option':this.data.advice[i],
                'weight':weight
            })
            total_weight  += weight
            advice.sort(dealUntils.objectArraySort('weight'))
        }
        if(effectOptionValues < MINEFFECTNUM){
            wx.showModal({
                content: '决策备选必须填写2个及以上哦',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            });
            return
        }


        // 为每个选项计算一个1~10000的分数，并保证总和为10000
        var score_fix = 10000
        for (var i = 0; i<advice.length ; i++  ){
            advice[i]['score'] =  advice[i]['weight'] * 10000 / total_weight
            console.info(advice[i]['score'])
            score_fix -=  advice[i]['score']
        }
        if (score_fix != 0){
            advice[advice.length -1 ]['score'] += score_fix
        }
        advice.sort(dealUntils.objectArraySort('score'))
        for(var i = 0 ;i<advice.length ; i++){
            advice[i]['score'] = advice[i]['score']/ 100.0
            advice[i]['score'] = advice[i]['score'].toFixed(2)
        }
        this.setData({
            dealResult : advice
        })
        console.info(advice)
            //跳转结果页面
        let data = JSON.stringify(this.data)
        wx.navigateTo({
            url: 'result?jsonData='+data
        })
    },
    subjectInput:function(e){
        this.setData({
            subject : e.detail.value
        })
    }



})