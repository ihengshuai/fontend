/*
 * @Author: Mr_Wei
 * @Description: 读取图片路由
 * @Date: 15:39 2019/07/08
 * @Param: readimgs.js
 * @return:
 **/

 const router = require("express").Router();
 const fs = require("fs");

 router.post("/:id", (req, res) => {
    const url = req.body.imgURL;
    readImg(url);
 })

 function readImg(path,res){
    fs.readFile(path, 'binary', (err, file) =>{
        if(err){
            console.log(err);
            return;
        }else{
            res.writeHead(200,  {'Content-Type':'image/jpeg'});
            res.write("./static/imgs/" + file,'binary');
            res.end();
        }
    });
}

 module.exports = router;