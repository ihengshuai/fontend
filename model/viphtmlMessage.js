/*
 * @Author: Mr_Wei
 * @Description: 创建VIP HTML留言模型
 * @Date: 15:07 2019/09/06
 * @Param: viphtmlModel.js
 * @return:
 **/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vipHtmlMessage = new Schema({
    username:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    messageTime:{
        type:String,
        required:true
    }
})

const htmlMessageModel = mongoose.model("htmlMessageModel", vipHtmlMessage);
module.exports = htmlMessageModel