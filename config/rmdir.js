/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 封装删除用户文件
*  @Date: 2019/09/26 13:06
*
*/ 
const fs = require("fs");
const path = require("path");
module.exports = dir => {
    let files = fs.readdirSync(dir)
    for(var i=0;i<files.length;i++){
      let newPath = path.join(dir,files[i]);
      let stat = fs.statSync(newPath)
      if(stat.isDirectory()){
        removeDir(newPath);
      }else {
       //删除文件
        fs.unlinkSync(newPath);
      }
    }
    fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
    console.log("删除用户文件夹,"+ dir);
}