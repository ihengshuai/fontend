/*
 * @Author: Mr_Wei
 * @Description: 创建用户简单模型
 * @Date: 17:19 2019/6/22
 * @Param: userModel.js
 * @return:
 **/


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

/**
*   以email作为用户的唯一标识,每个用户对应四个字段:email,username,password,date,signdate,phone
*   用bcrypt对密码进行加密
*/
const userModel = new Schema({
    username:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String,
        set(val){  // 加密密码
            return bcrypt.hashSync(val, 10);
        }
    },
    email:{
        required:true,
        type:String
    },
    phone:{
        required:true,
        type:String
    },
    signdate:{
        type:String,
        default:""
    },
    avatar:{
        type:String
    },
    date:{
        type:String,
        required:true
    }
});

// const User = mongoose.model("User", userModel);

// 导出模型
module.exports = mongoose.model("User", userModel);