/*
 * @Author: Mr_Wei
 * @Description: 创建用户信息模型
 * @Date: 09:58 2019/07/07
 * @Param: userinfoModel.js
 * @return:
 **/

 const mongoose = require("mongoose");
 const Schema = mongoose.Schema;


 const userinfoModel = new Schema({
     username:{  // 用户名
         required:true,
         type:String
     },
     email:{   // 邮箱
         required:true,
         type:String
     },
     phone:{   // 电话
         required:true,
         type:String
     },
     avatar:{   // 头像
        type:String,
        default:"default.png"
     },
     signdate:{  // 签到时间
         type:String,
         default:"yyyy-MM-dd",
     },
     signcount:{   // 签到次数
         type:String,
         default:0
     },
     money:{   // 账户余额
         type:String,
         default:20
     }
 });

 const UserInfo = mongoose.model("UserInfo", userinfoModel);

 module.exports = UserInfo;