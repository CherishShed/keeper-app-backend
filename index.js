const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const db = require("./model/database.model")
var corsOptions = {
    origin: "*"
}
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', async (req, res) => {
    const notes = await db.Notes.find();
    res.json(notes);
})
app.listen(8081, () => {
    console.log("listening on port 8081");
})