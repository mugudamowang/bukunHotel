//index.js
//获取应用实例


Page({
  data: {
    tapAdd: false,
    star: 0,


    vertical: false,
    duration: 500,
    currentTab: 0,
    currentPage: 0, //分页加载使用
    loadMore: false,
    loadAll: false,

    // po文信息
    postlist: [],
    //postlist:[{
    // id:'',
    // post:''
    // }]

    userinfo: [],
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

  onLoad: function () {
    this.getList();
    this.setUserInfor();
    // console.log(utils.formatTime(new Date))
  },


  switchNav: function (e) {
    this.setData({
      star: e.detail.current
    });
  },

  createPost: function (event) {
    this.setData({
      tapAdd: !this.data.tapAdd
    })
  },

  setUserInfor() {
    const ui = wx.getStorageSync('userInfo')
    this.setData({
      userinfo: ui
    })
  },

  getList() {
    //调用云函数getpList来获取po列表
    //调用云函数getmList来获取播放列表
    wx.cloud.callFunction({
        name: 'getpList',

        success: res => {

          //如果返回的res中有result
          if (res.result) {

            let postlist = res.result.data;
            //如果result为null
            if (postlist === undefined || postlist.length === 0) {
              wx.showToast({
                title: 'nothing~QAQ',
              })
            }
            //如果result中有数据,则设置data
            else {
              this.setData({
                postlist: res.result.data,
              })
            }
          }
          //如果返回的res没有result
          else {
            wx.showToast({
              title: 'XAX',
            })
          }
        },
        fail: err => {
          wx.showToast({
            title: 'XAX~宕机',
          })
        }

      }),

      wx.cloud.callFunction({
        name: 'getmList',
        //成功
        success: res => {
          //如果返回的res中有result
          if (res.result) {
            let playlist = res.result.data;
            //如果result为null
            if (playlist === undefined || playlist.length === 0) {
              wx.showToast({
                title: '没有数据',
              })
            }
            //如果result中有数据,则设置data
            else {
              this.setData({
                isShowArticle: true,
                playlist: res.result.data,
              })
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
    wx.stopPullDownRefresh()
  },

  scrolltolower: function () {

    wx.cloud.callFunction({
      name: 'loadMore',
      data: {
        currentPage: this.data.currentPage,
      },
      success: res => {
        if (res.result.data && res.result.data.length > 0) {
          console.log("请求成功", res.result.data)
          this.data.currentPage++
          let postlist = this.data.postlist.concat(res.result.data)
          this.setData({
            postlist: postlist,
            loadMore: false,
          })
          if (res.result.data.length < 10) {
            this.setData({
              loadMore: false, //隐藏加载中。。
              loadAll: true //所有数据都加载完了
            })
          }
        }
      },
      fail: err => {
        that.setData({
          loadMore: false, //隐藏加载中。。
          loadAll: false //所有数据都加载完了
        })
        wx.showToast({
          title: 'XAX~宕机中',
        })
      }
    })

  }

})