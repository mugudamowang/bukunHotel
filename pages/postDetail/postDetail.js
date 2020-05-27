// pages/postDetail/postDetail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMessage: [],
    comlist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      topMessage: options
    })

    this.getComment()


  },

  getComment() {
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        postId: this.data.topMessage.id
      },

      success: res => {
        if (res.result) {
          let comlist = res.result.data;
          this.setData({
            comlist: res.result.data,
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: 'XAX~宕机',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    var that = this;
    
    // 数据加载完成后 延迟隐藏loading
    setTimeout(function () {
      that.setData({
        hidden: true
      })
    }, 500);
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
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getComment()
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