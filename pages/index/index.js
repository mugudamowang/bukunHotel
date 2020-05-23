//index.js
//获取应用实例
const app = getApp()
// 创建背景音乐实例
const audioCtx = getApp().globalData.global_bac_audio_manager.manage
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

    isShowArticle: false,
    is_play: false,
    playIndex: -1,

    viewing_time: 0,//曾播放的到的时长
    is_updataTime: false,//播放时间是否在变化

    // 正在播放的音乐信息,默认为第一首
    play: {
      currentTime: '0:00',
      currentSeconds:'0',
      duration: '00:00',
      title: '轻声细雨',
      singer: '',
      coverImgUrl: 'cloud://bukunhotel-rxvhp.6275-bukunhotel-rxvhp-1302029966/picture/细雨落叶.jpg'
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
  // audioCtx: null,
  onReady: function () {

  },
  //格式化时间
  formatTime: function (time) {
    var minute = Math.floor(time / 60) % 60;
    var second = Math.floor(time) % 60;
    return (minute < 10 ? + minute : minute) + ':' + (second < 10 ? '0' + second : second)
  },
  // 设置播放第几首歌
  setMusic: function (index) {
    let music = this.data.playlist[index]
    console.log(music)
    // // 解决背景音乐的bug，兼容安卓?????，官方的bug，不能在onload或者onready上设置title
    audioCtx.title = music.name
    audioCtx.epname = music.name
    audioCtx.singer = music.name

    // this.audioCtx.src=music.music_url
    audioCtx.src = "http://183.240.120.29/amobile.music.tc.qq.com/C400001KQ3zX0N2rVR.m4a?guid=185019120&amp;vkey=D8F7BFF89ECE89AC5D8DCCF7173413FEEC9F4D3BE51BC96DED7B66B6B50B9EB0D64F58987760909B62F71503AA4C2C06D8F1B7A93BEC0D56&amp;uin=0&amp;fromtag=66"
    // console.log(this.audioCtx)

    this.setData({
      playIndex: index,
      'play.title': music.name,
      'play.coverImgUrl': music.pic_url,
      'play.currentTime': '00:00'
    })

  },
  // 播放功能，对于播放条那里直接触发背景音乐实例的play，不用setMusic；对于图片点击就要用change来setMusic
  play: function () {
    // audioCtx.play();
    let that=this
   
      // 不确定要不要浮点化？？？？？？
      let viewing_time=parseFloat(that.data.viewing_time)
      // let viewing_time=parseFloat(that.data.viewing_time)
      // audioCtx.onTimeUpdate(()=>{
        // 判断当前时间是否为0，如果为0则不需要跳转直接更新进度
        console.log('曾经播放过的时间'+viewing_time)
        if(viewing_time!=0){
          // 跳转到暂停时存储的时间
          audioCtx.seek(viewing_time)
          that.currentTimeChange()
        }
        else{
          that.currentTimeChange()
        }

      // })
    

    // 正式开始播放
    wx.playBackgroundAudio()
    this.setData({
      is_play: true
    })
    // // 自动更新播放进度
    // audioCtx.onTimeUpdate(() => {
    //   this.setData({
    //     'play.duration': this.formatTime(audioCtx.duration),
    //     'play.currentTime': this.formatTime(audioCtx.currentTime)

    //   })
    //   // // 背景音乐播放完毕    // 播放结束时要做的事情是啥？？？？？？？
    //   // audioCtx.onEnded(()=>{
    //   //   setMusic(playIndex)
    //   //   this.play()

    //   // })

    //   // console.log(this.formatTime(audioCtx.currentTime)) 
    // });

  
  },
  // 暂停功能
  pause: function () {
    // audioCtx.pause();
    wx.pauseBackgroundAudio()
    this.setData({
      is_play: false
    })
    this.updateViewTime()
  },
  // 换歌

  change: function (e) {
    let current = e.currentTarget.dataset.index

    console.log('current是' + current, 'playIndex is' + this.data.playIndex)
    // 当点击的是同一首并且这首正在播放，则暂停
    if (this.data.playIndex == current && this.data.is_play == true) {
      this.pause()
      console.log("这一首暂停！")
      // 结束循环
      return;

    }
    //  // 当点击的是同一首并且这首正在暂停，则接着上一次的时间播放
    if(this.data.playIndex == current && this.data.is_play == false){
this.play()
console.log("又继续放这一首啦！")
    }
    //  换成其他歌曲
    else {
      this.setMusic(current)
      this.play()
      console.log("下一首啦！")
    }

  },
  // 更新播放过的时长
  updateViewTime: function () {
    this.data.viewing_time = this.data.play.currentSeconds
  },
  //当前音频时间发生变化时
  currentTimeChange: function () {
    // 可能存在的bug
    let self = this;

    // 自动更新播放进度
    audioCtx.onTimeUpdate(() => {
      self.setData({
        // 'play.duration': this.formatTime(audioCtx.duration),
        'play.currentTime': this.formatTime(audioCtx.currentTime),
        'play.currentSeconds': audioCtx.currentTime,
        // 正在更新时间
        is_updataTime:true

      })
      // // 背景音乐播放完毕
      // audioCtx.onEnded(()=>{
      //   setMusic(playIndex)
      //   this.play()

      // })

      // console.log(this.formatTime(audioCtx.currentTime)) 
    });
  }
  

})
