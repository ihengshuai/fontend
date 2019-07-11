/*
 * @Author: Mr_Wei
 * @Description: 获取所有的文章
 * @Date: 17:12 2019/07/09
 * @return:
 **/


 const router = require("express").Router();
 const HTML5Model = require("../model/html5Model");

//  获取HTML文章
 router.get("/html5", (req, res) => {
     HTML5Model.find()
                .then(html5 => {
                    res.send(html5);
                })
 })


//  文章的查询
 router.post("/search", (req, res) => {
     const search = req.body.search.trim() + ".*";
     HTML5Model.find({content:{ $regex: search, $options: 'i' }})
                .then(article => {
                    res.send(article);
                })
 })

 module.exports = router;
