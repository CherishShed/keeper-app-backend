require("dotenv").config();
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/notesDB");

userSchema.set("toJSON", { virtuals: true });
userSchema.plugin(passportLocalMongoose);

module.exports = { User, Post, Review, Tag };