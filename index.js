const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
var corsOptions = {
    origin: "*"
}
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());

app.listen(8081, () => {
    console.log("listening on port 8081");
})