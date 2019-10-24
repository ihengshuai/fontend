/*
 * @Author: Mr_Wei
 * @Description: 获取初始化页面的数据
 * @Date: 09:26 2019/07/01
 * @Param: index.js
 * @return:
 **/

const router = require("express").Router();
const Index = require("../model/indexModel");
const fs = require("fs");
const path = require("path");

router.post("/a", (req, res) => {
    const url = req.body.url;
    const img = req.body.img;
    const title = req.body.title;
    const content = req.body.content;

    const newIndex = new Index({
        url,img,title,content
    });
    newIndex.save().then(() => res.send("OK"))
})

router.get("/", (req, res) => {
    Index.find()
            .then(data => {
                res.send(data);
            })
})

// 搜索卡片
router.post("/search", (req, res) => {
    const cardName = req.body.cardName.trim() + ".*";
    Index.find({title : {$regex: cardName, $options : "i"}})
        .then(cards => {
            res.send(cards);
        })
})


// 获取card图片资源
router.get("/img", async(req ,res) => {
    res.sendFile(path.resolve(__dirname, "../static/cards/" + req.query.name))
})

module.exports = router;