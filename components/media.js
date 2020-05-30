// components/media.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    postid: String,
    like: Boolean,
    likeNum: Number,
    commentNum: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    likeBtn: function (e) {
      if(this.data.like){
        this.data.likeNum--
      }else{
        this.data.likeNum++
      }
      this.setData({
        like: !(this.data.like),
        likeNum: this.data.likeNum
      })
      wx.cloud.callFunction({
        name: 'setMedia',
        data: {
          postid: this.data.postid,
          likeNum: this.data.likeNum,
          like: this.data.like
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