/*
 * @Author: Mr_Wei
 * @Description: 创建VIP CSS课程模型
 * @Date: 15:13 2019/09/06
 * @Param: vipcssModel.js
 * @return:
 **/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vipCss = new Schema({
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

const vipCssCourse = mongoose.model("vipCssCourse", vipCss);
module.exports = vipCssCourse