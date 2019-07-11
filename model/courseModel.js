/*
 * @Author: Mr_Wei
 * @Description: 创建用户课程购买信息模型
 * @Date: 10:12 2019/07/07
 * @Param: courseModel.js
 * @return:
 **/


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseModel = new Schema({
    email:{
        required:true,
        type:String
    },
    html5:{
        type:String,
        default:0
    },
    css:{
        type:String,
        default:0
    },
    javascript:{
        type:String,
        default:0
    },
    startdate:{   // 购买日期
        type:String,
        default:0
    },
    enddate:{   // 到期日期
        type:String,
        default:0
    },
    buycount:{  // 购买次数
        type:String,
        default:0
    }
});

const Course = mongoose.model("Course", courseModel);
module.exports = Course;