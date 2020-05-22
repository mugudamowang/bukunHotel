// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('comments').where({
      postid: event.postId
    }).orderBy('date', 'desc')
    .get({
      success:function(res){
        console.log('评论列表',res)
        return res;
      }
    })
    
  } catch (error) {
    console.log(error)
  }
}