/*
 * @Author: Mr_Wei
 * @Description: 创建用户登录日志模型
 * @Date: 08:54 2019/07/09
 * @Param: userlogin_log.js
 * @return:
 **/

 const mongoose = require("mongoose");
 const Schema = mongoose.Schema;

 const userlogin_log = new Schema({
     email:{
         type:String,
         required:true
     },
     username:{
         type:String,
         required:true
     },
     loginTime:{
         type:String,
         required:true
     }
 })

 const UserLogin_Log = mongoose.model("UserLogin_Log", userlogin_log);
 module.exports = UserLogin_Log