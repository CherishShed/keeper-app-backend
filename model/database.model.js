require("dotenv").config();
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.set('strictQuery', true)
const connectToDatabase = async () => {
    mongoose
        .connect(process.env.CONNECTION_STRING, {
            dbName: 'notesDB',
            connectTimeoutMS: 40000,
        })
        .then(() => {
            console.log('Database Connection Succeeded')
        })
        .catch(err => {
            console.log(`An error occurred connecting to database: ${err}`)
        })
}
mongoose.connection.on('error', err => {
    console.log(
        `An error occurred connecting to database: ${err},\n...reconnecting`
    )
    connectToDatabase()
})
const notesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "note"
    }],
    profilePic: { type: String, default: "" },
    labels:
        [{
            key: {
                type: String,
                required: true
            },
            value: {
                type: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "note",
                    default: []
                }]
            }
        }]
}
);

userSchema.set("toJSON", { virtuals: true });
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("user", userSchema);
notesSchema.post('findOneAndDelete', async function (note) {
    try {
        console.log("deleting")
        // Update the userSchema table
        await mongoose.model('user').updateMany(
            {
                $or: [
                    { notes: note._id },
                    { 'labels.value': note._id }
                ]
            },
            {
                $pull: {
                    notes: note._id,
                    'labels.$[].value': note._id
                }
            }
        );
    } catch (err) {
        console.error(err);
    }
});

const Notes = mongoose.model("note", notesSchema)
module.exports = { User, Notes, connectToDatabase };