const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const UserModel = mongoose.model("users");//require("../models/user");
const configuration = require("../config/configuration");

// extract options
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = configuration.secretOrKey;

module.exports = function(passport){
    passport.use(
        new JwtStrategy(options, (jwt_payload, done)=>{
            // get the user
            UserModel.findById(jwt_payload.id)
            .then(user => {
                if(user){
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err)); //// TODO: change console log
        })
    );
};