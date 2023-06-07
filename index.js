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

app.get('/', notesController.getAllNotes);
app.post('/', notesController.createNote);
app.delete('/:id', notesController.deleteNote);

app.listen(8081, () => {
    console.log("listening on port 8081");
})