/*
 * @Author: Mr_Wei
 * @Description: 留言墙的留言和 获取15条留言
 * @Date: 16:26 2019/09/16
 * @Param: messagewall.js
 * @return:
 **/

const router = require("express").Router();
const MessageWall = require("../model/messageModel");
const $ = require("jquery")
const path = require("path");
const fs = require("fs");

// 留言
router.post("/add", (req, res) => {
    let allavatar = fs.readdirSync(path.resolve(__dirname, "../static/avatar"));
    const username = req.body.username;
    const content = req.body.content;
    const avatar = allavatar[Math.floor(Math.random() * allavatar.length)];
    const date = req.body.date;
    const email = req.body.email ? req.body.email : "";
    const qq = req.body.qq ? req.body.qq : "";
    const city = req.body.city ? req.body.city : "";

    const newMessageNote = new MessageWall({
        username,content,avatar,date,email,qq,city
    });

    newMessageNote.save().then(() => {
        MessageWall.find()
            .then(msgs => {
                console.log("[留言成功], 日期:" + date);
                res.send(msgs.slice(-15))
            })
    })
})

// 获取15条留言
router.get("/all", (req, res) => {
    MessageWall.find()
        .then(msgs => {
            if(msgs.length){
                if(msgs.length < 16){
                    res.send(msgs);
                }else{
                    var arrNum = [];
                    var resultNote = [];
                    for(var i = 0; i < msgs.length; i++){
                        var randomNumber = Math.floor(Math.random() * msgs.length);
                        if(arrNum.length > 14){
                            res.send(resultNote);
                            return;
                        }else{
                            //判断随机数是否在数组里，随机打乱名字顺序
                            if (isInArray(arrNum, randomNumber)) {
                                i = i - 1;
                            }else{
                                arrNum.push(randomNumber);
                                resultNote.push(msgs[randomNumber])
                            }
                        }
                    }
                }
            }else{
                res.status(400).send("留言数据为空");
            }
            function isInArray(arr,value){
                var flag = false;
                for(let i = 0; i < arr.length; i++){
                    if(arr[i] == value){
                        flag = true;
                        break;
                    }
                }
                return flag;
            }
            
        })
})

// 获取头像资源
router.get("/avatar", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../static/avatar/" + req.query.avatar))
})
module.exports = router;
