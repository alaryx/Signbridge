const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    xpReward: {
        type: Number,
        default: 50
    }
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
