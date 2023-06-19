require("dotenv");
const { User, Notes } = require("../model/database.model");
const passport = require("passport");
const jwt = require("jsonwebtoken")
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findById(jwt_payload.id).populate("notes")
        .then((user, err) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
}));

module.exports = passport;