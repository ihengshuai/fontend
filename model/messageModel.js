/*
 * @Author: Mr_Wei
 * @Description: 配置留言模型
 * @Date: 17:21 2019/6/22
 * @Param: messageModel.js
 * @return:
 **/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
*       留言内容由：email,username,content(内容),date组成
*/
const messageModel = new Schema({
    email:{
        required:true,
        type:String
    },
    username:{
        required:true,
        type:String
    },
    content:{
        required:true,
        type:String
    },
    date:{
        required:true,
        type,String
    }
});

const Message = mongoose.model("Message", messageModel);

// 导出模型
module.exports = { Message };