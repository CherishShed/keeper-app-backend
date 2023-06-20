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
app.post('/api', passport.authenticate("jwt", { session: false }), notesController.createNote);
app.delete('/api/:id', notesController.deleteNote);
app.get('/api/label/:key', passport.authenticate("jwt", { session: false }), userController.getLabelDetails)


app.post("/register", async (req, res) => {
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
})

app.post("/login", async (req, res) => {
    console.log("heree")
    User.findOne({ username: req.body.username })
        .then((user) => {
            console.log(user)
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
})

app.get("/", passport.authenticate("jwt", { session: false }), userController.getUserdetails)

app.listen(8081, () => {
    console.log("listening on port 8081");
})