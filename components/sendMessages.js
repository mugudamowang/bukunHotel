// components/sendMessages.js

var utils = require('../utils/util.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    comType: String,
    postId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    post: '',
    type: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputPost(e) {
      this.setData({
        post: e.detail.value
      });
    },

    createPost: function (e) {
      
      const that = this
      const ui = wx.getStorageSync('userInfo')
      if (!ui) {
        wx.showLoading({
          title: '宁还未登陆',
        })
        wx.switchTab({
          url: '../pages/load',
        })
      }
      if (ui && that.data.post != '' && (that.data.post.length) <= 100) {
        //限制po文长度为100以内,以句子分享格式
        wx.showLoading({
          title: '不困投递中~~',
        })
        if (this.data.comType === "post") {
          const like = []
          like.id = ui.openId
          like.status = false
          wx.cloud.callFunction({
            name: "createPost",
            data: {
              post: that.data.post,
              date: utils.formatTime(new Date),
              openid: ui.openId,
              nickname: ui.nickName,
              avatarUrl: ui.avatarUrl,
              like: like,
              likeNum: 0,
              commentNum: 0
            }
          })

        } 
        if(this.data.comType === "comment") {
          wx.cloud.callFunction({
            name: "createComment",
            data: {
              comment: that.data.post,
              postid: this.data.postId,
              date: utils.formatTime(new Date),
              openid: ui.openid,
              nickname: ui.nickName,
              avatarUrl: ui.avatarUrl
            }
          })

        }
        
        this.setData({
          post: ''
        })
        setTimeout(function () {
          wx.hideLoading({

            complete: (res) => {
              //清空输入框
              wx.showToast({
                title: '嘚√',
              })
              wx.startPullDownRefresh({
                complete: (res) => {
                  console.log("refreshing~")
                },
              })
              wx.stopPullDownRefresh({
                complete: (res) => {
                  console.log("done~")
                },
              })
            },
          })
        }, 1000)

      } else {
        wx.showToast({
          title: "🥝欸,还没上传呢,0<字数<100",
          icon: "none",
        })
      }

    },
  }
})