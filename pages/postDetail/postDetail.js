// pages/postDetail/postDetail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMessageId: [],
    topMessage: [],
    comlist: [],
    load: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.postid==""){
      wx.showToast({
        icon: 'none',
        title: 'XAX不存在该博文',
      })
    }
    this.setData({
      topMessageId: options.postid
    })

    this.getComment()

  },

  getComment() {

    wx.cloud.callFunction({
      name: 'getpList',
      data: {
        postId: this.data.topMessageId
      },
      success: res => {
        if (res.result) {
          this.setData({
            topMessage: res.result.data,
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: 'XAX~宕机',
        })
      }
    })

    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        postId: this.data.topMessageId
      },
      success: res => {
        if (res.result) {
          this.setData({
            comlist: res.result.data,
            load: true,
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
    // 数据加载完成后 延迟隐藏loading
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
    wx.showLoading({
      title: '。。。注水中',
    })
    this.getComment()
    setTimeout(function(){
      wx.hideLoading()
    },1000)
    wx.stopPullDownRefresh()
    
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