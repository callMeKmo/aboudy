// npm modules.

const mongoose = require('mongoose')

// create schema and proprties.

const brandSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

// export the module

module.exports = mongoose.model('Brand', brandSchema)