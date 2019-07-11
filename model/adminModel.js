/*
 * @Author: Mr_Wei
 * @Description: 管理员模型
 * @Date: 17:20 2019/6/22
 * @Param: adminModel.js
 * @return:
 **/

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminModel = new Schema({
    email:{
        required:true,
        type:String
    },
    username:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String,
        set(val){
            return bcrypt.hashSync(val, 10);
        }
    },
    date:{
        required:true,
        type:String
    }
});

module.exports = mongoose.model("Admin", adminModel);