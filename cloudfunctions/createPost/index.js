// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数

exports.main = async (event, context) => {

  try {
    return await db.collection("post").add({
      data: {
        post: event.post,
        date: event.date,
        openid: event.openid,
        nickname: event.nickname,
        avatarUrl: event.avatarUrl,
        like: event.like,
        commentNum: 0
      }
    })
  } catch (e) {
    console.log("获取失败")
  }

}