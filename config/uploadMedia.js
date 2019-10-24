/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 封装上传多媒体
*  @Date: 2019/09/16 08:35
*
*/ 

const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const formatTime = require('silly-datetime');

// flag:
//      3.歌曲
//      4.视频课程

/* 图片上传 */
module.exports = (req, res, flag) => {
    let isPath = '';
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    if(flag == 3){  // 歌曲
        isPath = "../static/music";
    }
    if(flag == 4){  // html视频
        isPath = "../static/media/html";
    }
    if(flag == 5){  // html视频
        isPath = "../static/media/css";
    }
    if(flag == 6){  // html视频
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
        let imageName = "";
        if(flag == 3){
            imageName = `${time}_${num}.mp3`;
        }
        if(flag == 4 || flag == 5 || flag == 6){
            imageName = `${time}_${num}.mp4`;
        }
        let newPath = form.uploadDir + '/' + imageName;

        fs.rename(file.path, newPath, (err) => {
            if(err) {
                return res.status(412).json({status: "412", result: '上传失败'});
            } else {
                if(flag == 3){
                    res.send({'status': 200, 'msg': '歌曲上传成功', result: {music: imageName}});
                }
                if(flag == 4){
                    res.send({'status': 200, 'msg': 'HTML视频上传成功', result: {video: imageName}});
                }
                if(flag == 5){
                    res.send({'status': 200, 'msg': 'CSS视频上传成功', result: {video: imageName}});
                }
                if(flag == 6){
                    res.send({'status': 200, 'msg': 'JavaScript视频上传成功', result: {video: imageName}});
                }
            }
        })
    })
};
