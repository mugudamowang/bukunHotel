// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    //如果是定向查询
    if (event.postId)
      return await db.collection('post').where({
          _id: event.postId
        }).orderBy('date', 'desc')
        .get({
          success: function (res) {
            return res;
          }
        })
    else {//如果是获取完全列表
      return await db.collection('post')
      .orderBy('date', 'desc')
      .where({
        date: _.gte(event.date)
      })
        .get({
          success: function (res) {
            console.log('列表', res)
            return res;
          }
        })
    }
  } catch (error) {
    console.log(error)
  }
}