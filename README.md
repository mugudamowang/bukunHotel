## 每次 pull push 完 master 要看↓↓↓
### 2020/5/21 mugu
- 要抓紧时间啊,还有挺多的没做完....
- 到月底要把功能做好,6.1晚21:00第二次合并
- 6.1-6.7优化
- 6.7晚21:00合并
- 6.8-6.13写文档
- 6.13晚21:00提交
### 2020/5/5 mugu
- 合并大部分代码,部分css样式不兼容,swiper-item里面是你的模块
- 需要修改下你的模块一些样式的来适配,那个遮罩东西有位置bug,部分显示不全
- 添加了compoents模块\postDetail,index.json里设置了disablescroll禁止整体页面滑动,你再修改自己的样式吧.
- 删除无用文件夹image
### 2020/5/4 lyq
- 在app.json的首行添加了cloud:true
- 在app.js的onload函数中对云函数进行初始化init
- 在project.config.json中新增了cloudfunctionRoot来指定一个文件夹来新建云函数，一开始按右键新建并没有云函数这个选项，在这里指定了路径之后就
右键新建就出现了云函数
- 我的云数据库的环境id命名为bukunhotel，还没有了解如何导出数据库文件的相关信息和环境id的冲突问题
- 在进行数据渲染时踩的坑是部署过云函数之后，又修改了云函数没有再上传并部署导致一直找不到问题
- 用的是less文件编写样式，注释都在less文件中而不在wxss文件中
### 2020/4/22 mugu:
- 调整了index页面设置,其中禁用页面滚动,使topNavBar的导航不会滚动
- 初步userPost调整样式
### 2020/4/21 mugu
- 构建了基本框架, 在index里面开发你的页
- 其中要注意的是, wxss中提倡使用flex布局, 
- 颜色主色调是我之前设计的哪个色调, 拿捏的话不准记得打开XD去取色. 
- 命名最好统一下, 可以参考bukunHotel.png
- loading要是嫌加载慢的话,开发2的时候可以在app.json里把位置往后排
- 这样子编辑文档,主要是添加一些说明文字, 用md写

notepad:

"appid": "wxcfd7ece5e153fdf8",
wxef5815be0641ffda
数据库设计:  post._id = comments._id ;  nickName = ui.nickname;  comment = inout.value; 
