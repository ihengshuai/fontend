/*
 * @Author: Mr_Wei
 * @Description: 获取所有的文章
 * @Date: 17:12 2019/07/09
 * @return:
 **/


 const router = require("express").Router();
 const HTML5Model = require("../model/html5Model");
 const CSSModel = require("../model/cssModel");
 const JavaScriptModel = require("../model/javascriptModel");
 const passport = require("passport");
 const key = require("../config/keys").KEYORSECRET;

//  获取所有HTML文章
 router.get("/html5", (req, res) => {
     HTML5Model.find()
                .then(html5 => {
                    res.send(html5);
                })
 })
//  以title查询HTML文章
router.post("/type/html", (req, res) => {
    const title = req.body.title;
    HTML5Model.findOne({title})
            .then(article => {
                if(article){
                    res.send(article)
                }else{
                    res.status(400).send("文章不存在");
                }
            })
    
})

// 获取所有CSS文章
router.get("/css", (req, res) => {
    CSSModel.find()
            .then(css => {
                res.send(css);
            })
})
//  以title查询css文章
router.post("/type/css", (req, res) => {
    const title = req.body.title;
    CSSModel.findOne({title})
            .then(article => {
                if(article){
                    res.send(article)
                }else{
                    res.status(404).send("文章不存在");
                }
            })
    
})

// 获取所有JavaScript文章
router.get("/javascript", (req, res) => {
    JavaScriptModel.find()
            .then(javascript => {
                res.send(javascript);
            })
})
//  以title查询JavaScript文章
router.post("/type/javascript", (req, res) => {
    const title = req.body.title;
    JavaScriptModel.findOne({title})
            .then(article => {
                if(article){
                    res.send(article)
                }else{
                    res.status(404).send("文章不存在");
                }
            })
    
})


// 获取所有的HTML/CSS/Javascript文章
router.get("/all", passport.authenticate("jwt", {session:false}), (req, res) => {
    var allArticles = [];
    // 查询所有文章
    HTML5Model.find()
        .then(html5s => {
            allArticles = html5s;

            CSSModel.find()
                .then(csss => {
                    for(let i = 0; i < csss.length; i++){
                        allArticles[allArticles.length] = csss[i];
                    }
                    
                    JavaScriptModel.find()
                        .then(javascripts => {
                            for(let i = 0; i < javascripts.length; i++){
                                allArticles[allArticles.length] = javascripts[i];
                            }

                            res.send(allArticles);
                        })
                })
        })
});


//  文章的查询
 router.post("/search", (req, res) => {
     const search = req.body.search.trim() + ".*";
     const result = [];
     HTML5Model.find({content:{ $regex: search, $options: 'i' }})
                .then(article => {

                    if(article.length){
                        article.forEach(item => {
                            result[result.length] = item;
                        })
                    }
                    CSSModel.find({content:{ $regex: search, $options: 'i' }})
                        .then(csss => {
                            if(csss.length){
                                csss.forEach(item => {
                                    result[result.length] = item;
                                })
                            }

                            JavaScriptModel.find({content:{ $regex: search, $options: 'i' }})
                                .then(jss => {
                                    if(jss.length){
                                        jss.forEach(item => {
                                            result[result.length] = item;
                                        })
                                    }
                                    res.send(result);
                                })
                        })
                   
                })
 })

 module.exports = router;
