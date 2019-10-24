/*
 * @Author: Mr_Wei
 * @Description: 配置管理员相关操作   删除用户,查看签到情况,购买课程情况,登录日志,注册日志,操作文章等等
 * @Date: 17:25 2019/6/22
 * @Param: admin.js
 * @return:
 **/

const fs = require("fs");
const path = require("path");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../config/keys").KEYORSECRET;
const uploadImg = require("../config/uploadImg");
const uploadMedia = require("../config/uploadMedia");
const delNoUseImg = require("../config/delNoUseImg");
const rmdir = require("../config/rmdir");
require("../config/Date");



// 数据库模型
const Index = require("../model/indexModel");
const Admin = require("../model/adminModel");
const Operation = require("../model/operation");
const User = require("../model/userModel");
const Course = require("../model/courseModel");
const CommunityMessage = require("../model/messageModel");
const UserBuy_Log = require("../model/userbuy_log");
const UserLogin_Log = require("../model/userlogin_log");
const UserRegister_Log = require("../model/userregister_log");
const UserSign_Log = require("../model/usersign_log");
const UserInfo = require("../model/userinfoModel");
const HTML5Model = require("../model/html5Model");
const CSSModel = require("../model/cssModel");
const JavaScriptModel = require("../model/javascriptModel");
const MusicModel = require("../model/musicModel");
const VIPHTMLModel = require("../model/viphtmlModel");
const VIPCSSModel = require("../model/vipcssModel");
const VIPJSModel = require("../model/vipjsModel");
const HTMLMessageModel = require("../model/viphtmlMessage");
const CSSMessageModel = require("../model/vipcssMessage");
const JSMessageModel = require("../model/vipjsMessage");

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
                const opera = new Operation({
                    from:"管理员登录",
                    type:"管理员登录",
                    from_id:admin._id,
                    date:new Date().format("yyyy/MM/dd HH:mm:ss")
                })
                opera.save();
                jwt.sign(rule, key, {expiresIn:10800}, (err, token) => {
                    if(err) throw err;
                    res.json({"token": "Bearer " + token});
                    
                })
            })
})

// 验证管理员密码
router.post("/checkpassword", (req, res) => {
    const pwd = req.body.pwd;
    const email = req.body.email;
    Admin.findOne({email})
            .then(admin => {
                const isValidPassword = bcrypt.compareSync(pwd, admin.password);
                if(!isValidPassword) { 
                    return res.send(false);
                }else{
                    return res.send(true);
                }
            })
})

// 删除首页卡片
router.post("/homepage/del", passport.authenticate("jwt", {session:false}), (req, res) => {
    const _id = req.body._id;
    Index.findOneAndRemove({_id})
            .then(cards => {
                if(cards){
                    cards.save().then(now => {
                        const opera = new Operation({
                            from:"首页卡片数据",
                            type:"删除",
                            from_id:_id,
                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                        })
                        opera.save();
                        console.log("[删除卡片],_id:" + _id);
                        res.json("OK");
                        delNoUseImg(1);
                    });
                }
            })
})

// 编辑卡片
router.post("/homepage/edit", passport.authenticate("jwt", {session:false}), (req, res) => {
    const _id = req.body._id;
    const nowCard = {};
        nowCard.title = req.body.title;
        nowCard.content = req.body.content;
        nowCard.url = req.body.url;
        nowCard.img = req.body.img;
        Index.findOneAndUpdate(
            {_id:req.body._id},
            {$set:nowCard},
            {new:true}
        ).then(newCard => {
            newCard.save().then(() => {
                const opera = new Operation({
                    from:"首页卡片数据",
                    type:"更新",
                    from_id:_id,
                    date:new Date().format("yyyy/MM/dd HH:mm:ss")
                })
                opera.save();
                console.log("[修改卡片],_id:" + req.body._id);
                res.send("更改成功");
                delNoUseImg(1);
            })
        }).catch(err => console.log("更新失败"))
})

// 上传卡片图片
router.post("/upload/card", (req, res) => {
    uploadImg(req, res, 1);
})

// 添加卡片
router.post("/homepage/add", passport.authenticate("jwt", {session:false}), (req, res) => {
    const url = req.body.url;
    const img = req.body.img;
    const title = req.body.title;
    const content = req.body.content;
    const newIndex = new Index({
        url,img,title,content
    });
    newIndex.save().then(() => {
        const opera = new Operation({
            from:"首页卡片数据",
            type:"添加",
            from_id:newIndex._id,
            date:new Date().format("yyyy/MM/dd HH:mm:ss")
        })
        opera.save();
        console.log("[添加卡片],_id:" + newIndex._id)
        res.send("OK");
        delNoUseImg(1);
    })
})


// 获取所有用户的信息
router.get("/allusers", passport.authenticate("jwt", {session:false}), (req, res) => {
    UserInfo.find()
            .then(users => {
                if(users) res.send(users)
            }).catch(err => console.log(err))
})

// 搜索用户
router.post("/search/user", passport.authenticate("jwt", {session:false}), (req, res) => {
    const searchuser = req.body.searchuser.trim() + ".*";
    UserInfo.find({username:{ $regex: searchuser, $options: 'i' }})
            .then(users => {
                if(users.length){
                    res.send(users);
                }else{
                    UserInfo.find({email:{$regex: searchuser, $options: "i"}})
                            .then(emails => {
                                res.send(emails);
                            })
                }
            })
})

// 删除用户
router.post("/delete", passport.authenticate("jwt", {session:false}), (req, res) => {
    const email = req.body.email;
    User.findOneAndRemove({email})
            .then(users => {
                if(users){
                    users.save().then(users => {
                        const opera = new Operation({
                            from:"用户管理",
                            type:"删除",
                            from_id:users._id,
                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                        })
                        opera.save();
                        console.log("[用户删除],email:" + email);
                        res.json("OK");
                    });
                }
                
                UserInfo.findOneAndRemove({email})
                        .then(users => {
                            if(users){
                                users.save().then(users => {
                                    rmdir(path.resolve(__dirname, `../static/user/${users._id}`))
                                    console.log("[用户删除],email:" + email);
                                });
                            }
                        })
                Course.findOneAndRemove({email})
                        .then(users => {
                            if(users){
                                users.save().then(users => {
                                    console.log("[用户删除],email:" + email);
                                });
                            }
                        })
                UserRegister_Log.findOneAndRemove({email})
                        .then(users => {
                            if(users){
                                users.save().then(users => {
                                    console.log("[用户删除],email:" + email);
                                });
                            }
                        })
                
                // UserBuy_Log.remove({email})
                        
                // UserLogin_Log.deleteMany({email})
                        
                // UserSign_Log.deleteMany({email})
                        

            })
    
    
    
})

// 获取登录日志
router.get("/loginlog", passport.authenticate("jwt", {session:false}), (req, res) => {
    UserLogin_Log.find()
            .then(loginlogs => {
                res.send(loginlogs);
            })
})

// 搜索登录日志
router.post("/search/loginlog", passport.authenticate("jwt", {session:false}), (req, res) => {
    const searchuser = req.body.queryloginlog.trim() + ".*";
    UserLogin_Log.find({username:{ $regex: searchuser, $options: 'i' }})
            .then(loginlogs => {
                if(loginlogs.length){
                    res.send(loginlogs);
                }else{
                    UserLogin_Log.find({email:{$regex: searchuser, $options: "i"}})
                            .then(loginlogs => {
                                res.send(loginlogs);
                            })
                }
            })
})

// 获取注册日志
router.get("/registerlog", passport.authenticate("jwt", {session:false}), (req, res) => {
    UserRegister_Log.find()
            .then(loginlogs => {
                res.send(loginlogs);
            })
})

// 搜索注册日志
router.post("/search/registerlog", passport.authenticate("jwt", {session:false}), (req, res) => {
    const searchuser = req.body.queryregisterlog.trim() + ".*";
    UserRegister_Log.find({username:{ $regex: searchuser, $options: 'i' }})
            .then(registerlogs => {
                if(registerlogs.length){
                    res.send(registerlogs);
                }else{
                    UserRegister_Log.find({email:{$regex: searchuser, $options: "i"}})
                            .then(registerlogs => {
                                res.send(registerlogs);
                            })
                }
            })
})

// 获取所有的签到日志
router.get("/signlog", passport.authenticate("jwt", {session:false}), (req, res) => {
    UserSign_Log.find()
            .then(signlogs => {
                res.send(signlogs);
            })
})

// 搜索签到日志
router.post("/search/signlog", passport.authenticate("jwt", {session:false}), (req, res) => {
    const searchuser = req.body.querysignlog.trim() + ".*";
    UserSign_Log.find({username:{ $regex: searchuser, $options: 'i' }})
            .then(gisnlogs => {
                if(gisnlogs.length){
                    res.send(gisnlogs);
                }else{
                    UserSign_Log.find({email:{$regex: searchuser, $options: "i"}})
                            .then(gisnlogs => {
                                res.send(gisnlogs);
                            })
                }
            })
});

// 签到排行榜
router.get("/sign/ranking", passport.authenticate("jwt", {session:false}), (req, res) => {
    UserInfo.find()
        .then(users => {
            if(users){
                const rankList = users;
                for(var i = 0; i < rankList.length - 1; i++){
                    for(var j = 0; j < rankList.length - 1 - i; j++){
                        if(parseInt(rankList[j].signcount) < parseInt(rankList[j+1].signcount)){
                            var temp = rankList[j];
                            rankList[j] = rankList[j+1];
                            rankList[j+1] = temp;
                        }
                    }
                }
                res.send(rankList);
            }else{
                res.status(400).send("暂无签到数据");
            }
        })
})


// 添加文章
router.post("/article/add", passport.authenticate("jwt", {session:false}), (req, res) => {
    const title = req.body.title.toUpperCase();
    const type = req.body.coursetype;
    if(type == "html5"){
        HTML5Model.findOne({title})
                .then(article => {
                    if(article){
                        return res.status(400).json("文章已存在,请勿重复创建!");
                    }else{  // 添加文章
                        const newHTML5 = new HTML5Model({
                            coursetype:req.body.coursetype,
                            title,
                            content:req.body.content
                        });
                        newHTML5.save()
                                    .then(html5 => {
                                        const opera = new Operation({
                                            from:"HTML文章",
                                            type:"添加",
                                            from_id:html5._id,
                                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                                        })
                                        opera.save();
                                        console.log("[创建文章], 文章类型:" + type + ",文章标题:" + title);
                                        res.send("创建成功");
                                    })
                                    .catch(err => console.log(err))
                    }
                })
    }else if(type == "css"){
        CSSModel.findOne({title})
                .then(article => {
                    if(article){
                        return res.status(400).json("文章已存在,请勿重复创建!");
                    }else{  // 添加文章
                        const newCSS = new CSSModel({
                            coursetype:req.body.coursetype,
                            title,
                            content:req.body.content
                        });
                        newCSS.save()
                                    .then(css => {
                                        const opera = new Operation({
                                            from:"CSS文章",
                                            type:"添加",
                                            from_id:css._id,
                                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                                        })
                                        opera.save();
                                        res.send("创建成功")
                                        console.log("[创建文章], 文章类型:" + type + ",文章标题:" + title);
                                    })
                                    .catch(err => console.log(err))
                    }
                })
    }else{
        JavaScriptModel.findOne({title})
                .then(article => {
                    if(article){
                        return res.status(400).json("文章已存在,请勿重复创建!");
                    }else{  // 添加文章
                        const newJavaScript = new JavaScriptModel({
                            coursetype:req.body.coursetype,
                            title,
                            content:req.body.content
                        });
                        newJavaScript.save()
                                    .then(javascript => {
                                        const opera = new Operation({
                                            from:"JavaScript文章",
                                            type:"添加",
                                            from_id:javascript._id,
                                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                                        })
                                        opera.save();
                                        res.send("创建成功")
                                        console.log("[创建文章], 文章类型:" + type + ",文章标题:" + title);
                                    })
                                    .catch(err => console.log(err))
                    }
                })
    }
    
});

// 判断文章标题是否存在
router.post("/article/isexist", passport.authenticate("jwt", {session:false}), (req, res) => {
    const coursetype = req.body.coursetype;
    const title = req.body.title;
    if(coursetype == "html5"){
        HTML5Model.findOne({title})
                .then(article => {
                    if(article){
                        res.send(false)
                    }else{res.send(true)}
                })
    }else if(coursetype == "css"){
        CSSModel.findOne({title})
                .then(article => {
                    if(article){
                        res.send(false)
                    }else{res.send(true)}
                })
    }else{
        JavaScriptModel.findOne({title})
                .then(article => {
                    if(article){
                        res.send(false)
                    }else{res.send(true)}
                })
    }
})

// 修改文章内容
router.post("/article/change", passport.authenticate("jwt", {session:false}), (req, res) => {
    const coursetype = req.body.coursetype;
    const title = req.body.title;
    const content = req.body.content;
    
    if(coursetype == "html5"){
        const obj = {content:content};
        HTML5Model.findOneAndUpdate(
            {title:title},
            {$set:obj},
            {new:true}
        ).then(article => {
            if(article){
                article.save().then(() => {
                    const opera = new Operation({
                        from:"HTML文章",
                        type:"更新",
                        from_id:article._id,
                        date:new Date().format("yyyy/MM/dd HH:mm:ss")
                    })
                    opera.save();
                    res.send("修改成功");
                });
            }else{
                res.send("文章不存在,请刷新重试!")
            }
        }).catch(err => console.log(err))
    }else if(coursetype == "css"){
        const obj = {content:content};
        CSSModel.findOneAndUpdate(
            {title:title},
            {$set:obj},
            {new:true}
        ).then(article => {
            if(article){
                article.save().then(() => {
                    const opera = new Operation({
                        from:"CSS文章",
                        type:"更新",
                        from_id:article._id,
                        date:new Date().format("yyyy/MM/dd HH:mm:ss")
                    })
                    opera.save();
                    res.send("修改成功")
                });
            }else{
                res.send("文章不存在,请刷新重试!")
            }
        }).catch(err => console.log(err))
    }else{
        const obj = {content:content};
        JavaScriptModel.findOneAndUpdate(
            {title:title},
            {$set:obj},
            {new:true}
        ).then(article => {
            if(article){
                article.save().then(() => {
                    const opera = new Operation({
                        from:"JavaScript文章",
                        type:"更新",
                        from_id:article._id,
                        date:new Date().format("yyyy/MM/dd HH:mm:ss")
                    })
                    opera.save();
                    res.send("修改成功")
                });
            }else{
                res.send("文章不存在,请刷新重试!")
            }
        }).catch(err => console.log(err))
    }
})

// 根据 文章类型和文章ID 删除文章
router.post("/article/del", passport.authenticate("jwt", {session:false}), (req, res) => {
    const _id = req.body._id;
    const coursetype = req.body.coursetype;
    if(coursetype == "html5"){
        HTML5Model.findOneAndRemove({_id})
            .then(htmls => {
                if(htmls){
                    htmls.save()
                            .then(article => {
                                const opera = new Operation({
                                    from:"HTML文章",
                                    type:"删除",
                                    from_id:article._id,
                                    date:new Date().format("yyyy/MM/dd HH:mm:ss")
                                })
                                opera.save();
                                console.log("[删除文章],_id:" + _id + ",文章类型:" + coursetype);
                                res.json("OK")
                            })
                }
            }).catch(err => console.log(err))
    }else if(coursetype == "css"){
        CSSModel.findOneAndRemove({_id})
            .then(csss => {
                if(csss){
                    csss.save()
                        .then(article => {
                            const opera = new Operation({
                                from:"CSS文章",
                                type:"删除",
                                from_id:article._id,
                                date:new Date().format("yyyy/MM/dd HH:mm:ss")
                            })
                            opera.save();
                            console.log("[删除文章],_id:" + _id + ",文章类型:" + coursetype);
                            res.json("OK")
                        })
                }
            }).catch(err => console.log(err))
    }else{
        JavaScriptModel.findOneAndRemove({_id})
            .then(javascripts => {
                if(javascripts){
                    javascripts.save()
                        .then(article => {
                            const opera = new Operation({
                                from:"JavaScript文章",
                                type:"删除",
                                from_id:article._id,
                                date:new Date().format("yyyy/MM/dd HH:mm:ss")
                            })
                            opera.save();
                            console.log("[删除文章],_id:" + _id + ",文章类型:" + coursetype);
                            res.json("OK")
                        })
                }
            }).catch(err => console.log(err))
    }
})

// 搜索文章标题
router.post("/article/title/search", (req, res) => {
    var allArticleTitle = [];
    const searchTitle = req.body.searchTitle.trim() + ".*";
    HTML5Model.find({title:{ $regex: searchTitle, $options: 'i' }})
                .then(articles => {
                    allArticleTitle = articles;

                    CSSModel.find({title:{ $regex: searchTitle, $options: 'i' }})
                        .then(csss => {
                            for(let i = 0; i < csss.length; i ++){
                                allArticleTitle[allArticleTitle.length] = csss[i];
                            }

                            JavaScriptModel.find({title:{ $regex: searchTitle, $options: 'i' }})
                                .then(javascripts => {
                                    for(let i = 0; i < javascripts.length; i ++){
                                        allArticleTitle[allArticleTitle.length] = javascripts[i];
                                    }

                                    res.send(allArticleTitle);
                                })
                        })
                })
})

// 上传歌曲图片
router.post("/upload/music/poster", (req ,res) => {
    uploadImg(req, res, 3);
})
// 上传歌曲音频
router.post("/upload/music", (req, res) => {
    uploadMedia(req, res, 3);
})

// 添加歌曲
router.post("/addmusic", passport.authenticate("jwt", {session:false}), (req, res) => {
    const title = req.body.title; // 歌曲标题
    const artist = req.body.artist; // 歌曲作者
    const src = req.body.src;  // 歌曲地址
    const pic = req.body.pic;  // 歌曲封面
    MusicModel.findOne({title})
                .then(music => {
                    if(music){
                        return res.send("exist");
                    }else{
                        const newMusic = new MusicModel({
                            title,
                            artist,
                            src,
                            pic
                        });
                        newMusic.save()
                                .then(music => {
                                    const opera = new Operation({
                                        from:"歌曲管理",
                                        type:"添加",
                                        from_id:music._id,
                                        date:new Date().format("yyyy/MM/dd HH:mm:ss")
                                    })
                                    opera.save();
                                    console.log("[添加歌曲],歌曲:" + title);
                                    res.send("添加成功")
                                    delNoUseImg(3);
                                }).catch(err => console.log(err))
                    }
                })
})

// 歌曲管理
router.post("/managemusic", passport.authenticate("jwt", {session:false}), (req, res) => {
    // 判断关键字是 更改还是删除
    const key = req.body.key;
    if(key == "del"){  // 删除
        MusicModel.findOneAndRemove({_id:req.body._id})
            .then(songs => {
                if(songs){
                    songs.save().then(what => { 
                        const opera = new Operation({
                            from:"歌曲管理",
                            type:"删除",
                            from_id:what._id,
                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                        })
                        opera.save();
                        console.log("[删除歌曲],_id:" + req.body._id);
                        res.send("删除成功"); 
                        delNoUseImg(3);
                    })
                }
            })
    }else if(key == "mod"){  // 更改
        const nowSong = {};
        nowSong.title = req.body.title;
        nowSong.artist = req.body.artist;
        nowSong.src = req.body.src;
        nowSong.pic = req.body.pic;
        MusicModel.findOneAndUpdate(
            {_id:req.body._id},
            {$set:nowSong},
            {new:true}
        ).then(newSong => {
            newSong.save().then(sg => {
                const opera = new Operation({
                    from:"歌曲管理",
                    type:"更新",
                    from_id:sg._id,
                    date:new Date().format("yyyy/MM/dd HH:mm:ss")
                })
                opera.save();
                console.log("[修改歌曲],_id:" + req.body._id);
                res.send("更改成功");
                delNoUseImg(3);
            })
        }).catch(err => console.log("更新失败"))
    }
})

// 根据邮箱获取用户自己的订单
router.post("/logs/user/email", passport.authenticate("jwt", {session:false}), (req, res) => {
    const email = req.body.email;
    UserBuy_Log.find({email})
            .then(logs => {
                if(logs){
                    res.send(logs);
                }else{
                    res.send("无购买记录");
                }
            })
})

// 获取所有用户购买课程的日志
router.get("/logs/buycourse", passport.authenticate("jwt", {session:false}), (req, res) => {
    UserBuy_Log.find()
        .then(logs => {
            res.send(logs);
        })
})

// 搜索用户购买课程记录
router.post("/logs/userbuy", passport.authenticate("jwt", {session:false}), (req , res) => {
    const searchwhat = req.body.searchwhat.trim() + ".*";
    UserBuy_Log.find({username:{ $regex: searchwhat, $options: 'i' }})
            .then(users => {
                if(users.length){
                    res.send(users);
                }else{
                    UserBuy_Log.find({email:{$regex: searchwhat, $options: "i"}})
                            .then(emails => {
                                res.send(emails);
                            })
                }
            })
})

// 筛选购买课程记录
router.post("/logs/buycourse/filter", passport.authenticate("jwt", {session:false}), (req, res) => {
    const query = req.body.query.trim() + ".*";
    if(query.length){
        UserBuy_Log.find({username:{ $regex: query, $options: 'i' }})
            .then(users => {
                if(users.length){
                    res.send(users);
                }else{
                    UserBuy_Log.find({email:{$regex: query, $options: "i"}})
                            .then(emails => {
                                res.send(emails);
                            })
                }
            })
    }else{
        UserBuy_Log.find()
            .then(logs => {
                res.send(logs);
            })
    }
})

// 上传html视频
router.post("/upload/video/html", (req, res) => {
    uploadMedia(req, res, 4);
})
// 上传html封面
router.post("/upload/poster/html", (req, res) => {
    uploadImg(req, res, 5);
})

// 添加vip html课程
router.post("/vip/course/html/add", passport.authenticate("jwt", {session:false}), (req, res) => {
    const title = req.body.title;
    const src = req.body.src;
    const poster = req.body.poster;
    VIPHTMLModel.find()
            .then(htmls => {
                const index = htmls.length;

                VIPHTMLModel.findOne({title})
                    .then(videos => {
                        if(videos){
                            return res.send("exist");
                        }else{
                            const newVideo = new VIPHTMLModel({
                                title,
                                src,
                                poster,
                                index
                            });
                            newVideo.save()
                                    .then(video => {
                                        const opera = new Operation({
                                            from:"HTML vip课程",
                                            type:"添加",
                                            from_id:video._id,
                                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                                        })
                                        opera.save();
                                        console.log("[添加HTML(VIP)课程],课程:" + title);
                                        res.send("添加成功")
                                        delNoUseImg(4);
                                    }).catch(err => console.log(err))
                        }
                    })
            })
    
})

// 管理vip HTML课程
router.post("/vip/course/manage/html", passport.authenticate("jwt", {session:false}), (req, res) => {
    // 判断关键字是 更改还是删除
    const key = req.body.key;
    if(key == "del"){  // 删除
        VIPHTMLModel.findOneAndRemove({_id:req.body._id})
            .then(videos => {
                if(videos){
                    videos.save().then(what => { 
                        const opera = new Operation({
                            from:"HTML vip课程",
                            type:"删除",
                            from_id:what._id,
                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                        })
                        opera.save()
                            .then(() => {
                                delNoUseImg(4);
                            });
                        console.log("[删除HTML课程],_id:" + req.body._id);
                        res.send("删除成功"); 

                        VIPHTMLModel.find()
                            .then(htmls => {
                                htmls.forEach((item, index) => {
                                    const nowVideo = {};
                                    nowVideo.index = index;
                                    VIPHTMLModel.findOneAndUpdate(
                                        {_id:item._id},
                                        {$set:nowVideo},
                                        {new:true}
                                    ).then(newVideo => {
                                        newVideo.save();
                                    })
                                })
                            })
                    })

                    

                    
                }
            })
    }else if(key == "mod"){  // 更改
        const nowVideo = {};
        nowVideo.title = req.body.title;
        nowVideo.src = req.body.src;
        nowVideo.poster = req.body.poster;
        VIPHTMLModel.findOneAndUpdate(
            {_id:req.body._id},
            {$set:nowVideo},
            {new:true}
        ).then(newVideo => {
            newVideo.save().then(() => {
                const opera = new Operation({
                    from:"HTML vip课程",
                    type:"更新",
                    from_id:newVideo._id,
                    date:new Date().format("yyyy/MM/dd HH:mm:ss")
                })
                opera.save();
                console.log("[修改HTML课程],_id:" + req.body._id);
                res.send("更改成功");
                delNoUseImg(4);
            })
        }).catch(err => console.log("更新失败"))
    }
})

// 上传css视频
router.post("/upload/video/css", (req, res) => {
    uploadMedia(req, res, 5);
})
// 上传css封面
router.post("/upload/poster/css", (req, res) => {
    uploadImg(req, res, 6);
})

// 添加vip css课程
router.post("/vip/course/css/add", passport.authenticate("jwt", {session:false}), (req, res) => {
    const title = req.body.title;
    const src = req.body.src;
    const poster = req.body.poster;
    VIPCSSModel.find()
            .then(csss => {
                const index = csss.length;

                VIPCSSModel.findOne({title})
                    .then(videos => {
                        if(videos){
                            return res.send("exist");
                        }else{
                            const newVideo = new VIPCSSModel({
                                title,
                                src,
                                poster,
                                index
                            });
                            newVideo.save()
                                    .then(video => {
                                        const opera = new Operation({
                                            from:"CSS vip课程",
                                            type:"添加",
                                            from_id:video._id,
                                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                                        })
                                        opera.save();
                                        console.log("[添加CSS(VIP)课程],课程:" + title);
                                        res.send("添加成功")
                                        delNoUseImg(4);
                                    }).catch(err => console.log(err))
                        }
                    })
            })
    
})

// 管理vip CSS课程
router.post("/vip/course/manage/css", passport.authenticate("jwt", {session:false}), (req, res) => {
    // 判断关键字是 更改还是删除
    const key = req.body.key;
    if(key == "del"){  // 删除
        VIPCSSModel.findOneAndRemove({_id:req.body._id})
            .then(videos => {
                if(videos){
                    videos.save().then(what => { 
                        const opera = new Operation({
                            from:"CSS vip课程",
                            type:"删除",
                            from_id:what._id,
                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                        })
                        opera.save()
                            .then(() => {
                                delNoUseImg(5);
                            });
                        console.log("[删除CSS课程],_id:" + req.body._id);
                        res.send("删除成功"); 

                        VIPCSSModel.find()
                            .then(csss => {
                                csss.forEach((item, index) => {
                                    const nowVideo = {};
                                    nowVideo.index = index;
                                    VIPCSSModel.findOneAndUpdate(
                                        {_id:item._id},
                                        {$set:nowVideo},
                                        {new:true}
                                    ).then(newVideo => {
                                        newVideo.save()
                                    })
                                })
                            })
                    })

                    

                    
                }
            })
    }else if(key == "mod"){  // 更改
        const nowVideo = {};
        nowVideo.title = req.body.title;
        nowVideo.src = req.body.src;
        nowVideo.poster = req.body.poster;
        VIPCSSModel.findOneAndUpdate(
            {_id:req.body._id},
            {$set:nowVideo},
            {new:true}
        ).then(newVideo => {
            newVideo.save().then(() => {
                const opera = new Operation({
                    from:"CSS vip课程",
                    type:"更新",
                    from_id:newVideo._id,
                    date:new Date().format("yyyy/MM/dd HH:mm:ss")
                })
                opera.save();
                console.log("[修改CSS课程],_id:" + req.body._id);
                res.send("更改成功");
                delNoUseImg(5);
            })
        }).catch(err => console.log("更新失败"))
    }
})


// 上传JavaScript视频
router.post("/upload/video/js", (req, res) => {
    uploadMedia(req, res, 6);
})
// 上传JavaScript封面
router.post("/upload/poster/js", (req, res) => {
    uploadImg(req, res, 7);
})

// 添加vip JavaScript课程
router.post("/vip/course/js/add", passport.authenticate("jwt", {session:false}), (req, res) => {
    const title = req.body.title;
    const src = req.body.src;
    const poster = req.body.poster;
    VIPJSModel.find()
            .then(jss => {
                const index = jss.length;

                VIPJSModel.findOne({title})
                    .then(videos => {
                        if(videos){
                            return res.send("exist");
                        }else{
                            const newVideo = new VIPJSModel({
                                title,
                                src,
                                poster,
                                index
                            });
                            newVideo.save()
                                    .then(video => {
                                        const opera = new Operation({
                                            from:"JavaScript vip课程",
                                            type:"添加",
                                            from_id:video._id,
                                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                                        })
                                        opera.save();
                                        console.log("[添加JavaScript(VIP)课程],课程:" + title);
                                        res.send("添加成功")
                                        delNoUseImg(6);
                                    }).catch(err => console.log(err))
                        }
                    })
            })
    
})

// 管理vip JavaScript课程
router.post("/vip/course/manage/js", passport.authenticate("jwt", {session:false}), (req, res) => {
    // 判断关键字是 更改还是删除
    const key = req.body.key;
    if(key == "del"){  // 删除
        VIPJSModel.findOneAndRemove({_id:req.body._id})
            .then(videos => {
                if(videos){
                    videos.save().then(what => {
                        const opera = new Operation({
                            from:"JavaScript vip课程",
                            type:"删除",
                            from_id:what._id,
                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                        })
                        opera.save()
                            .then(() => {
                                delNoUseImg(6);
                            }); 
                        console.log("[删除JavaScript课程],_id:" + req.body._id);
                        res.send("删除成功"); 

                        VIPJSModel.find()
                            .then(jss => {
                                jss.forEach((item, index) => {
                                    const nowVideo = {};
                                    nowVideo.index = index;
                                    VIPJSModel.findOneAndUpdate(
                                        {_id:item._id},
                                        {$set:nowVideo},
                                        {new:true}
                                    ).then(newVideo => {
                                        newVideo.save()
                                    })
                                })
                            })
                    })

                    

                    
                }
            })
    }else if(key == "mod"){  // 更改
        const nowVideo = {};
        nowVideo.title = req.body.title;
        nowVideo.src = req.body.src;
        nowVideo.poster = req.body.poster;
        VIPJSModel.findOneAndUpdate(
            {_id:req.body._id},
            {$set:nowVideo},
            {new:true}
        ).then(newVideo => {
            newVideo.save().then(() => {
                const opera = new Operation({
                    from:"JavaScript vip课程",
                    type:"更新",
                    from_id:newVideo._id,
                    date:new Date().format("yyyy/MM/dd HH:mm:ss")
                })
                opera.save();
                console.log("[修改JavaScript课程],_id:" + req.body._id);
                res.send("更改成功");
                delNoUseImg(6);
            })
        }).catch(err => console.log("更新失败"))
    }
})

// 模糊查询视频
router.post("/vip/course/search", passport.authenticate("jwt", {session:false}), (req, res) => {
    const type = req.body.type;
    const videoName = req.body.videoName.trim() + ".*";
    if(type == "html"){
        VIPHTMLModel.find({title:{ $regex: videoName, $options: 'i' }})
            .then(videos => {
                res.send(videos);
            })
    }else if(type == "css"){
        VIPCSSModel.find({title:{ $regex: videoName, $options: 'i' }})
            .then(videos => {
                res.send(videos);
            })
    }else{
        VIPJSModel.find({title:{ $regex: videoName, $options: 'i' }})
            .then(videos => {
                res.send(videos);
            })
    }
    
})

// 以用户名模糊搜索  HTML CSS JS 留言(社区不需要搜索)
router.post("/vip/course/message/search", passport.authenticate("jwt", {session:false}), (req, res) => {
    const key = req.body.key;
    const username = req.body.username.trim() + ".*";
    if(key == "html"){
        HTMLMessageModel.find({username:{ $regex: username, $options: 'i' }})
            .then(msgs => {
                res.send(msgs);
            })
    }else if(key == "css"){
        CSSMessageModel.find({username:{ $regex: username, $options: 'i' }})
            .then(msgs => {
                res.send(msgs);
            })
    }else{
        JSMessageModel.find({username:{ $regex: username, $options: 'i' }})
            .then(msgs => {
                res.send(msgs);
            })
    }
})


// 获取所有的社区留言
router.get("/community/message/all", passport.authenticate("jwt", {session:false}), (req, res) => {
    CommunityMessage.find()
        .then(msgs => {
            res.send(msgs)
        })
})

// 搜索社区留言
router.post("/community/message/search", passport.authenticate("jwt", {session:false}), (req, res) => {
    const username = req.body.username.trim() + ".*";
    CommunityMessage.find({username:{ $regex: username, $options: 'i' }})
            .then(msgs => {
                res.send(msgs);
            })
})


// 获取管理员操作日志
router.get("/operation", passport.authenticate("jwt", {session:false}), (req, res) => {
    Operation.find()
        .then(operations => {
            res.send(operations);
        })
})














// 导出组件
module.exports = router;