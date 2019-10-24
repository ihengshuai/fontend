/*
 * @Author: Mr_Wei
 * @Description: 创建VIP JavaScript课程模型
 * @Date: 15:20 2019/09/06
 * @Param: vipjsModel.js
 * @return:
 **/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vipJs = new Schema({
    title:{
        type:String,
        required:true
    },
    src:{
        type:String,
        required:true
    },
    poster:{
        type:String,
        required:true
    },
    index:{
        type:String
    }
})

const vipJsCourse = mongoose.model("vipJsCourse", vipJs);
module.exports = vipJsCourse