/*
 * @Author: Mr_Wei
 * @Description: 创建初始化页面的数据模型
 * @Date: 09:24 2019/07/01
 * @Param: indexModel.js
 * @return:
 **/


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const indexModel = new Schema({
    url:{
        required:true,
        type:String
    },
    img:{
        required:true,
        type:String,
    },
    title:{
        required:true,
        type:String
    },
    content:{
        type:String,
        required:true
    }
});

// const User = mongoose.model("User", userModel);

// 导出模型
module.exports = mongoose.model("homepage", indexModel);