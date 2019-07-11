/*
 * @Author: Mr_Wei
 * @Description: 毕业论文后台文件入口
 * @Date: 17:02 2019/6/22
 * @Param: server.js
 * @return:
 **/

// 依赖
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();


// 配置
require("./config/http")(app);   // 跨域
require("./mongodb/mongodb");   // MongoDB
require("./passport/passport")(passport);  // 验证token


// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());  // 初始化passport


// 路由
const userRoute = require("./api/user");
const adminRoute = require("./api/admin");
const indexRoute = require("./api/index");
const articleRoute = require("./api/article");
const imgRoute = require("./api/readimgs");
app.use("/api/user", userRoute);  // 普通用户
app.use("/api/admin", adminRoute);  // 管理员
app.use("/api/index", indexRoute);  // 首页资源
app.use("/api/article", articleRoute);  // 获取所有文章
app.use("/api/imgs", imgRoute);  // 图片路由


// 创建服务器
const port = process.env.port || 3001;
app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is running on [${port}] port.`);
})