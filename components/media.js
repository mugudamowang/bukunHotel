// components/media.js
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

    like: false

  },

  /**
   * 组件的方法列表
   */
  methods: {

    likeBtn:(e)=>{
      if(this.data==false){
        this.setData({
          like: !(this.data.like)
        })
      }
    }

  }
})
