// components/sendMessages.js
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

      console.log("here")
      console.log(this.data.comType)
      console.log("here")
      const that = this
      const ui = wx.getStorageSync('userInfo')

      console.log(that.data.post)

      if (!ui) {
        console.log("reoreoreoreoreo")
      }
      // 测试用,添加信息到数据库
      if (that.data.post != '' && (that.data.post.length) <= 30) {
        //限制po文长度为30以内,以句子分享格式

        wx.showLoading({
          title: '不困投递中~~',
        })

        if (this.data.comType === "post") {
          wx.cloud.callFunction({
            name: "createPost",
            data: {
              post: that.data.post,
              date: Date.now(),
              openid: ui.openId,
              nickname: ui.nickName,
              avatarUrl: ui.avatarUrl
            }
          })
        } else {
          wx.cloud.callFunction({
            name: "createComment",
            data: {
              comment: that.data.post,
              postid: this.data.postId,
              date: Date.now(),
              openid: ui.openid,
              nickname: ui.nickname,
              avatarUrl: ui.avatarUrl
            }
          })
        }

        setTimeout(function () {
          wx.hideLoading({

            complete: (res) => {
              //清空输入框
              wx.showToast({
                title: '嘚√',
              })
            },
          })
        }, 1000)
      } else {
        wx.showToast({
          title: "欸,还没上传呢0<🥝<30",
          icon: "none",
        })
      }

    },

    changeStyle: function (e) {

    }


  }
})