require("dotenv").config();
const database = require("../model/database.model");
const { Notes, User } = database
const fs = require('fs');
// const cheerio = require("cheerio");


const userController = {
    getUserdetails: async (req, res) => {
        const user = req.user;
        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                notes: user.notes,
                profilePic: user.profilePic,
                labels: user.labels
            }
        })
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
        console.log("in here")
        // console.log(req.user._id)
        User.findById(req.user._id).populate("labels.value")
            .then((result, error) => {
                if (error) {
                    res.json({ error, status: "error" })
                } else {
                    const foundLabel = result.labels.filter(labels => labels.key == req.params.key);
                    console.log(foundLabel);
                    res.json({ data: foundLabel[0], status: "success" })
                }
            });
    }
}

module.exports = userController;