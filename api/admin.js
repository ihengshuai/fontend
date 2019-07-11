/*
 * @Author: Mr_Wei
 * @Description: 配置管理员相关操作   删除用户,查看签到情况,购买课程情况,登录日志,注册日志,操作文章等等
 * @Date: 17:25 2019/6/22
 * @Param: admin.js
 * @return:
 **/

const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../config/keys").KEYORSECRET;
require("../config/Date");
// 数据库模型
const Admin = require("../model/adminModel");
const User = require("../model/userModel");
const HTML5Model = require("../model/html5Model");

// 测试
router.get("/", (req, res) => {
    res.send("admin OK");
})


// 注册
router.post("/register", (req, res) => {
    const email = req.body.email;
    Admin.findOne({email})
            .then(admin => {
                if(admin){
                    return req.status(422).json("邮箱被占用");
                }else{
                    const username = req.body.username;
                    const password = req.body.password;
                    const date = new Date().format("yyyy/MM/dd HH:mm:ss");
                    const newAdmin = new Admin({
                        email,
                        username,
                        password,
                        date
                    });
                    newAdmin.save()
                                .then(() => res.json("注册成功"))
                                .catch(err => console.log(err))
                }
            })
})

// 管理员登录
router.post("/login", (req, res) => {
    const email = req.body.email;
    Admin.findOne({email})
            .then(admin => {
                if(!admin){ return res.status(422).json("用户名或密码错误"); }
                // 校验密码
                const password = req.body.password;
                const isValidPassword = bcrypt.compareSync(password, admin.password);
                if(!isValidPassword) { return res.status(422).json("用户名或密码错误"); }
                // 设置token
                const rule = {
                    id:String(admin._id),
                    email:admin.email,
                    username:admin.username,
                    date:admin.date
                };  // 签证
                jwt.sign(rule, key, {expiresIn:3600}, (err, token) => {
                    if(err) throw err;
                    res.json({"token": "Bearer " + token});
                })
            })
})


// 查看所有的留言
router.get("/allmessage", passport.authenticate("jwt", {session:false}), (req, res) => {
    Admin.find().then(admins => res.send(admins)).catch(err => console.log(err))
})


// 添加html文章
router.post("/html5/add", passport.authenticate("jwt", {session:false}), (req, res) => {
    const title = req.body.title;
    HTML5Model.findOne({title})
                .then(article => {
                    if(article){
                        return res.status(400).json("文章标题已存在");
                    }else{  // 添加文章
                        const newHTML5 = new HTML5Model({
                            title,
                            hash:title,
                            content:req.body.content
                        });
                        newHTML5.save()
                                    .then(html5 => res.send("创建成功"))
                                    .catch(err => console.log(err))
                    }
                })
})













// 导出组件
module.exports = router;
