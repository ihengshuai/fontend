/*
 * @Author: Mr_Wei
 * @Description: 存取歌曲信息
 * @Date: 11:46 2019/08/26
 * @Param: musicModel.js
 * @return:
 **/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const musicModel = new Schema({
    //  歌名
    title:{
        required:true,
        type:String
    },
    // 作者
    artist:{
        required:true,
        type:String
    },
    // 歌曲地址
    src:{
        required:true,
        type:String
    },
    // 封面
    pic:{
        type:String
    },

});

module.exports = mongoose.model("MusicPlayer", musicModel); 