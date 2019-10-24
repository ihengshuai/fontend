/*
 * @Author: Mr_Wei
 * @Description: 配置普通用户相关路由
 * @Date: 17:25 2019/6/22
 * @Param: user.js
 * @return:
 **/

const $ = require("jquery");   // 本页面没用到
const router = require("express").Router();  
const copydir = require('node-copydir')
const passport = require("passport");
const svgCaptcha = require('svg-captcha');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const key = require("../config/keys").KEYORSECRET;
const uploadImg = require("../config/uploadImg");
const delNoUse = require("../config/delNoUseImg");
require("../config/Date");

// 模型
const User = require("../model/userModel");  // 用户简单信息
const UserInfo = require("../model/userinfoModel");  // 用户详细信息
const Course = require("../model/courseModel");  // 课程购买信息
const UserLogin_Log = require("../model/userlogin_log");  // 用户登录日志
const UserRegister_Log = require("../model/userregister_log");  // 用户注册日志
const UserSign_Log = require("../model/usersign_log");  // 用户签到日志
const UserBuy_Log = require("../model/userbuy_log");  // 用户购买课程日志
const HTMLMessageModel = require("../model/viphtmlMessage");
const CSSMessageModel = require("../model/vipcssMessage");
const JSMessageModel = require("../model/vipjsMessage");

// 测试
router.get("/", (req, res) => {
    res.send("user OK");
})

// 上传头像
router.post("/upload", (req, res) => {
    const email = req.query.email;
    UserInfo.findOne({email})
        .then(user => {
            uploadImg(req, res, 2, user._id);
            // res.send("OK");
        })
})


// 注册
router.post("/register", (req, res) => {
    const email = req.body.email;
    User.findOne({email})
            .then(user => {
                if(user){
                    return res.status(400).json("邮箱被占用");
                }else{
                    // 创建用户
                    const username = req.body.username,
                          password = req.body.password,
                          phone = req.body.phone,
                          date = new Date().format("yyyy/MM/dd HH:mm:ss"),
                          avatar = "";
                    // 简单用户信息
                    const newUser = new User({
                        email,
                        username,
                        password,
                        phone,
                        date,
                        avatar
                    });
                    // 详细用户信息
                    const newUserInfo = new UserInfo({
                        username,
                        email,
                        phone
                    });
                    // 用户购买课程信息
                    const newCourse = new Course({
                        email
                    });
                    
                    newUserInfo.save();
                    newCourse.save();
                    newUser.save()
                            .then(user => {
                                res.json("注册成功");
                            }).catch(err => console.log(err))
                    
                    // 用户注册日志
                    setTimeout(() => {
                        UserInfo.findOne({email})
                                .then(userid => {
                                    fs.mkdirSync(path.resolve(__dirname, "../static/user/" + userid._id))
                                    // 用户注册日志
                                    const newRegister_Log = new UserRegister_Log({
                                        email,
                                        username,
                                        registerTime:date,
                                        userID:userid._id
                                    })
                                    newRegister_Log.save();
                                    try{
                                        fs.writeFileSync(path.resolve(__dirname, `../static/user/${userid._id}/default.png`), fs.readFileSync(path.resolve(__dirname, `../static/avatar/default.png`)));
                                        console.log('头像初始化成功');
                                    }catch(error){
                                        console.log(error)
                                    };
                                })
                    }, 1000)
                    
                }
            })
})


// 登录
router.post("/login", (req, res) => {
    const email = req.body.email;
    User.findOne({email})
            .then(user => {
                if(!user){
                    return res.status(400).json("用户名或密码错误");
                }else{
                    // 校验密码
                    const password = req.body.password;
                    const isValidPassword = bcrypt.compareSync(password, user.password);
                    if(!isValidPassword){
                        return res.status(400).json("用户名或密码错误");
                    }else{

                        UserInfo.findOne({email})
                                .then(userinfo => {
                                        Course.findOne({email})
                                            .then(usercourse => {

                                                // 用户登录日志
                                                const newLogin_Log = new UserLogin_Log({
                                                    email,
                                                    username:userinfo.username,
                                                    loginTime:new Date().format("yyyy/MM/dd HH:mm:ss")
                                                })
                                                newLogin_Log.save();


                                                // 设置token
                                                const rule = {
                                                    id:String(userinfo._id),
                                                    username:userinfo.username,
                                                    email:userinfo.email,
                                                    date:user.date,
                                                    signdate:userinfo.signdate,
                                                    signcount:userinfo.signcount,
                                                    avatar:userinfo.avatar,
                                                    phone:userinfo.phone,
                                                    money:userinfo.money,
                                                    html5:usercourse.html5,
                                                    css:usercourse.css,
                                                    javascript:usercourse.javascript,
                                                    startdate:usercourse.startdate,
                                                    enddate:usercourse.enddate,
                                                    buycount:usercourse.buycount
                                                };
                                                jwt.sign(rule,key,{expiresIn:7200},(err, token) => {
                                                    if(err) throw err;
                                                    res.json({"token" : "Bearer " + token})
                                                })
                                            })
                                })    
                    }
                }
            })
})


// 更新token,并更新用户的信息
router.post("/updata/token", passport.authenticate("jwt", {session:false}), (req, res) => {
    const email = req.body.email;
    User.findOne({email})
            .then(user => {
                UserInfo.findOne({email})
                    .then(userinfo => {
                        Course.findOne({email})
                            .then(usercourse => {
                                const rule = {
                                    id:String(userinfo._id),
                                    username:userinfo.username,
                                    email:userinfo.email,
                                    date:user.date
                                };
                                // 签到时间
                                if(req.body.signdate){
                                    rule.signdate = req.body.signdate;
                                    // 用户签到日志
                                    const newSign_Log = new UserSign_Log({
                                        email,
                                        username:userinfo.username,
                                        signTime:new Date().format("yyyy/MM/dd HH:mm:ss"),
                                        signData:req.body.say
                                    })
                                    newSign_Log.save();
                                }else{rule.signdate = userinfo.signdate} 
                                // 签到次数
                                if(req.body.signcount){rule.signcount = req.body.signcount}else{rule.signcount = userinfo.signcount} 
                                // 头像
                                if(req.body.avatar){rule.avatar = req.body.avatar}else{rule.avatar = userinfo.avatar} 
                                // 电话
                                if(req.body.phone){rule.phone = req.body.phone}else{rule.phone = userinfo.phone} 
                                // 余额
                                if(req.body.money){rule.money = req.body.money}else{rule.money = userinfo.money} 
                                // 是否购买html5
                                if(req.body.html5){
                                    rule.html5 = req.body.html5;
                                    
                                    // 用户购买课程日志
                                    const newBuy_Log = new UserBuy_Log({
                                        email,
                                        username:userinfo.username,
                                        courseType:"HTML5系列",
                                        totalMoney:req.body.totalMoney,
                                        buyTime:new Date().format("yyyy/MM/dd HH:mm:ss")
                                    })
                                    newBuy_Log.save();
                                }else{rule.html5 = usercourse.html5} 
                                // 是否购买css课程
                                if(req.body.css){
                                    rule.css = req.body.css;

                                    // 用户购买课程日志
                                    const newBuy_Log = new UserBuy_Log({
                                        email,
                                        username:userinfo.username,
                                        courseType:"CSS系列",
                                        totalMoney:req.body.totalMoney,
                                        buyTime:new Date().format("yyyy/MM/dd HH:mm:ss")
                                    })
                                    newBuy_Log.save();
                                }else{rule.css = usercourse.css} 
                                // 是否购买JavaScript课程
                                if(req.body.javascript){
                                    rule.javascript = req.body.javascript;

                                    // 用户购买课程日志
                                    const newBuy_Log = new UserBuy_Log({
                                        email,
                                        username:userinfo.username,
                                        courseType:"JavaScript系列",
                                        totalMoney:req.body.totalMoney,
                                        buyTime:new Date().format("yyyy/MM/dd HH:mm:ss")
                                    })
                                    newBuy_Log.save();
                                }else{rule.javascript = usercourse.javascript} 
                                // 购买日期
                                if(req.body.startdate){rule.startdate = req.body.startdate}else{rule.startdate = usercourse.startdate} 
                                // 到期日期
                                if(req.body.enddate){rule.enddate = req.body.enddate}else{rule.enddate = usercourse.enddate} 
                                // 购买次数
                                if(req.body.buycount){rule.buycount = req.body.buycount}else{rule.buycount = usercourse.buycount} 
                                
                                jwt.sign(rule,key,{expiresIn:7200},(err, token) => {
                                    if(err) throw err;
                                    res.json({"token" : "Bearer " + token})
                                   
                                });


                                // 更新数据库

                                // 用户简单信息
                                const curuser = {};
                                // curuser.email = email;
                                curuser.signdate = rule.signdate;
                                curuser.phone = rule.phone;
                                curuser.avatar = rule.avatar;
                                User.findOneAndUpdate(
                                    {email:email},
                                    {$set:curuser},
                                    {new:true}
                                ).then(user => {
                                    user.save();
                                }).catch(err => console.log("更新失败"))

                                // 用户详细信息
                                const curuserinfo = {};
                                curuserinfo.phone = rule.phone;
                                curuserinfo.avatar = rule.avatar;
                                curuserinfo.signdate = rule.signdate;
                                curuserinfo.signcount = rule.signcount;
                                curuserinfo.money = rule.money;
                                UserInfo.findOneAndUpdate(
                                    {email:email},
                                    {$set:curuserinfo},
                                    {new:true}
                                ).then(curuserinfo => {
                                    curuserinfo.save().then(() => {
                                        delNoUse(2, rule.id);
                                    })
                                }).catch(err => console.log("更新失败"))

                                // 用户购买课程信息
                                const curcourse = {};
                                curcourse.html5 = rule.html5;
                                curcourse.css = rule.css;
                                curcourse.javascript = rule.javascript;
                                curcourse.startdate = rule.startdate;
                                curcourse.enddate = rule.enddate;
                                curcourse.buycount = rule.buycount;
                                Course.findOneAndUpdate(
                                    {email:email},
                                    {$set:curcourse},
                                    {new:true}
                                ).then(curcourse => {
                                    curcourse.save();
                                }).catch(err => console.log("更新失败"))

                                // 用户留言头像更换
                                const curmessage = {};
                                curmessage.avatar = rule.avatar;
                                HTMLMessageModel.updateMany(
                                    {username:rule.username},
                                    {$set:curmessage},
                                    {new:true},
                                ).catch(err => console.log(err))
                                CSSMessageModel.updateMany(
                                    {username:rule.username},
                                    {$set:curmessage},
                                    {new:true},
                                ).catch(err => console.log(err))
                                JSMessageModel.updateMany(
                                    {username:rule.username},
                                    {$set:curmessage},
                                    {new:true},
                                ).catch(err => console.log(err))
                            })
                    })
            })

    
})


// 修改密码
router.post("/modpwd", passport.authenticate("jwt", {session:false}), (req, res) => {
    const email = req.body.email;
    User.findOne({email})
                .then(user => {
                    const password = req.body.oldpassword;
                    const isValidPassword = bcrypt.compareSync(password, user.password);
                    if(!isValidPassword){
                        return res.status(400).json("修改失败,旧密码错误");
                    }else{
                        const modParam = {};
                        modParam.password = req.body.newpassword;
                        User.findOneAndUpdate(
                            {email:email},
                            {$set:modParam},
                            {new:true}
                        ).then(newuser => {
                            newuser.save().then(() => res.send("修改成功"));
                        }).catch(err => console.log(err))
                    }
                })
});

// 获取验证码
router.get("/getCaptcha", (req, res) => {
    var captcha = svgCaptcha.create({  
        // 翻转颜色  
        inverse: false,  
        // 字体大小  
        fontSize: 38,  
        // 噪声线条数  
        noise: 3,  
        // 宽度  
        width: 80,  
        // 高度  
        height: 32,  
      });  
      // 保存到session,忽略大小写  
      req.session = captcha.text.toLowerCase(); 
      console.log(req.session); //0xtg 生成的验证码
      //保存到cookie 方便前端调用验证
      res.cookie('captcha', req.session); 
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(String(captcha.data));
      res.end();
})

// 获取头像
router.get("/avatar", (req, res) => {
    const email = req.query.email;
    UserInfo.findOne({email})
        .then(user => {
            if(user){
                res.sendFile(path.resolve(__dirname, `../static/user/${user._id}/${user.avatar}`))
            }else{
                res.sendFile(path.resolve(__dirname, `../static/avatar/logo-avatar.png`))
            }
        })
})

// 回显头像
router.get("/avatar/back", (req, res) => {
    const email = req.query.email;
    const avatar = req.query.avatar;
    
    UserInfo.findOne({email})
        .then(user => {
            if(user){
                res.sendFile(path.resolve(__dirname, `../static/user/${user._id}/${avatar}`))
            }
        })
})

// 导出组件
module.exports = router;