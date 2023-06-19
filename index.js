const express = require('express');
require("dotenv");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { User, Notes } = require("./model/database.model");
const notesController = require('./Controllers/notes.controller');
const userController = require('./Controllers/user.controller');
const { hashSync, compareSync } = require("bcrypt")
const passport = require("./middleware/auth.middleware");
const jwt = require("jsonwebtoken")
var corsOptions = {
    origin: "*"
}

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());
app.get("/me", (req, res) => {
    res.redirect("/footer");
})
app.get("/api/getUser", userController.getUserdetails);
app.get('/api', notesController.getAllNotes);
app.post('/api', notesController.createNote);
app.delete('/api/:id', notesController.deleteNote);


app.post("/register", async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: hashSync(req.body.password, 10)
    })
    user.save()
        .then((user) => {
            res.send({ success: true, user: { id: user._id, username: user.username } });
        })
        .catch((error) => {
            res.send({ success: false, error })
        })
})

app.post("/login", async (req, res) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            console.log(user)
            if (!user) {
                return res.status(401).send({ success: false, message: "User not found" })
            }
            if (!(req.body.password === user.password)) {
                return res.status(401).send({ success: false, message: "Incorrect Password" })
            }
            const payload = {
                username: user.username, id: user._id
            }
            const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });
            res.status(200).send({ success: true, message: "Login Success", token: "Bearer " + token });
        })
})

app.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    const user = req.user;
    return res.status(200).send({
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
})

app.listen(8081, () => {
    console.log("listening on port 8081");
})