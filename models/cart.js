// npm modules.

const mongoose = require('mongoose')

// create schema and proprties.

const cartSchema = new mongoose.Schema({
    itemsCount:{
        type: Number,
        required: true
    },
    owner:{
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

// export the module

module.exports = mongoose.model('Cart', cartSchema)