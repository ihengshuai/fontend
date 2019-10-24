/*
 * @Author: Mr_Wei
 * @Description: 创建VIP HTML课程模型
 * @Date: 15:07 2019/09/06
 * @Param: viphtmlModel.js
 * @return:
 **/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vipHtml = new Schema({
    title:{
        type:String,
        required:true
    },
    src:{
        type:String,
        required:true
    },
    poster:{
        type:String,
        required:true
    },
    index:{
        type:String
    }
})

const vipHtmlCourse = mongoose.model("vipHtmlCourse", vipHtml);
module.exports = vipHtmlCourse