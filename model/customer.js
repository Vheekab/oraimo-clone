const mongoose = require('mongoose')
const {Schema} = mongoose

const details = new Schema({
    firstname: {
        type: String,
        require: true,
        trim: true
    },
    lastname: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        minLength: [5, 'email must be more than 5'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        minLength: [6, 'password must be more than 6'],
        trim: true
    },
    confirmPassword: {
        type: String,
        require: true,
        minLength: [6, 'password must be more than 6'],
        trim: true
    }
})

module.exports = mongoose.model('Customer', details)