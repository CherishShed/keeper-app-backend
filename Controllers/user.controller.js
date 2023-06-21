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
                lastName: user.lastName,
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
    },

    editOriginalProfileDetails: async (req, res) => {
        if (req.file) {
            console.log("uploaded");
            console.log(req.file);
            var profilePic = fs.readFileSync(req.file.path);
        }
        else {
            var profilePic = fs.readFileSync("avatar.png");

        }
        // cosnole.log(req.user._id);
        profilePic = profilePic.toString("base64");
        User.findByIdAndUpdate(req.user._id, { $set: { profilePic: profilePic, firstName: toTitleCase(req.body.firstName), lastName: toTitleCase(req.body.lastName) } })
            .then((result) => {
                console.log("done");
                if (req.file) {
                    if (fs.existsSync(req.file.path)) {
                        fs.unlink(req.file.path, (err) => {
                            if (err) throw err;
                        });
                    }
                    res.json({ data: result, success: true, message: "Succesful" })
                }
            })
            .catch(error => {
                res.json({ error, success: false, message: "Error Occured" });
            })

    }
}
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
module.exports = userController;