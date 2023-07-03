require("dotenv").config();
const express = require('express');
const app = express();
const session = require("express-session");
const cors = require('cors');
const passport = require("./auth.middleware");
var corsOptions = {
    origin: "*"
}
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use(
    '/',
    createProxyMiddleware({
        target: 'http://localhost:3000',
        changeOrigin: true,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public", { root: __dirname }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(session({
    secret: process.env.LOCAL_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

module.exports = app;
