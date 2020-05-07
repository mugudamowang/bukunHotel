//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tapAdd: false,
    star: 0,

    datalist: app.globalData.datalist,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    vertical: false,
    duration: 500,
    currentTab: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')

  },

  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // wx.getSystemInfo({
    //   success: (res) => {
    //     console.log("fuck")
    //     this.setData({
    //       viewwidth: res.windowWidth,
    //       viewheight: res.windowHeight
    //     })
    //     console.log(this.viewheight)
    //     console.log("you")
    //   },
    // })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  switchNav: function (e) {
    this.setData( { star: e.detail.current });
  },

  createPost: function(event) {

    this.setData({tapAdd: !this.data.tapAdd})
    console.log(this.data.tapAdd)

    const post = "fuck you!!!"
    const ui = wx.getStorageSync('userInfo')
    console.log(ui.openId)
    if(!ui){
      console.log("npoeoooooooo")
    }
    // wx.cloud.callFunction({
    //   name:"createPost",
    //   data:{
    //     post: post,
    //     date: Date.now(),
    //     openid: ui.openId
    //   }
    // })
  }

})