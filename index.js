const express = require('express');
require("dotenv");
const app = express();
const cors = require('cors');
const notesController = require('./Controllers/notes.controller');
const userController = require('./Controllers/user.controller');
const passport = require("./middleware/auth.middleware");
const multer = require("multer");
const { connectToDatabase } = require('./model/database.model');
const upload = multer({ dest: "uploads/" });
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
app.post('/api', passport.authenticate("jwt", { session: false }), notesController.createNote);
app.delete('/api/:id', notesController.deleteNote);
app.get('/api/label/:key', passport.authenticate("jwt", { session: false }), userController.getLabelDetails)

app.post("/userDetails", passport.authenticate("jwt", { session: false }), userController.editOriginalProfileDetails);

app.post("/register", userController.registerUser)

app.post("/login", userController.loginUser)

app.get("/", passport.authenticate("jwt", { session: false }), userController.getUserdetails)
app.post("/newLabel", passport.authenticate("jwt", { session: false }), userController.createLabel);
app.patch("/editLabel", passport.authenticate("jwt", { session: false }), userController.editLabel);
app.delete("/deleteLabel", passport.authenticate("jwt", { session: false }), userController.deleteLabel);
app.listen(8081, () => {
    connectToDatabase()
    console.log("listening on port 8081");
})