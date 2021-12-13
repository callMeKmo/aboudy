// npm modules.

const mongoose = require('mongoose')

// create schema and proprties.

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'product'
    },
    count:{
        type: Number,
        required: true,
        default: 1
    },
    addedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    cart:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'cart'
    }
})

// export the module

module.exports = mongoose.model('CartItem', cartItemSchema)