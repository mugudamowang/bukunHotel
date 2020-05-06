//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: "test233",
      traceUser: true
    })

  },
  globalData: {
    userInfo: {},
    // 当前是静态数据-----------------------------------------
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
    //----------------------------------------------

  }
})