//index.js
//获取应用实例
var utils = require('../../utils/util.js')

Page({
  data: {
    
    tapAdd: false,
    star: 0, //页面戳
    vertical: false,
    duration: 500, //缓动
    currentTab: 0, //页面戳
    currentPage: 0, //分页加载使用
    loadAll: false, //加载全部
    isShowArticle: false, //页面显示
    lastDate: utils.formatTime(new Date),
    fixedDate: utils.formatTime(new Date), //矫正列表日期,记录第一次进入时首条博文的日期


    // po文信息
    postlist: [],
    // 用户信息
    userinfo: [],
    //音乐信息
    playlist: [],
    // playlist: [{
    //   _id: "",
    //   music_url: "",
    //   name: "",
    //   pic_url: ""
    // }], 
  },

  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },

  //事件处理函数

  onLoad: function () {
    this.getList(); //加载音乐列表
    this.scrolltolower(); //第一次加载先载入10条po文数据
    this.setUserInfor(); //设置用户信息
    
  },

  onPullDownRefresh: function () {
    const x = this.data.postlist.length-1
    this.data.lastDate = this.data.postlist[x].date
    this.getPlist()
    wx.stopPullDownRefresh()
  },

  //页面切换
  switchNav: function (e) {
    this.setData({
      star: e.detail.current
    });
  },

  //点击添加动画
  createPost: function (event) {
    this.setData({
      tapAdd: !this.data.tapAdd
    })
  },

  //设置用户信息
  setUserInfor() {
    const ui = wx.getStorageSync('userInfo')
    this.setData({
      userinfo: ui
    })
  },

  //博文刷新函数,添加时间大于当前第一条的新增记录
  getPlist() {
    wx.cloud.callFunction({
      name: 'getpList',
      data: {
        date: this.data.lastDate //当前最后一条数据的时间
      },
      success: res => {
        if (res.result) {
          this.setData({
            postlist: res.result.data,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '刷新失败XAX',
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: 'XAX~宕机',
        })
      }
    })
  },

  //首页加载函数
  getList() {
    //调用云函数getmList来获取播放列表
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

  //上拉加载更多
  scrolltolower: function () {
    wx.cloud.callFunction({
      name: 'loadMore',
      data: {
        fixedDate: this.data.fixedDate,
        currentPage: this.data.currentPage,
      },
      success: res => {
        if (res.result.data && res.result.data.length >= 0) {
          console.log("请求成功", res.result.data)
          this.data.currentPage++
          let postlist = this.data.postlist.concat(res.result.data)
          this.setData({
            postlist: postlist,
          })
          if (res.result.data.length < 10) {
            this.setData({
              loadAll: true //所有数据都加载完了
            })
          }
        }
      },
      fail: err => {
        this.setData({
          loadMore: false, //隐藏加载中。。
          loadAll: false //所有数据都加载完了
        })
        wx.showToast({
          title: 'XAX~宕机中',
        })
      }
    })
  },




})