/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 封装删除没有用到的资源函数
*  @Date: 2019/09/16 16:56
*
*/ 

const fs = require('fs');
const path = require('path');
const homeData = require("../model/indexModel");
const musicModel = require("../model/musicModel");
const userInfo = require("../model/userinfoModel");
const vipHTML = require("../model/viphtmlModel");
const vipCSS = require("../model/vipcssModel");
const vipJS = require("../model/vipjsModel");

// flag:
//      1.首页卡片
//      2.用户头像
//      3.歌曲图片
//      4.视频课程图片
String.prototype.endWith=function(endStr){
    var d=this.length-endStr.length;
    return (d>=0&&this.lastIndexOf(endStr)==d)
}

module.exports = (flag, className) => {

        let isPath = '';
        let mediaPath = "";
        if(flag == 1){
            isPath = "../static/cards";
        }
        if(flag == 2){
            isPath = "../static/user/" + className;
        }
        if(flag == 3){
            isPath = "../static/poster";
            mediaPath = "../static/music";
        }
        if(flag == 4){
            isPath = "../static/media/html"
        }
        if(flag == 5){
            isPath = "../static/media/css"
        }
        if(flag == 6){
            isPath = "../static/media/js"
        }
        let files = fs.readdirSync(path.resolve(__dirname, isPath));
        let mediaFiles = fs.readdirSync(path.resolve(__dirname, mediaPath));

        if(flag == 4){
            vipHTML.find()
                .then(htmls => {
                    let allVideos = [];
                    let allPoster = [];
                    files.forEach(item => {
                        if(item.endWith(".png")){
                            allPoster.push(item);
                        }else{
                            allVideos.push(item)
                        }
                    })
                    allPoster.forEach(poster => {
                        var isexist = false;
                        htmls.forEach(p => {
                            if(p.poster == poster){
                                isexist = true;
                            }
                        })
                        if(!isexist){
                            fs.unlinkSync(path.resolve(__dirname, "../static/media/html/" + poster))
                            console.log("删除闲置HTML封面资源:" + poster);
                        }
                    })
                    allVideos.forEach(video => {
                        var isexist = false;
                        htmls.forEach(v => {
                            if(v.src == video){
                                isexist = true;
                            }
                        })
                        if(!isexist){
                            fs.unlinkSync(path.resolve(__dirname, "../static/media/html/" + video))
                            console.log("删除闲置HTML视频资源:" + video);
                        }
                    })
                })
        }
        if(flag == 5){
            vipCSS.find()
                .then(csss => {
                    let allVideos = [];
                    let allPoster = [];
                    files.forEach(item => {
                        if(item.endWith(".png")){
                            allPoster.push(item);
                        }else{
                            allVideos.push(item)
                        }
                    })
                    allPoster.forEach(poster => {
                        var isexist = false;
                        csss.forEach(p => {
                            if(p.poster == poster){
                                isexist = true;
                            }
                        })
                        if(!isexist){
                            fs.unlinkSync(path.resolve(__dirname, "../static/media/css/" + poster))
                            console.log("删除闲置CSS封面资源:" + poster);
                        }
                    })
                    allVideos.forEach(video => {
                        var isexist = false;
                        csss.forEach(v => {
                            if(v.src == video){
                                isexist = true;
                            }
                        })
                        if(!isexist){
                            fs.unlinkSync(path.resolve(__dirname, "../static/media/css/" + video))
                            console.log("删除闲置CSS视频资源:" + video);
                        }
                    })
                })
        }
        if(flag == 6){
            vipJS.find()
                .then(jss => {
                    let allVideos = [];
                    let allPoster = [];
                    files.forEach(item => {
                        if(item.endWith(".png")){
                            allPoster.push(item);
                        }else{
                            allVideos.push(item)
                        }
                    })
                    allPoster.forEach(poster => {
                        var isexist = false;
                        jss.forEach(p => {
                            if(p.poster == poster){
                                isexist = true;
                            }
                        })
                        if(!isexist){
                            fs.unlinkSync(path.resolve(__dirname, "../static/media/js/" + poster))
                            console.log("删除闲置JavaScript封面资源:" + poster);
                        }
                    })
                    allVideos.forEach(video => {
                        var isexist = false;
                        jss.forEach(v => {
                            if(v.src == video){
                                isexist = true;
                            }
                        })
                        if(!isexist){
                            fs.unlinkSync(path.resolve(__dirname, "../static/media/js/" + video))
                            console.log("删除闲置JavaScript视频资源:" + video);
                        }
                    })
                })
        }


        if(flag == 2){
            userInfo.findOne({_id:className})
                .then(user => {
                    files.forEach(item => {
                        var isexist = false;
                        if(item != user.avatar){
                            isexist = true;
                        }
                        if(isexist){
                            fs.unlinkSync(path.resolve(__dirname, `${isPath}/${item}`))
                            console.log("删除没用的头像:" + item);
                        }
                    })
                })
        }
        if(flag == 3){
            musicModel.find()
                .then(imgs => {
                    files.forEach(item => {
                        var isexist = false;
                        imgs.forEach(p => {
                            if(p.pic == item){
                                isexist = true;
                            }
                        })
                        if(!isexist){
                            fs.unlinkSync(path.resolve(__dirname, `${isPath}/${item}`))
                            console.log("删除闲置歌曲图片资源:" + item);
                        }
                    })
                    mediaFiles.forEach(item => {
                        var isexist = false;
                        imgs.forEach(p => {
                            if(p.src == item){
                                isexist = true;
                            }
                        })
                        if(!isexist){
                            fs.unlinkSync(path.resolve(__dirname, `${mediaPath}/${item}`))
                            console.log("删除闲置歌曲资源:" + item);
                        }
                    })
                })
        }
        if(flag == 1){
            homeData.find()
                .then(imgs => {
                    files.forEach(item => {
                        var isexist = false;
                        imgs.forEach(p => {
                            if(p.img == item){
                                isexist = true;
                            }
                        })
                        if(!isexist){
                            fs.unlinkSync(path.resolve(__dirname, `${isPath}/${item}`))
                            console.log("删除闲置卡片资源:" + item);
                        }
                    })
                })
        }


        
    
}