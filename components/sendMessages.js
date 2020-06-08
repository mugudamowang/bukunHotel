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
    type: '',
    errCode: 0,
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

      //内容安全检测
      const that = this
      wx.cloud.callFunction({
        name: 'checkPost',
        data: {
          post: this.data.post,
        },
        success(_res) {
          that.setData({
            errCode : _res.result.msgR.errCode
          })
        },
        fail(_res) {
          errCode = _res.result.msgR.errCode
        }
      })

     //判断用户是否正常登陆
      const ui = wx.getStorageSync('userInfo')
      if (!ui) {
        wx.showLoading({
          title: '你还未登陆',
        })
        wx.redirectTo({
          url: '../pages/load',
        })
      }

      //限制po文长度为100以内,以句子分享格式
      if (that.data.errCode == 0) {
        if (ui && that.data.post != '' && (that.data.post.length) <= 100) {
          wx.showLoading({
            title: '不眠投递中~~',
          })
          if (this.data.comType === "post") {
            //初始化数据
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
          if (this.data.comType === "comment") {
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
                wx.startPullDownRefresh()
                wx.stopPullDownRefresh()
              },
            })
          }, 1000)

        } else {
          wx.showToast({
            title: "🥝欸,还没上传呢,0<字数<100",
            icon: "none",
          })
        }
      } else {
        wx.showToast({
          title: "包含违规内容!!",
          icon: "none",
        })
      }
    },
  }
})