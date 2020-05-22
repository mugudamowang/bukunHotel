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


    console.log(this.data.topMessage.id)
    wx.cloud.callFunction({
        name: 'getComment',
        data:{
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