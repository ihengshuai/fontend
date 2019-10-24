/*
 * @Author: Mr_Wei
 * @Description: JavaScript文章模型
 * @Date: 11:08 2019/07/25
 * @Param: javascriptModel.js
 * @return:
 **/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const javascriptmodel = new Schema({
    coursetype:{
        required:true,
        type:String
    },
    title:{
        required:true,
        type:String
    },
    content:{
        required:true,
        type:String
    }
})

const JavaScriptModel = mongoose.model("JavaScriptModel", javascriptmodel);
module.exports = JavaScriptModel