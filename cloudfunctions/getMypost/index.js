// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    //如果是定向查询
    if (event.delete) {
      db.collection('comments')
        .where({
          postid: event.postId
        })
        .remove({
          success: function (res) {
            return res;
          }
        })
      db.collection('post')
        .doc(event.postId)
        .remove({
          success: function (res) {
            return res;
          }
        })
    }
    return await db.collection('post').where({
        openid: event.openId
      }).orderBy('date', 'desc')
      .get({
        success: function (res) {
          return res;
        }
      })

  } catch (error) {
    console.log(error)
  }
}