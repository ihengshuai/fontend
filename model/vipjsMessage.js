/*
 * @Author: Mr_Wei
 * @Description: 创建VIP JavaScript留言模型
 * @Date: 12:56 2019/09/08
 * @Param: vipjsModel.js
 * @return:
 **/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vipJsMessage = new Schema({
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

const jsMessageModel = mongoose.model("jsMessageModel", vipJsMessage);
module.exports = jsMessageModel