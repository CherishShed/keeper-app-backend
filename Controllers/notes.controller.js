require("dotenv").config();
const database = require("../models/database.model");
const User = database.User;
const fs = require('fs');
const cheerio = require("cheerio");
const Post = database.Post;
const Tag = database.Tag;