/*
 * @Author: Mr_Wei
 * @Description: 创建用户注册日志模型
 * @Date: 09:06 2019/07/09
 * @Param: userregister_log.js
 * @return:
 **/

 const mongoose = require("mongoose");
 const Schema = mongoose.Schema;

 const userregister_log = new Schema({
     email:{
         type:String,
         required:true
     },
     username:{
         type:String,
         required:true
     },
     userID:{
         type:String,
         required:true
     },
     registerTime:{
         type:String,
         required:true
     }
 })

 const UserRegister_Log = mongoose.model("UserRegister_Log", userregister_log);
 module.exports = UserRegister_Log