require("dotenv").config();
const database = require("../model/database.model");
const { Notes, User } = database
const fs = require('fs');
const { hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
// const cheerio = require("cheerio");


const userController = {
    registerUser: async (req, res) => {
        const user = new User({
            username: req.body.username,
            password: hashSync(req.body.password, 10)
        })
        user.save()
            .then((user) => {
                res.send({ success: true, user: { id: user._id, username: user.username }, message: "Registration successful, Proceed to Login Page" });
            })
            .catch((error) => {
                res.send({ success: false, error, message: "Error Occured" })
            })
    },
    loginUser: async (req, res) => {
        User.findOne({ username: req.body.username })
            .then((user) => {
                if (!user) {
                    return res.send({ success: false, message: "User not found" })
                }
                if (!(compareSync(req.body.password, user.password))) {
                    return res.send({ success: false, message: "Incorrect Password" })
                }
                const payload = {
                    username: user.username, id: user._id
                }
                const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });
                res.status(200).send({ success: true, message: "Login Success", token: "Bearer " + token });
            })
    },
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
        const { key } = req.body;
        User.findById(req.user._id)
            .then((user, err) => {
                if (err) {
                    res.status(400).json({ error: err, status: "error" })
                }
                user.labels.push({ key: key, value: [] });
                user.save();
                res.status(200).json({ data: user.labels, status: "success" })
            })
            .catch((err) => {
                res.status(400).json({ error: err, status: "error" })
            })
    },
    editLabel: async (req, res) => {
        const { oldKey, newKey } = req.body;
        User.findById(req.user._id)
            .then((user, err) => {
                if (err) {
                    res.status(400).json({ error: err, status: "error" })
                }
                for (i of user.labels) {
                    if (i.key == oldKey) {
                        i.key = newKey;
                    }
                }
                user.save();
                res.status(200).json({ data: user.labels, status: "success" })
            })
            .catch((err) => {
                res.status(400).json({ error: err, status: "error" })
            })
    },
    deleteLabel: async (req, res) => {
        User.findByIdAndDelete(req.params.id)
            .then((result, error) => {
                if (error) {
                    res.json({ error, status: "error" })
                } else {
                    res.json({ data: result, status: "success" })
                }
            });
    },
    getLabelDetails: async (req, res) => {

        User.findById(req.user._id).populate("labels.value")
            .then((result, error) => {
                if (error) {
                    res.json({ error, status: "error" })
                } else {
                    const foundLabel = result.labels.filter(labels => labels.key == req.params.key);
                    res.json({ data: foundLabel[0], status: "success" })
                }
            });
    },

    editOriginalProfileDetails: async (req, res) => {
        if (req.file) {
            var profilePic = fs.readFileSync(req.file.path);
        }
        else {
            var profilePic = fs.readFileSync("avatar.png");

        }
        // cosnole.log(req.user._id);
        profilePic = profilePic.toString("base64");
        User.findByIdAndUpdate(req.user._id, { $set: { profilePic: profilePic, firstName: toTitleCase(req.body.firstName), lastName: toTitleCase(req.body.lastName) } })
            .then((result) => {
                if (req.file) {
                    if (fs.existsSync(req.file.path)) {
                        fs.unlink(req.file.path, (err) => {
                            if (err) throw err;
                        });
                    }
                }
                res.json({ data: result, success: true, message: "Succesful" })
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