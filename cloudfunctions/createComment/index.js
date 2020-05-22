// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数

exports.main = async (event, context) => {

  try {
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
    console.log("生产失败")
  }

}