const mongoose = require('mongoose');

const signSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        index: true,
        uppercase: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['word', 'letter', 'number']
    },
    videoUrl: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Sign = mongoose.model('Sign', signSchema);

module.exports = Sign;
