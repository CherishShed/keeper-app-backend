require("dotenv").config();
const database = require("../model/database.model");
const { Notes, User } = database
const fs = require('fs');
// const cheerio = require("cheerio");


const userController = {
    getUserdetails: async (req, res) => {
        const test = false;
        if (test) {
            res.json({ status: "noAuth", redirect: "/footer" })
        } else {
            User.findOne({})
                .then((user, err) => {
                    if (err) {
                        res.json({ error: err, status: "error" });
                    } else {
                        res.json({ data: user, status: "success" });
                    }
                })
        }
    },
    createLabel: async (req, res) => {
        const { title, content } = req.body;
        const newNote = new User({
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
    deleteLabel: async (req, res) => {
        User.findByIdAndDelete(req.params.id)
            .then((result, error) => {
                // console.log(result);
                if (error) {
                    res.json({ error, status: "error" })
                } else {
                    res.json({ data: result, status: "success" })
                }
            });
    },
    getLabelDetails: async (req, res) => {
        User.findOne({})
            .then((result, error) => {
                // console.log(result);
                if (error) {
                    res.json({ error, status: "error" })
                } else {
                    const foundLabel = result.labels.filter(labels => labels._id == req.params.id);
                    res.json({ data: foundLabel[0], status: "success" })
                }
            });
    }
}

module.exports = userController;