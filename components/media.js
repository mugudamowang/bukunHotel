// components/media.js

const ui = wx.getStorageSync('userInfo')


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    postid: String,
    like: Array,
    likeNum: Number,
    commentNum: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    localStatus: false
  },

  /**
   * 组件的方法列表
   */


  lifetimes: {
      ready(){
        let i = 0
        while (i < this.data.like.length) { //遍历like列表查找用户id
          if (this.data.like[i].id == ui.openId) {
            this.setData({
              localStatus: this.data.like[i].status,
              likeNum:  this.data.likeNum
            })
            break;
          }
          i++
        }
    },
   
  },

  methods: {

    likeBtn: function (e) {
      if (this.data.localStatus) {
        this.data.likeNum--
      } else {
        this.data.likeNum++
      }
      this.setData({
        localStatus: !(this.data.localStatus),
        likeNum: this.data.likeNum
      })


      wx.cloud.callFunction({
        name: 'setMedia',
        data: {
          postid: this.data.postid,
          likeNum: this.data.likeNum,
          id: ui.openId,
          localStatus: this.data.localStatus
        },

        fail: err => {
          console.log(err)
          wx.showToast({
            title: 'XAX~宕机',
            icon: 'false'
          })
        }
      })
    }

  }

})