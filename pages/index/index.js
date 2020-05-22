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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //音乐列表
    playlist: [],
    // playlist: [{
    //   _id: "",
    //   music_url: "",
    //   name: "",
    //   pic_url: ""
    // }],
    isShowArticle: false,
    state: 'paused',
    playIndex: 0,
    // 正在播放的音乐信息
    play:{
      currentTime:'00:00',
      duration:'00:00',
      title:'轻声细雨',
      singer:'',
      coverImgUrl:'cloud://bukunhotel-rxvhp.6275-bukunhotel-rxvhp-1302029966/picture/细雨落叶.jpg'
    }
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

  switchNav: function (e) {
    this.setData({ star: e.detail.current });
  },

  createPost: function (event) {

    this.setData({ tapAdd: !this.data.tapAdd })
    console.log(this.data.tapAdd)

    const post = "fuck you!!!"
    const ui = wx.getStorageSync('userInfo')
    console.log(ui.openId)
    if (!ui) {
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
  },
  audioCtx: null,
  onReady: function () {
    // let audioCtx=wx.getBackgroundAudioManager()
    // const backgroundAudioManager = wx.getBackgroundAudioManager()
    this.audioCtx = wx.getBackgroundAudioManager()
   

    let that = this
    // 播放失败检测,考虑要不要删除
    this.audioCtx.onError((error) => {
      console.log('播放失败' + that.audioCtx.src)
    })
    // 播放结束后再次重新播放！！！！！！！！！！！

   
  },
   //格式化时间
   formatTime:function(time){
    var minute = Math.floor(time/60)%60;
    var second = Math.floor(time) % 60;
    return(minute < 10 ? + minute:minute) + ':' + (second < 10? '0'+second:second)
  },
  // 设置播放第几首歌
  setMusic:function(index){
let music =this.data.playlist[index]
console.log(music)
 // // 解决背景音乐的bug，兼容安卓?????，官方的bug，不能在onload或者onready上设置title
 this.audioCtx.title=music.name
 this.audioCtx.epname=music.name
 this.audioCtx.singer=music.name

// this.audioCtx.src=music.music_url
this.audioCtx.src="http://183.240.120.29/amobile.music.tc.qq.com/C400001KQ3zX0N2rVR.m4a?guid=185019120&amp;vkey=D8F7BFF89ECE89AC5D8DCCF7173413FEEC9F4D3BE51BC96DED7B66B6B50B9EB0D64F58987760909B62F71503AA4C2C06D8F1B7A93BEC0D56&amp;uin=0&amp;fromtag=66"
// console.log(this.audioCtx)



this.setData({
  playIndex:index,
  'play.title':music.name,
  'play.coverImgUrl':music.pic_url,
  'play.currentTime':'00:00'
})

  },
  // 播放
  play:function(){
    // let audioCtx = wx.getBackgroundAudioManager()
    // audioCtx.src= 'cloud://bukunhotel-rxvhp.6275-bukunhotel-rxvhp-1302029966/Noble Music Project - 舒适的雨声.flac'
  
    // this.setData({
    //   state:'running'
    // })
// 音乐播放实例
//     const backgroundAudioManager = wx.getBackgroundAudioManager()

// backgroundAudioManager.title = '温泉'
// backgroundAudioManager.epname = '温泉'
// backgroundAudioManager.singer = '许嵩'
// backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
// // 设置了 src 之后会自动播放
// backgroundAudioManager.src = "http://183.240.120.29/amobile.music.tc.qq.com/C400001KQ3zX0N2rVR.m4a?guid=185019120&amp;vkey=D8F7BFF89ECE89AC5D8DCCF7173413FEEC9F4D3BE51BC96DED7B66B6B50B9EB0D64F58987760909B62F71503AA4C2C06D8F1B7A93BEC0D56&amp;uin=0&amp;fromtag=66"

// console.log('播放')
// backgroundAudioManager.play();
this.audioCtx.play();
    this.setData({
      state:'running'
    })
     // 自动更新播放进度
     this.audioCtx.onTimeUpdate(() => {
      this.setData({
'play.duration':this.formatTime(this.audioCtx.duration),
'play.currentTime':this.formatTime(this.audioCtx.currentTime)

      }),
      console.log(this.formatTime(this.audioCtx.currentTime))
     
    });
  },
  // 暂停
  pause:function(){
    this.audioCtx.pause();
    this.setData({
      state:'paused'
    })
  },
  // 换歌
  change:function(e){
    console.log(e)
    this.setMusic(e.currentTarget.dataset.index)
    this.play()
  }
   
})
