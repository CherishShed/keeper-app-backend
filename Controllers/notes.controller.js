require("dotenv").config();
const database = require("../model/database.model");
const { User, Notes } = database
const fs = require('fs');
const cheerio = require("cheerio");


const notesController = {
    getAllNotes: async (req, res) => {
        Notes.find({})
            .then((err, notes) => {
                if (err) {
                    res.json({ error: err, status: "error" });
                } else {
                    res.json({ data: notes, status: "success" });
                }
            })
    },
    createNote: async (req, res) => {
        const { title, content } = req.body;
        const newNote = new Note({
            title, content
        })
        newNote.save()
            .then((error, result) => {
                if (error) {
                    res.json({ error, status: "error" })
                } else {
                    res.json({ data: result, status: "success" })
                }
            });
    }
}

module.exports = notesController;