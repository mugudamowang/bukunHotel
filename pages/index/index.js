//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

    //用户信息
    currentTab: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //音乐信息
    playlist: [],
    // playlist: [{
    //   _id: "",
    //   music_url: "",
    //   name: "",
    //   pic_url: ""
    // }],
    isShowArticle: false
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
    this.getList();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getList() {
    let that = this;
    //调用云函数getmList来获取播放列表
    wx.cloud.callFunction({
      name: 'getmList',
      //成功
      success: res => {
        //如果返回的res中有result
        if (res.result) {
          let playlist = res.result.data;
          console.log(playlist, '这是获取到的数据');
          //如果result为null
          if (playlist === undefined || playlist.length === 0) {
            wx.showToast({
              title: '没有数据',
            })
          }
          //如果result中有数据,则设置data
          else {
            that.setData({
              isShowArticle: true,
              playlist: res.result.data,
            }),
              console.log(that, that.data.playlist, '这是设置到data里的数据', that.data.isShowArticle)
          }
        }
        //如果返回的res没有result
        else {
          wx.showToast({
            title: '没有数据',
          })
        }



      },
      fail: err => {
        wx.showToast({
          title: '没有数据',
        })
      }
    });
  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList();
},
})
