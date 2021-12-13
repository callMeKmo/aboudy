const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    category: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'category'
    },
    brand: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'brand'
    },
    nId:{
        type: String,
        required: true
    },
    inId:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema)