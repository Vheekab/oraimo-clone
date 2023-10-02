const mongoose = require('mongoose')
const {Schema} = mongoose

const details = new Schema({
    title: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    image: {
        type: String,
        require: true,
        trim: true
    },
    rating: {
        type: String,
        require: true,
        trim: true
    },
    review: {
        type: String,
        require: true,
        trim: true
    },
    price: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
        trim: true
    }
})

module.exports = mongoose.model('Product', details)