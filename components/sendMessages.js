// components/sendMessages.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    post: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {



    inputPost: function (e) {
      this.setData({
        post: e.detail.value
      });
    },

    createPost: function (e) {
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

        wx.cloud.callFunction({
            name: "createPost",
            data: {
              post: that.data.post,
              date: Date.now(),
              openid: ui.openId,
              nickname: ui.nickName
            }
          }),

          setTimeout(function() {
            wx.hideLoading({

              complete: (res) => {
                //清空输入框
                wx.showToast({
                  title: '嘚√',
                })

                this.setData({
                  post: ''
                });

              },
            })
          }, 1000)
      } else {
        wx.showToast({
          title: "欸,还没上传呢0<🥝<30",
          icon: "none",
        })
      }

    }


  }
})