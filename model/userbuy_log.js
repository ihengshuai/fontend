/*
 * @Author: Mr_Wei
 * @Description: 创建用户购买课程日志模型
 * @Date: 09:26 2019/07/09
 * @Param: userbuy_log.js
 * @return:
 **/

 const mongoose = require("mongoose");
 const Schema = mongoose.Schema;

 const userbuy_log = new Schema({
     email:{
         type:String,
         required:true,
     },
     username:{
         type:String,
         required:true
     },
     courseType:{
         required:true,
         type:String
     },
     totalMoney:{
        required:true,
        type:String
     },
     buyTime:{
         required:true,
         type:String
     }
 })

 const UserBuy_Log = mongoose.model("UserBuy_Log", userbuy_log);
 module.exports = UserBuy_Log