/*
 * @Author: Mr_Wei
 * @Description: 配置MongoDB,进行数据库的链接
 * @Date: 17:17 2019/6/22
 * @Param: mongodb.js
 * @return:
 **/

// 依赖
const mongoose = require("mongoose");
const mongodbURI = require("../config/mongodbURI").mongodbURI;

mongoose.connect(mongodbURI, {
            useNewUrlParser:true,
            useFindAndModify:false
        })
        .then(() => console.log("******MongoDB is Connected."))
        .catch(err => console.log(err))