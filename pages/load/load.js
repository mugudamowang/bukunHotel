// pages/load/load.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classlist:["guide1","guide2","guide3"],
    userInfo:{},
    openId: "",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  next: () => {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  
    //生命周期函数--监听页面加载 
    
    onLoad: function (options) {

      var that = this;
      // 查看是否授权
      wx.getSetting({
        success: (res) =>{
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            // const ui = wx.getStorageSync('userInfo') 查看缓存
            wx.getUserInfo({
              success:(res) =>{
                this.next()
              }
            })
          }
        }
      })
    },

    bindGetUserInfo : function(e){

      //login云函数
      wx.cloud.callFunction({
        name: "login",
        success: (res) => {
          console.log("调用成功")
          this.setData({
            openId: res.result.openid,
            userInfo: e.detail.userInfo
          })
          this.data.userInfo.openId = this.data.openId
          wx.setStorageSync('userInfo', this.data.userInfo)//保存到缓存
        }
      })
      this.next()
    }
})
