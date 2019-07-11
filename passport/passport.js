/*
 * @Author: Mr_Wei
 * @Description: 验证token值是否合法
 * @Date: 17:23 2019/6/22
 * @Param: passport.js
 * @return:
 **/

const UserInfo = require("../model/userinfoModel");
const Admin = require("../model/adminModel");
const key = require("../config/keys").KEYORSECRET;
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        UserInfo.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    } else {
                        Admin.findById(jwt_payload.id)
                                .then(admin => {
                                    if(admin){
                                        return done(null, admin);
                                    }else{
                                        return done(null, false);
                                        // or you could create a new account
                                    }
                                })
                    }
                })
    }));
}