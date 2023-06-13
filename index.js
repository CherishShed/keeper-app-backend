const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const db = require("./model/database.model");
const notesController = require('./Controllers/notes.controller');
var corsOptions = {
    origin: "*"
}

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());
app.get("/me", (req, res) => {
    res.redirect("/footer");
})
app.get('/api', notesController.getAllNotes);
app.post('/api', notesController.createNote);
app.delete('/api/:id', notesController.deleteNote);

app.listen(8081, () => {
    console.log("listening on port 8081");
})