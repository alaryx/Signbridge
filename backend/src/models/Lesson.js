const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['teach', 'practice', 'teach_practice', 'teach_recognize', 'recognize'],
        default: 'teach'
    },
    mediaUrl: {
        type: String,
        required: true // Cloudinary URL
    },
    mediaType: {
        type: String,
        enum: ['video', 'image'],
        required: true
    },
    duration: {
        type: String,
        default: '1 min'
    },
    order: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
