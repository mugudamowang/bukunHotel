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
      totalTime: '0.00',
      totalSeconds:0,
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
    // audioCtx.src = "http://183.240.120.29/amobile.music.tc.qq.com/C400001KQ3zX0N2rVR.m4a?guid=185019120&amp;vkey=D8F7BFF89ECE89AC5D8DCCF7173413FEEC9F4D3BE51BC96DED7B66B6B50B9EB0D64F58987760909B62F71503AA4C2C06D8F1B7A93BEC0D56&amp;uin=0&amp;fromtag=66"
    audioCtx.src = "http://183.240.120.18/amobile.music.tc.qq.com/C400002I3Nwa4f9xqA.m4a?guid=4680889107&amp;vkey=977534C2CDF8CB0B6EF5698D62EA45474AE69C7B31FE80E69E06EB3DD5F349FA2905A4DD5F2FD441352D3BDCD4C76E994709613D7F605F6E&amp;uin=115&amp;fromtag=66"
    // audioCtx.src="http://183.240.120.29/amobile.music.tc.qq.com/C400000trBUk47EpIL.m4a?guid=4680889107&amp;vkey=481BF7496B76B8B8679384F83453766C5FFF3F996503230E81FDC5BD5D2BB81B09A7DE273C401CD31A3CB9AF446919B8D25F20DF054C5AEE&amp;uin=115&amp;fromtag=66"
    // console.log(this.audioCtx)
    
    // 如果是第一次播放，则初始化totalTime为0:00
if(this.data.loops==0){
  this.setData({
    playIndex: index,
    'play.title': music.name,
    'play.coverImgUrl': music.pic_url,
    'play.currentTime': '0:00',
    'play.totalTime':'0:00'

  })
}
// 若不是第一次播放了，则让totalTime为其值即可
else{
  this.setData({
    playIndex: index,
    'play.title': music.name,
    'play.coverImgUrl': music.pic_url,
    'play.currentTime': '0:00',
    'play.totalTime':this.data.play.totalTime

  })
}
    

  },
  // 播放功能，对于播放条那里直接触发背景音乐实例的play，不用setMusic；对于图片点击就要用change来setMusic
  play: function () {
    // audioCtx.play();
    let that = this

    // 转化为浮点类型，因为一开始定义是string类型
    let viewing_time = parseFloat(that.data.viewing_time)
    // let viewing_time=parseFloat(that.data.viewing_time)
    // audioCtx.onTimeUpdate(()=>{
    // 判断当前时间是否为0，如果为0则不需要跳转直接更新进度
    // console.log('曾经播放过的时间' + viewing_time)
    // 定义一个变量保存一首歌是否完整播放过,直接判断当前的是否大于时长不就好了
    // let num=(that.data.play.totalSeconds)%(that.data.play.duration)
    // console.log('num is'+num,'viewing_time is'+viewing_time)


    let currentSeconds=this.data.play.currentSeconds
    let duration=this.data.play.duration
    // 当缓冲的时间不为0且这首歌还未播放完
    if (viewing_time != 0&&currentSeconds<duration) {
      // 跳转到暂停时存储的时间
      audioCtx.seek(viewing_time)
      that.currentTimeChange()
    }
    else {
      that.currentTimeChange()
    }

    // })


    // 正式开始播放
    wx.playBackgroundAudio()
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
    if (this.data.playIndex == current && this.data.is_play == false) {
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
    // 可能存在的bug？？
    // let self = this;
    let that=this
 //   // // 背景音乐播放完毕    // 播放结束时要做的事情是啥？？？？？？？
 

 audioCtx.onEnded(() => {
  console.log('我已经播放完啦 我要再次播放')
 that.setData({
  loops:1
  })
  that.setMusic(that.data.playIndex)
  that.play()
  
//  that.change(this.data.playIndex)
  console.log('又可以重新播放啦')
})

    // 自动更新播放进度
    audioCtx.onTimeUpdate(() => {
      
      
      
      
      // 如果从未完整播放完一遍
      if(this.data.loops==0){
        console.log('我是第一次播放哦')
        this.setData({
          'play.duration': audioCtx.duration,
          'play.currentTime': this.formatTime(audioCtx.currentTime),
          'play.currentSeconds': audioCtx.currentTime,
          'play.totalTime':this.formatTime(audioCtx.currentTime),
'play.totalSeconds':audioCtx.currentTime
         
  
  
        })
      }
      // 如果已经完整播放过一遍了，总时间就要累加
      else{

        let total = (this.data.play.totalSeconds + audioCtx.currentTime)
        console.log('不是第一次播放啦 已经播放了'+total)
        this.setData({
          'play.totalTime': this.formatTime(total),
          'play.totalSeconds':total
        })
      }
     
      

    });
  }


})
