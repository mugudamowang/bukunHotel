// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  try {
    return await db.collection('musiclist')
    .get({
      success:function(res){
        console.log('列表',res)
        console.log(bbbbb)
        return res;
      }
    })
    
  } catch (error) {
    console.log(error)
  }
}