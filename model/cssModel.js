/*
 * @Author: Mr_Wei
 * @Description: CSS文章模型
 * @Date: 11:07 2019/07/25
 * @Param: cssModel.js
 * @return:
 **/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cssmodel = new Schema({
    coursetype:{
        required:true,
        type:String
    },
    title:{
        required:true,
        type:String
    },
    content:{
        required:true,
        type:String
    }
})

const CSSModel = mongoose.model("CSSModel", cssmodel);
module.exports = CSSModel