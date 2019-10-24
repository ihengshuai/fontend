/*
 * @Author: Mr_Wei
 * @Description: 管理员操作日志模型
 * @Date: 08:23 2019/09/23
 * @Param: operation.js
 * @return:
 **/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const operationModel = new Schema({
    from:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    from_id:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("operation", operationModel);