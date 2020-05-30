// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
      return await db.collection('post')
      .orderBy('date', 'desc')
      .skip(event.currentPage*10)
      .limit(10)
        .get({
          success: function (res) {
            console.log('列表追加如下:\n', res)
            return res;
          }
        })
  } catch (error) {
    console.log(error)
  }
}