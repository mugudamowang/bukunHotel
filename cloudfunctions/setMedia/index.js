// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (!event.localStatus) {
      return db.collection('post').where({
        _id: event.postid
      }).update({
        // data 传入需要局部更新的数据
        data: {
          likeNum: event.likeNum,
          like: _.pop(event.id)
        },
      })
    } else {
      return db.collection('post').where({
        _id: event.postid
      }).update({
        // data 传入需要局部更新的数据
        data: {
          likeNum: event.likeNum,
          like: _.push({
            'id': event.id,
            'status': event.localStatus
          })
        },
      })

    }


  } catch (error) {
    console.log(error)
  }

}