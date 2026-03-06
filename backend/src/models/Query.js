const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: String, // fallback if anonymous
    email: String,
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'resolved'],
        default: 'open'
    }
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
