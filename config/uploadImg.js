/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 封装上传图片方法
*  @Date: 2019/09/16 08:35
*
*/ 

const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const formatTime = require('silly-datetime');
const userInfo = require("../model/userinfoModel");

// flag:
//      1.首页卡片
//      2.用户头像
//      3.歌曲图片
//      4.视频课程图片

/* 图片上传 */
module.exports = (req, res, flag, className) => {
    let isPath = '';
    let email = '';
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    if(flag == 1){  // 首页卡片
        isPath = "../static/cards";
    }
    if(flag == 2){  // 用户头像
        isPath = "../static/user/" + className;
        userInfo.findOne({_id:className})
            .then(user => {
                email = user.email;
            })
    }
    if(flag == 3){  // 歌曲图片
        isPath = "../static/poster";
    }
    if(flag == 4){  // 歌曲图片
        isPath = "../static/media/imgs";
    }
    if(flag == 5){  // html
        isPath = "../static/media/html";
    }
    if(flag == 6){  // css
        isPath = "../static/media/css";
    }
    if(flag == 7){  // js
        isPath = "../static/media/js";
    }
    form.uploadDir = path.join(__dirname, isPath);
    form.parse(req, (err, fields, files) => {
        let file = files.file;
        /* 如果出错，则拦截 */
        if(err) {
            return res.status(500).json({status: "500", result: '服务器内部错误'});
        }
        /* 拼接新的文件名 */
        let time = formatTime.format(new Date(), 'YYYYMMDDHHmmss');
        let num = Math.floor(Math.random() * 8999 + 10000);
        let imageName = `${time}_${num}.png`;
        let newPath = form.uploadDir + '/' + imageName;

        fs.rename(file.path, newPath, (err) => {
            if(err) {
                return res.status(412).json({status: "412", result: '上传失败'});
            } else {
                if(flag == 1){
                    res.send({'status': 200, 'msg': '卡片上传成功', result: {card: imageName}});
                }
                if(flag == 2){
                    res.send({'status': 200, 'msg': '头像上传成功', result: {avatar: imageName, email:email}});
                }
                if(flag == 3){
                    res.send({'status': 200, 'msg': '歌曲图片上传成功', result: {pic: imageName}});
                }
                if(flag == 4){
                    res.send({'status': 200, 'msg': '图片上传成功', result: {img: imageName}});
                }
                if(flag == 5){
                    res.send({'status': 200, 'msg': 'HTML图片上传成功', result: {poster: imageName}});
                }
                if(flag == 6){
                    res.send({'status': 200, 'msg': 'CSS图片上传成功', result: {poster: imageName}});
                }
                if(flag == 7){
                    res.send({'status': 200, 'msg': 'JavaScript图片上传成功', result: {poster: imageName}});
                }
            }
        })
    })
};
