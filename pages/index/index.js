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
    loops: 0,//是否完整播放过一遍
    // 正在播放的音乐信息,默认为第一首
    play: {
      currentTime: '0:00',
      currentSeconds: 0,
      duration: 0,
      durationFormat: '0:00',
      totalTime: '0:00',
      totalSeconds: 0,
      title: '轻声细雨',
      singer: '',
      coverImgUrl: 'cloud://bukunhotel-rxvhp.6275-bukunhotel-rxvhp-1302029966/picture/细雨落叶.jpg'
    },

    // 闹钟信息
    is_clock:false,
    time: '12:01',
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
    audioCtx.coverImgUrl=music.pic_url
    audioCtx.src = music.music_url
    // audioCtx.src = "http://183.240.120.29/amobile.music.tc.qq.com/C400001KQ3zX0N2rVR.m4a?guid=185019120&amp;vkey=D8F7BFF89ECE89AC5D8DCCF7173413FEEC9F4D3BE51BC96DED7B66B6B50B9EB0D64F58987760909B62F71503AA4C2C06D8F1B7A93BEC0D56&amp;uin=0&amp;fromtag=66"
    // audioCtx.src = "http://183.240.120.18/amobile.music.tc.qq.com/C400002I3Nwa4f9xqA.m4a?guid=4680889107&amp;vkey=977534C2CDF8CB0B6EF5698D62EA45474AE69C7B31FE80E69E06EB3DD5F349FA2905A4DD5F2FD441352D3BDCD4C76E994709613D7F605F6E&amp;uin=115&amp;fromtag=66" 贝贝
    // audioCtx.src="http://183.240.120.29/amobile.music.tc.qq.com/C400000trBUk47EpIL.m4a?guid=4680889107&amp;vkey=481BF7496B76B8B8679384F83453766C5FFF3F996503230E81FDC5BD5D2BB81B09A7DE273C401CD31A3CB9AF446919B8D25F20DF054C5AEE&amp;uin=115&amp;fromtag=66" 光
    // console.log(this.audioCtx)

    // 如果是第一次播放，则初始化totalTime为0:00
    // if (this.data.loops == 0) {
    //   this.setData({
    //     playIndex: index,
    //     'play.title': music.name,
    //     'play.coverImgUrl': music.pic_url,
    //     'play.currentTime': '0:00',
    //     'play.totalTime': '0:00',
    //     'play.totalSeconds': 0

    //   })
    // }

    // 如果已经播放过了，则初始化时间为音乐当前的时间

    if (this.data.play.currentSeconds != 0) {
      this.setData({
        playIndex: index,
        'play.title': music.name,
        'play.coverImgUrl': music.pic_url,
        'play.currentTime': this.formatTime(this.data.play.currentSeconds),
        'play.currentSeconds': this.data.play.currentSeconds,
        'play.totalTime': '0:00',
        'play.totalSeconds': 0

      })
    }
    // 如果从未播放过，初始化为0:00
    else {
      this.setData({
        playIndex: index,
        'play.title': music.name,
        'play.coverImgUrl': music.pic_url,
        'play.currentTime': '0:00',
        'play.currentSeconds': 0,
        'play.totalTime': '0:00',
        'play.totalSeconds': 0

      })

    }
    
  },
  // 用于图片点击的播放
  play: function () {
    let that = this

    // 转化为浮点类型，因为一开始定义是string类型
    let viewing_time = parseFloat(that.data.viewing_time)

    let currentSeconds = this.data.play.currentSeconds
    let duration = this.data.play.duration
    // 如果当前时间离总时长还有一段距离 手动重新播放
    let num = duration - currentSeconds



    // 当缓冲的时间不为0且这首歌还未播放完
    if (viewing_time != 0 && currentSeconds < duration) {
      // 跳转到暂停时存储的时间
      console.log('11111 我暂停之后又能回到以前啦 viewing_time是 ' + viewing_time + 'currentSeconds是' + currentSeconds)
      // audioCtx.seek(viewing_time)
      audioCtx.seek(currentSeconds)



      that.currentTimeChange()

    }
    else {
      // wx.playBackgroundAudio()
      // that.setData({
      //   is_play: true,
  
      // })
      that.currentTimeChange()
      // return;

    }


    // 正式开始播放
    wx.playBackgroundAudio()
    // audioCtx.play()
    that.setData({
      is_play: true,

    })
   


  },
  
 
  // 暂停功能
  pause: function () {
    // audioCtx.pause();
    wx.pauseBackgroundAudio()
    this.setData({
      is_play: false
    })
    // this.updateViewTime()
    this.data.viewing_time = this.data.play.currentSeconds
  },
  // 换歌

  change: function (e) {
    let current = e.currentTarget.dataset.index

    console.log('current是' + current, 'playIndex is' + this.data.playIndex)
    // 当点击的是同一首并且这首正在播放，则暂停
    if (this.data.playIndex == current && this.data.is_play == true) {
      this.pause()
      console.log("这一首暂停！ ")
      // 结束循环
      return;

    }
    //  // 当点击的是同一首并且这首正在暂停，则接着上一次的时间播放
    if (this.data.playIndex == current && this.data.is_play == false) {
      //  乱加的试试看，但这是解决暂停后无法循环播放的关键
      // 不会吧  删除了就没法接着播放？？？
     
      // this.setMusic(this.data.playIndex) //这是可以循环的，关键就在于这一步重新设置了src

      // this.play3() 
      this.play()//这是可以继续播放的

      console.log("又继续放这一首啦！ ")


    }
    //  换成其他歌曲
    else {
      this.setMusic(current)
      this.play()
      // wx.playBackgroundAudio()
      console.log("下一首啦！")
    }

  },
  // 更新播放过的时长
  updateViewTime: function () {
    this.data.viewing_time = this.data.play.currentSeconds
  },
  //当前音频时间发生变化时
  currentTimeChange: function () {
    // 可能存在的bug？？
    // let self = this;
    let that = this
    //   // // 背景音乐播放完毕    // 播放结束时要做的事情是啥？？？？？？？


    audioCtx.onEnded(() => {
      console.log('我已经播放完啦 我要再次播放')
      // 放完后设置播放状态为不播放？？？？？？还是播放完后要更新一下时间
      let loops = this.data.loops + 1
      that.setData({
        loops: loops,
        // is_play:false
      })
      // 加上这句话在模拟器才能中正常
      that.updateViewTime()

      that.setMusic(that.data.playIndex)
      that.play()


      //  that.change(this.data.playIndex)
      console.log('又可以重新播放啦')
    })

    // 自动更新播放进度
    audioCtx.onTimeUpdate(() => {


      
    
        this.setData({
          'play.durationFormat': this.formatTime(audioCtx.duration),
          'play.duration': audioCtx.duration,
          'play.currentTime': this.formatTime(audioCtx.currentTime),
          'play.currentSeconds': audioCtx.currentTime,
          'play.totalTime': this.formatTime(audioCtx.currentTime),
          'play.totalSeconds': audioCtx.currentTime



        })
        let that = this

        // 转化为浮点类型，因为一开始定义是string类型
        let viewing_time = parseFloat(that.data.viewing_time)

        let currentSeconds = this.data.play.currentSeconds
        let duration = this.data.play.duration
        // 如果当前时间离总时长还有一段距离 手动重新播放
        let num = duration - currentSeconds

        // 用于设置即将播放完之后手动循环
        if (viewing_time != 0 && duration != 0 && currentSeconds != 0 && num < 1) {
          // 放完后设置播放状态为不播放？？？？？？还是播放完后要更新一下时间
          let loops = this.data.loops + 1
          that.setData({
            loops: loops,
            // is_play:false
          })
          // 加上这句话在模拟器才能中正常
          that.updateViewTime()

          that.setMusic(that.data.playIndex)
          that.play()


          //  //  that.change(this.data.playIndex)
          //  // 正式开始播放
          //  wx.playBackgroundAudio()
          //  // audioCtx.play()
          //  that.setData({
          //    is_play: true,

          //  })
          //  console.log('又可以重新播放啦')
          //  that.currentTimeChange()
          //  return;
        }



      
      



    });
  },
  // 开启闹钟
  setClock:function(){
    this.setData({
      is_clock:true
    })
  },
  bindTimeChange: function (e) {

    // let 
    // let nowTime=now.

    let setTime= e.detail.value
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time
    })
    let timer=setTimeout(() => {

      this.pause()
    }, 6000);
    
  }


})
