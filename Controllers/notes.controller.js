require("dotenv").config();
const database = require("../model/database.model");
const { User, Notes } = database
const fs = require('fs');
// const cheerio = require("cheerio");


const notesController = {
    getAllNotes: async (req, res) => {
        const test = false;
        if (test) {
            res.json({ status: "noAuth", redirect: "/footer" })
        } else {
            Notes.find({})
                .then((notes, err) => {
                    if (err) {
                        res.json({ error: err, status: "error" });
                    } else {
                        res.json({ data: notes, status: "success" });
                    }
                })
        }
    },
    createNote: async (req, res) => {
        const { title, content } = req.body;
        const newNote = new Notes({
            title, content
        })
        newNote.save()
            .then((result, error) => {
                if (error) {
                    res.json({ error, status: "error" })
                } else {
                    res.json({ data: result, status: "success" })
                }
            });
    },
    deleteNote: async (req, res) => {
        Notes.findByIdAndDelete(req.params.id)
            .then((result, error) => {
                // console.log(result);
                if (error) {
                    res.json({ error, status: "error" })
                } else {
                    res.json({ data: result, status: "success" })
                }
            });
    }
}

module.exports = notesController;