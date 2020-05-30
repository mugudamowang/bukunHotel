// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return db.collection('post').where({
      _id: event.postid
    }).update({
      // data 传入需要局部更新的数据
      data: {
        likeNum: event.likeNum,
        like: event.like
      },
    })

  }catch (error) {
    console.log(error)
  }

}