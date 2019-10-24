/*
 * @Author: Mr_Wei
 * @Description: 获取所有的音乐
 * @Date: 11:56 2019/08/26
 * @return:
 **/

 const router = require("express").Router();
 const MusicPlayer = require("../model/musicModel");
 const fs = require("fs");
 const path = require("path");

//  获取所有的歌曲信息
router.get("/all", (req, res) => {
    MusicPlayer.find()
        .then(music => {
            res.send(music);
        })
})

// 搜索歌曲
router.post("/songs/search", (req ,res) => {
    const songName = req.body.songName.trim() + ".*";
    MusicPlayer.find({title:{ $regex: songName, $options: 'i' }})
            .then(songs => {
                if(songs.length){
                    res.send(songs);
                }else{
                    MusicPlayer.find({artist:{$regex: songName, $options: "i"}})
                            .then(artists => {
                                res.send(artists);
                            })
                }
            })
})

// 获取歌曲海报
router.get("/poster", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../static/poster/" + req.query.img))
})

// 获取歌曲音频
router.get("/audio", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../static/music/" + req.query.audio))
})

 module.exports = router