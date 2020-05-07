//app.js
App({
  onLaunch: function () {

    //我的云开发环境
    // wx.cloud.init({
    //   env: "test233",
    //   traceUser: true
    // })

    //你的云开发
    wx.cloud.init({
      env: "bukunhotel-rxvhp",
      traceUser: true,

    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  
   
  
  },
  globalData: {
    userInfo: {},
    // 当前是静态数据-----------------------------------------
    datalist:[
      {
        id : "0233",
        post : "谁给你写诗?"
      },
      {
        id : "0404",
        post : "海星如何睡觉?"
      },
      {
        id : "0618",
        post : "hhh"
      },
      {
        id : "1010",
        post : "covid19给爷爬"
      },
      {
        id : "8856",
        post : "高三加油"
      },
      {
        id : "1010",
        post : "covid19给爷爬"
      },
      {
        id : "8856",
        post : "高三加油"
      }
    ],
    //----------------------------------------------

  }
})