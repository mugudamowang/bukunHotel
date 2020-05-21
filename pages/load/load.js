// pages/load/load.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
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

    bindGetUserInfo(e) {

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
          console.log(this.data.userInfo)
          wx.setStorageSync('userInfo', this.data.userInfo)//保存到缓存
          
        }
      })

      wx.redirectTo({
        url: '/pages/load/load',
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
  
})
