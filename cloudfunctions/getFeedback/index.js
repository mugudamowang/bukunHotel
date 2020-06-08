// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
    msgtype: 'text',
    text: {
      content: '谢谢您宝贵的建议，我们会尽快处理的~',
    },
  })

  return 'success'
}
