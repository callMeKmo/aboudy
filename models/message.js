const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    sender: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    recieverId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

module.exports = mongoose.model('Message', messageSchema)