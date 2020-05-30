// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数

exports.main = async (event, context) => {

  try {

    const _ = db.command
    db.collection('post').doc(event.postid).update({
      data: {
        commentNum: _.inc(1)
      },
      success: function (res) {
        console.log(res.data)
      }
    })

    return await db.collection("comments").add({
      data: {
        comment: event.comment,
        postid: event.postid,
        date: event.date,
        openid: event.openid,
        nickname: event.nickname,
        avatarUrl: event.avatarUrl
      }
    })
  } catch (e) {
    console.log("生成失败")
  }

}