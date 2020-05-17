//index.js
//获取应用实例

Page({
  data: {
    tapAdd: false,
    star: 0,


    vertical: false,
    duration: 500,
    currentTab: 0,

    // po文信息
    postlist: [],
    //postlist:[{
    // id:'',
    // post:''
    // }]

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


  getList() {
    let that = this;
    //调用云函数getpList来获取po列表
    //调用云函数getmList来获取播放列表
    wx.cloud.callFunction({
      name:'getpList',
      
      success: res => {
        
        //如果返回的res中有result
        if (res.result) {

          let postlist = res.result.data;
          console.log(postlist, '这是po列表');
          console.log(postlist.nikename);

          //如果result为null
          if (postlist === undefined || postlist.length === 0) {
            wx.showToast({
              title: 'nothing~QAQ',
            })
          }
          //如果result中有数据,则设置data
          else {
            that.setData({
                postlist: res.result.data,
                
              }),
              console.log(that, that.data.playlist, 'ppppp这是设置到data里的数据')
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