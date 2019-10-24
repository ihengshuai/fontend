/*
 * @Author: Mr_Wei
 * @Description: 获取VIP课程相关信息
 * @Date: 15:25 2019/09/06
 * @Param: vipcourse.js
 * @return:
 **/

 const path = require("path");
 const router = require("express").Router();
 const VIPHTMLModel = require("../model/viphtmlModel");
 const VIPCSSModel = require("../model/vipcssModel");
 const VIPJSModel = require("../model/vipjsModel");
 const HTMLMessageModel = require("../model/viphtmlMessage");
 const CSSMessageModel = require("../model/vipcssMessage");
 const JSMessageModel = require("../model/vipjsMessage");
 const passport = require("passport");
 require("../config/Date");

// 获取html封面
router.get("/html/poster", (req, res) => {
    const src = req.query.src;
    res.sendFile(path.resolve(__dirname, `../static/media/html/${src}`))
})
// 获取html视频资源
router.get("/html/video", (req, res) => {
    const src = req.query.src;
    res.sendFile(path.resolve(__dirname, `../static/media/html/${src}`))
})

// 获取vip 所有HTML课程播放列表
router.get("/html/all", passport.authenticate("jwt", {session:false}), (req, res) => {
    VIPHTMLModel.find()
            .then(htmlvideos => {
                res.send(htmlvideos)
            })
})


// 获取css封面
router.get("/css/poster", (req, res) => {
    const src = req.query.src;
    res.sendFile(path.resolve(__dirname, `../static/media/css/${src}`))
})
// 获取css视频资源
router.get("/css/video", (req, res) => {
    const src = req.query.src;
    res.sendFile(path.resolve(__dirname, `../static/media/css/${src}`))
})

// 获取vip 所有CSS课程播放列表
router.get("/css/all", passport.authenticate("jwt", {session:false}), (req, res) => {
    VIPCSSModel.find()
            .then(cssvideos => {
                res.send(cssvideos)
            })
})


// 获取JavaScript封面
router.get("/js/poster", (req, res) => {
    const src = req.query.src;
    res.sendFile(path.resolve(__dirname, `../static/media/js/${src}`))
})
// 获取Javascript视频资源
router.get("/js/video", (req, res) => {
    const src = req.query.src;
    res.sendFile(path.resolve(__dirname, `../static/media/js/${src}`))
})

// 获取vip 所有JavaScript课程播放列表
router.get("/js/all", passport.authenticate("jwt", {session:false}), (req, res) => {
    VIPJSModel.find()
            .then(jsvideos => {
                res.send(jsvideos)
            })
})

// 以id获取课程
router.post("/seid", passport.authenticate("jwt", {session:false}), (req, res) => {
    const key = req.body.key;
    const _id = req.body._id.trim();
    if(key == "html"){
        VIPHTMLModel.findOne({_id})
            .then(video => {
                res.send(video);
            }).catch(() => {
                VIPHTMLModel.find()
                        .then(wsm => {
                            res.send(wsm[0])
                        })
            })
    }else if(key == "css"){
        VIPCSSModel.findOne({_id})
            .then(video => {
                res.send(video)
            }).catch(() => {
                VIPCSSModel.find()
                        .then(wsm => {
                            res.send(wsm[0])
                        })
            })
    }else{
        VIPJSModel.findOne({_id})
            .then(video => {
                res.send(video)
            }).catch(() => {
                VIPJSModel.find()
                        .then(wsm => {
                            res.send(wsm[0])
                        })
            })
    }
})

// html 留言
router.post("/html/message/add", passport.authenticate("jwt", {session:false}), (req, res) => {
    const username = req.body.username;
    const avatar = req.body.avatar;
    const comment = req.body.comment;
    const email = req.body.email;
    const messageTime = new Date().format("yyyy/MM/dd HH:mm:ss");
    const newMessage = new HTMLMessageModel({
        username,
        avatar,
        comment,
        messageTime,
        email
    })
    newMessage.save().then(() => res.send("OK"));
})

// 获取所有的HTML课程留言
router.get("/html/message/all", passport.authenticate("jwt", {session:false}), (req, res) => {
    HTMLMessageModel.find()
        .then(msgs => {
            res.send(msgs);
        })
})

// 以id删除HTML留言
router.post("/html/message/del", passport.authenticate("jwt", {session:false}), (req, res) => {
    const _id = req.body._id;
    HTMLMessageModel.findOneAndRemove({_id})
        .then(msgs => {
            res.send("删除成功");
            console.log("[删除HTML留言],_id:" + _id);
        })
})

// css 留言
router.post("/css/message/add", passport.authenticate("jwt", {session:false}), (req, res) => {
    const username = req.body.username;
    const avatar = req.body.avatar;
    const comment = req.body.comment;
    const email = req.body.email;
    const messageTime = new Date().format("yyyy/MM/dd HH:mm:ss");
    const newMessage = new CSSMessageModel({
        username,
        avatar,
        comment,
        messageTime,
        email
    })
    newMessage.save().then(() => res.send("OK"));
})


// 获取所有的HTML课程留言
router.get("/css/message/all", passport.authenticate("jwt", {session:false}), (req, res) => {
    CSSMessageModel.find()
        .then(msgs => {
            res.send(msgs);
        })
})

// 以id删除HTML留言
router.post("/css/message/del", passport.authenticate("jwt", {session:false}), (req, res) => {
    const _id = req.body._id;
    CSSMessageModel.findOneAndRemove({_id})
        .then(msgs => {
            res.send("删除成功");
            console.log("[删除CSS留言],_id:" + _id);
        })
})

// JavaScript 留言
router.post("/js/message/add", passport.authenticate("jwt", {session:false}), (req, res) => {
    const username = req.body.username;
    const avatar = req.body.avatar;
    const comment = req.body.comment;
    const email = req.body.email;
    const messageTime = new Date().format("yyyy/MM/dd HH:mm:ss");
    const newMessage = new JSMessageModel({
        username,
        avatar,
        comment,
        messageTime,
        email
    })
    newMessage.save().then(() => res.send("OK"));
})

// 获取所有的JavaScript课程留言
router.get("/js/message/all", passport.authenticate("jwt", {session:false}), (req, res) => {
    JSMessageModel.find()
        .then(msgs => {
            res.send(msgs);
        })
})

// 以id删除HTML留言
router.post("/js/message/del", passport.authenticate("jwt", {session:false}), (req, res) => {
    const _id = req.body._id;
    JSMessageModel.findOneAndRemove({_id})
        .then(msgs => {
            res.send("删除成功");
            console.log("[删除JavaScript留言],_id:" + _id);
        })
})



 module.exports = router