/*
 * @Author: Mr_Wei
 * @Description: 创建用户签到日志模型
 * @Date: 09:15 2019/07/09
 * @Param: usersign_log.js
 * @return:
 **/

 const mongoose = require("mongoose");
 const Schema = mongoose.Schema;

 const usersign_log = new Schema({
     email:{
         required:true,
         type:String
     },
     username:{
         required:true,
         type:String
     },
     signTime:{
         required:true,
         type:String
     },
     signData:{
         required:true,
         type:String
     }
 })

 const UserSign_Log = mongoose.model("UserSign_Log", usersign_log);
 module.exports = UserSign_Log