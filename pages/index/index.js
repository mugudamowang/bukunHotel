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

    // 默认为夜间模式
    is_night: true,
    bgColor: '#000000',
    //音乐列表
    playlist: [],
    // 音乐缓存数组
    Cates: [],

    // 是否已经请求到数据
    isShowArticle: false,
    // 播放状态
    is_play: false,
    // 正在播放的索引，最开始为-1
    playIndex: -1,

    viewing_time: 0,//曾播放的到的时长
    is_updataTime: false,//播放时间是否在变化
    loops: 0,//是否完整播放过一遍
    is_first: true,//是否从未点击过图片
    is_first2: true,//还未点击图片就在播放条暂停了
    musicer: null,//音乐定时器 检测后台播放状态的按钮


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
      coverImgUrl: 'cloud://bukunhotel-rxvhp.6275-bukunhotel-rxvhp-1302029966/picture/new/aaaaa.jpg'
    },

    // 闹钟信息
    is_clock: false,
    Timeindex:0,
    TimeArray:['01  分','05  分','10  分','15  分','20  分','25  分','30  分','40  分','45  分', '50  分','55  分','60  分','90  分','120  分' ],
    timer: null, //闹钟定时器

    // 倒计时界面
    hideFlag: true,//true-隐藏  false-显示
    animationData: {},//动画
    countTime: '5:00',  //倒计时的时间
    countSeconds: 300,
   
    // 一言语句信息
    word: {

      hitokoto: "早睡早起身体好~",
      type: "f",
      from: "网络",
      from_who: null,
      creator: "Eric",


    },
    // 一言缓存信息
    Words: {}

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

  onLoad: function () {
    // 获取本地缓存的数据
    const Cates = wx.getStorageSync('cates')
    const Words = wx.getStorageSync('words')
    // 如果缓存没有数据，则发送请求
    if (!Cates || !Words) {
      this.getList()
      this.getWords()
      // console.log('我一次都没有加载过')
    }
    else {
      let time1 = Date.now() - Cates.time
      let time2 = Date.now() - Words.time
      // 如果有旧的数据，但是过期了就重新发送请求,过期时间为5分钟
      if (time1 > 300000 || time2 > 300000) {
        this.getList()
        this.getWords()
        // console.log('我的时间已经过期了')
      }
      // 如果有旧的数据并且没有过期，则从缓存中拿数据
      else {
        this.data.Cates = Cates.data
        this.data.Words = Words.data
        let playlist = this.data.Cates.map(v => v)
        let word = this.data.Words
        this.setData({
          isShowArticle: true,
          playlist,
          word
        })
        // console.log('我是缓存里的数据')


      }
    }

  },
// 云函数获取播放列表
  getList() {
    let that = this;
    //调用云函数getmList来获取播放列表
    wx.cloud.callFunction({
      name: 'getmList',
      //成功
      success: res => {
        //如果返回的res中有result
        if (res.result) {
// 为了防止模拟器报错加的，但是没有什么实际意义
          audioCtx.title = '  '
          audioCtx.epname = '  '
          audioCtx.singer = '  '

          let playlist = res.result.data;
          // 修改缓存数组Cates为返回的数据
          that.Cates = playlist
          //如果result为null
          if (playlist === undefined || playlist.length === 0) {
            wx.showToast({
              title: '没有数据',
            })
          }
          //如果result中有数据,则设置data
          else {
            // 将获取的数据存入到本地中
            wx.setStorageSync('cates', { time: Date.now(), data: that.Cates })
            that.setData({
              isShowArticle: true,
              playlist
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
  // 获取一言数据
  getWords: function () {
    let that = this

    wx.request({
      url: 'https://v1.hitokoto.cn/',

      success: (res) => {
        let word = res.data
        console.log(res.data)
        that.Words = res.data
        // 将获取的数据存入到本地中
        wx.setStorageSync('words', { time: Date.now(), data: that.Words })


        that.setData({
          word: {
            hitokoto: word.hitokoto,
            type: word.type,
            from: word.from,
            from_who: word.from_who,
            creator: word.creator

          }
        })
      }
    })
  },


  //监听手机后台的暂停和播放，修改播放状态
  onShow: function () {
    this.musicer=setInterval(()=>{
      // console.log('我是音乐定时器')

      // 在安卓用onStop无效
      audioCtx.onPause(()=>{
        this.setData({
          is_play:false
        })


      });
      audioCtx.onPlay(()=>{
        this.setData({
          is_play:true
        })

      });
    },2000)},
// 在页面卸载时关闭后台音乐定时器
  onUnLoad: function () {
    clearInterval(this.musicer)

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
    // // 解决背景音乐的bug，兼容安卓，官方的bug，不能在onload或者onready上设置title
    audioCtx.title = music.name
    audioCtx.epname = '  '
    audioCtx.singer = '  '
    audioCtx.coverImgUrl ='https://i.loli.net/2020/05/29/kjCgevWIV8sEMdT.jpg'  //统一专辑封面图片

    audioCtx.src = music.music_url  

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

    // 获得缓冲的时间，转化为浮点类型，因为一开始定义是string类型
    let viewing_time = parseFloat(that.data.viewing_time)
// 获得当前播放的秒数
    let currentSeconds = this.data.play.currentSeconds
    // 获得当前音乐的时长
    let duration = this.data.play.duration
    



    // 当缓冲的时间不为0且这首歌还未播放完，则跳转至之前的秒数
    if (viewing_time != 0 && currentSeconds < duration) {
      // 跳转到暂停时存储的时间
      // console.log('11111 我暂停之后又能回到以前啦 viewing_time是 ' + viewing_time + 'currentSeconds是' + currentSeconds)
      // audioCtx.seek(viewing_time)
      audioCtx.seek(currentSeconds)
      that.currentTimeChange()

    }
    // 否则不做任何操作
    else {
     
      that.currentTimeChange()
   

    }
    // 正式开始播放
    wx.playBackgroundAudio()
    // console.log('我播放啦')
    // audioCtx.play()
    that.setData({
      is_play: true,

    })




  },
  // 用于播放条的播放功能
  play2: function () {
    //  从来没有点击过图片就播放了
    if (this.data.is_first && this.data.is_first2) {
    // 默认设置第一首并播放
      this.setMusic(0)
      this.play()
      this.setData({
        is_first: false
      })

    }
    // 否则调用图片点击播放的方法
    else {
      this.play()
    }
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
    this.setData({
      is_first: false
    })
    let current = e.currentTarget.dataset.index

    // console.log('current是' + current, 'playIndex is' + this.data.playIndex)
    // 当点击的是同一首并且这首正在播放，则暂停
    if (this.data.playIndex == current && this.data.is_play == true) {
      this.pause()
      // console.log("这一首暂停！ ")
      // 结束循环
      return;

    }
    //  // 当点击的是同一首并且这首正在暂停，则接着上一次的时间播放
    if (this.data.playIndex == current && this.data.is_play == false) {
      

      // this.setMusic(this.data.playIndex) //这是可以循环的，关键就在于这一步重新设置了src，要循环则要重新设置src
      this.play()//这是可以继续播放的

      // console.log("又继续放这一首啦！ ")


    }
    //  换成其他歌曲
    else {
      this.setMusic(current)
      this.play()
     
      // console.log("下一首啦！")
    }

  },
  // 更新播放过的时长
  updateViewTime: function () {
    this.data.viewing_time = this.data.play.currentSeconds
  },
  //监听当前音频时间发生变化时
  currentTimeChange: function () {
    
    let that = this
    
  

    audioCtx.onEnded(() => {
      // console.log('我已经播放完啦 我要再次播放')
      // 放完后设置要更新一下缓冲时间
      let loops = this.data.loops + 1
      that.setData({
        loops: loops,
        
      })
      // 加上这句话在模拟器才能中正常
      that.updateViewTime()
// 放完后要重新设置src才能循环播放
      that.setMusic(that.data.playIndex)
      that.play()
      // console.log('又可以重新播放啦')
    })

    // 监听自动更新播放进度
    audioCtx.onTimeUpdate(() => {
// 不断改变播放的秒数
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
      if (duration != 0 && currentSeconds != 0 && num <= 1) {
        // 放完后设置播放要更新一下时间
        let loops = this.data.loops + 1
        that.setData({
          loops: loops,
         
        })
        // 加上这句话在模拟器才能中正常
        that.updateViewTime()

        that.setMusic(that.data.playIndex)
        that.play()

      }

    });

  },

  // 定时关闭功能
  bindPickerChange: function (e) {
    let that = this
    if (that.data.timer != null) {
      clearInterval(that.data.timer)
    }

    
    // 获得用户选择的时间
    let time = e.detail.value

    console.log(e.detail)
    console.log('picker发送选择改变，携带值为', e.detail.value)

    // console.log(e.detail)
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let time2=that.data.TimeArray[time]
    // console.log('选择的时间为'+time2)
    let time3=time2.slice(0,2)
    // console.log('切割后的时间'+time3)
    let time4=parseInt(time3.trim())
    // console.log('强制类型转换后的时间'+typeof time4)

    // 如果用户确定选择了时间并且播放状态已经在播放了
    if (time && this.data.is_play) {
      wx.showToast({
        title: '计时结束将停止',
      })
      this.setData({
        time,
        is_clock: true
      })

      // 用户设置的秒数
      let countSeconds = time4* 60
      let countTime = that.formatTime(countSeconds)
// 修改倒计时的秒数
      that.setData({
        countSeconds,
        countTime
      })


      // 展示模态框
      that.showModal()
      // 倒计时
      that.Numdown()

    }
// 否则提示用户先播放
    else {
      wx.showModal({
        title: '提示',
        content: '请先播放哦',
        confirmColor: '#576B95',
        cancelColor: '#e8e4e1'

      })
    }

  },
  // 倒计时的方法
  Numdown: function () {
    var that = this
    // 开启定时器倒计时，让秒数每隔1秒-1
    that.data.timer = setInterval(() => {
      let countSeconds = that.data.countSeconds
      countSeconds--
      that.setData({
        countSeconds: countSeconds,
        countTime: that.formatTime(countSeconds)
      })
      // console.log('现在的秒是' + that.data.countSeconds)
      if (that.data.countSeconds == 0) {
        that.pause()
        // console.log('我可以暂停啦')
        clearInterval(that.data.timer)
        return;
      }
      else {
        // console.log('我还不可以暂停')

      }
    }, 1000)
  },

  // 显示遮罩层及动画
  showModal: function () {
    var that = this;
    that.setData({
      hideFlag: false
    })
    // 创建动画实例
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间
      timingFunction: 'linear',//动画的效果 默认值是linear->匀速，ease->动画以低速开始，然后加快，在结束前变慢
    })
    this.animation = animation; //将animation变量赋值给当前动画
    var time1 = setTimeout(function () {
      that.slideIn();//调用动画--滑入
      clearTimeout(time1);
      time1 = null;
    }, 100)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.slideDown();//调用动画--滑出
    var time1 = setTimeout(function () {
      that.setData({
        hideFlag: true
      })
      clearTimeout(time1);
      time1 = null;
    }, 220)//先执行下滑动画，再隐藏模块

  },
  //动画 -- 滑入
  slideIn: function () {
    this.animation.translateY(0).step() // 在y轴偏移，然后用step()完成一个动画
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    })
  },
  //动画 -- 滑出
  slideDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },


  // 实现分享功能
  onShareAppMessage: function () {
    return {
      title: '晚安',
      path: 'index'

    }
  },
  // 切换日夜间模式
  toggle: function () {
    let is_night = this.data.is_night
  // 切换成白天模式
    if (is_night != false) {
      is_night = false
      this.setData({
        bgColor: '#fbf7e9'
      })

      
    }
    // 切换成夜间模式
    else {
      is_night = true

      this.setData({
        bgColor: '#000000'
      })

    
    }
    this.setData({
      is_night,

    })


  }



})
