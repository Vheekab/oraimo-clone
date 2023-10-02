require('dotenv').config()
const mongoose = require('mongoose')
const databaselink = `mongodb+srv://${process.env.myUsername}:${process.env.myPassword}@cluster0.fansx3c.mongodb.net/Project`

function connectMongoose() {
    mongoose.connect(databaselink, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports = connectMongoose