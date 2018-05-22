const psUtil = require('../../utils/passwordUntil.js')
const httpUtil = require('../../utils/httpUntil.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["生成密码", "本地密码", "云端密码"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    switchRandomPass: false,
    psubject: '',
    psercue: '',
    subjectInputCssAppend: '',
    secureInputCssAppend: '',
    LocalPasswordList:[]
  },
  onLoad: function () {
    var that = this;
    //console.info(psUtil.getLocalPasswordList())
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          LocalPasswordList : psUtil.getLocalPasswordList()
        });
      }
    });
    
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    console.info(e)
  },
  /**
   * 绑定注册主题值
   */
  psubjectInput: function (e) {
    this.setData({
      psubject: e.detail.value,
    })
    if (e.detail.value.length > 0) {
      this.setData({
        subjectInputCssAppend: '',
      })
    }
  },
  psercueInput: function (e) {
    this.setData({
      psercue: e.detail.value,
    })
    if (e.detail.value.length > 0) {
      this.setData({
        secureInputCssAppend: '',
      })
    }
  }, switchChange: function (e) {
    console.log('快速生成发生change事件，携带value值为：', e.detail.value);
    //获取值,当为true的时候隐藏相关信息
    this.setData({
      switchRandomPass: e.detail.value
    })
  },
  makeRandomPassword: function (e) {
    console.info("按钮事件" + e)
    var subject = ''
    var sercue = ''
    var password = ''
    var checkValue = true
    if (this.data.switchRandomPass) {
      //快速构建
      subject = psUtil.randomString()
      sercue = psUtil.randomString()
      console.info("subject:" + subject + ",sercue:" + sercue)
    } else {
      subject = this.data.psubject
      sercue = this.data.psercue
      console.info("subject:" + subject + ",sercue:" + sercue)
      if (subject.length <= 0) {
        this.setData({
          subjectInputCssAppend: 'weui-cell_warn'
        })
        checkValue = false
      }
      if (sercue.length <= 0) {
        this.setData({
          secureInputCssAppend: 'weui-cell_warn'
        })
        checkValue = false
      }
      if (!checkValue) {
        return
      }
    }
    //执行算法(pwd,host)
    password = psUtil.theMotherSaidVariableNameMustBeLongForBuildPassword(sercue + psUtil.randomString(4),subject)
    console.info("生成:" + password)
    if (password.length > 0 && this.data.switchRandomPass){
      //调出modal
        wx.showModal({
          title: '一次性密码生成完毕',
          content: password,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
    } else if (password.length > 0 && this.data.switchRandomPass == false ){
      psUtil.addLocalPassword(subject,password)
      //调出modal
      wx.showModal({
        title: '密码生成结果,并保存本地',
        content: password,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      this.setData({
        LocalPasswordList: psUtil.getLocalPasswordList()
      })
    }
  },
  /**
   * 查看密码操作
   */
  queryPassowrd: function(e){
    //console.info("获取本地id:" + e.currentTarget.id)
    var id = e.currentTarget.id
    var obj = psUtil.getLocalPasswordListById(id)
    //展示modal
    wx.showModal({
      title: obj.subject,
      content: obj.password,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  },
  operationPassword:function(e){
    var id = e.currentTarget.id
    var that = this;
    wx.showActionSheet({
      itemList: ['同步', '删除'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0){
            console.info("判断是否同步:" + psUtil.checkPasswordSync(id))
            //判断是否已经同步
            if (!psUtil.checkPasswordSync(id)){
              var httpStatus = true
              console.info("开启云同步")
              //构造请求对象
              var psObj = psUtil.getLocalPasswordListById(id)
              var body = new Object()
              body.subject = psObj.subject
              body.password = psObj.password
              try {
                httpUtil.putHttp("/api/password",body)
                }catch(e){
                  wx.showToast({
                    title: '同步失败,请稍候重试',
                    icon: 'success',
                    duration: 3000
                  });
                  httpStatus = false
                }
              if (httpStatus){
                  psUtil.setPasswordSync(id)
                  wx.showToast({
                    title: '已完成',
                    icon: 'success',
                    duration: 3000
                  });
              }
            }else{
              //该条已同步,不作处理
              console.info("该条已同步,不作处理")
              wx.showToast({
                title: '已完成',
                icon: 'success',
                duration: 3000
              });
            }

          }else if(res.tapIndex == 1){
            console.info("删除本条数据:"+id)
            psUtil.removeLocalPasswordById(id)
            //操作成功提醒
            wx.showToast({
              title: '已完成',
              icon: 'success',
              duration: 3000
            });
            console.info("刷新数据")
           
          }else{
            console.info("do nothing ..")
          }
          that.setData({
            LocalPasswordList: psUtil.getLocalPasswordList()
          })
        }
    
      }
      
    });
   
    
  }
});