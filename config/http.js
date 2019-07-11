/*
 * @Author: Mr_Wei
 * @Description: 配置跨域
 * @Date: 17:13 2019/6/22
 * @Param: http.js
 * @return:
 **/
module.exports = app => {
    app.all("*", (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

        if(req.method == 'OPTIONS') {
            res.sendStatus(200); // 让options请求快速返回
        }
        else{
            next();
        }
    })
}