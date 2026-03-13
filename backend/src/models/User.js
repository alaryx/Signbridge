const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    },
    assessmentCompleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
