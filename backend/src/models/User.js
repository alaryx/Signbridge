const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    level: {
        type: String,
        default: 'Level 1',
    },
    xp: {
        type: Number,
        default: 0,
    },
    streak: {
        type: Number,
        default: 0
    },
    dailyGoal: {
        type: Number,
        default: 10
    },
    dailyProgress: {
        type: Number,
        default: 0
    },
    lastActiveDate: {
        type: Date,
        default: null
    },
    completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    completedModules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }],
    unlockedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    weakSigns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    lastLogin: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
