/*
 * @Author: Mr_Wei
 * @Description: 创建VIP CSS留言模型
 * @Date: 12:55 2019/09/08
 * @Param: vipcssModel.js
 * @return:
 **/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vipCssMessage = new Schema({
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

const cssMessageModel = mongoose.model("cssMessageModel", vipCssMessage);
module.exports = cssMessageModel