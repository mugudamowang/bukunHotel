const cloud = require('wx-server-sdk');
cloud.init();
exports.main = async (event, context) => {
  console.log(event.post);
  try {
    let msgR = false;
    //检查 文字内容是否违规
    msgR = await cloud.openapi.security.msgSecCheck({
      content: event.post
    })
    return {
      msgR, //内容检查返回值
    };
  } catch (err) {
    // 错误处理
    return err
  }
}