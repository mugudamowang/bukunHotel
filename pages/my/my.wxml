//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    datalist:[
      {
        id : "0233",
        post : "谁给你写诗?"
      },
      {
        id : "0404",
        post : "海星如何睡觉?"
      },
      {
        id : "0618",
        post : "hhh"
      },
      {
        id : "1010",
        post : "covid19给爷爬"
      },
      {
        id : "8856",
        post : "高三加油"
      },
      {
        id : "1010",
        post : "covid19给爷爬"
      },
      {
        id : "8856",
        post : "高三加油"
      }
    ],
    
    // 弹出管理
    hideFlag: true,//true-隐藏  false-显示
    animationData: {},//动画
  //  背景图片路径
  tempFilePaths:'https://i.loli.net/2020/05/29/YWfHehqSRx64iwZ.jpg'
  },

  // 删除的逻辑写在这里
  messageDelete:function(){


// 删除后隐藏模态框
// this.hideModal()
  },

  // 取消删除
  messageCancel:function(){
this.hideModal()
  },
  // 返回顶部的逻辑写在这
goTop:function(){

},
// 点击背景图选择图片
changeImage:function(){
  let that=this
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success (res) {
      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths
      that.setData({
        tempFilePaths
      })
    }
  })
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
 
})
