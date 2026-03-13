const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email and password required.' });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ status: 'error', message: 'Please provide a valid email address.' });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Update last login
            user.lastLogin = Date.now();
            await user.save();

            // Calculate dynamic level for immediate accurate UI - WRAPPED in separate try-catch to not block login
            try {
                const allCourses = await Course.find().sort({ order: 1 });
                if (allCourses.length > 0) {
                    const allLessons = await Lesson.find({});
                    const completedIds = user.completedLessons.map(id => id.toString());
                    const currentCourse = allCourses.find(course => {
                        const courseLessons = allLessons.filter(l => l.courseId.toString() === course._id.toString());
                        return !courseLessons.every(l => completedIds.includes(l._id.toString()));
                    });
                    if (currentCourse && user.level !== currentCourse.title) {
                        user.level = currentCourse.title;
                        await user.save();
                    } else if (!currentCourse && user.level !== allCourses[allCourses.length - 1].title) {
                        user.level = allCourses[allCourses.length - 1].title;
                        await user.save();
                    }
                }
            } catch (levelErr) {
                console.error('Non-blocking error during login level calculation:', levelErr.message);
                // Level calculation failure shouldn't prevent login
            }

            res.status(200).json({
                status: 'success',
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    level: user.level,
                    xp: user.xp,
                    streak: user.streak,
                    dailyProgress: user.dailyProgress,
                    dailyGoal: user.dailyGoal,
                    completedLessons: user.completedLessons,
                    assessmentCompleted: user.assessmentCompleted
                }
            });
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('FATAL LOGIN ERROR:', error);
        res.status(500).json({ status: 'error', message: 'Server error during login. Please contact support.', debug: error.message });
    }
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ status: 'error', message: 'Name, email and password are required.' });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ status: 'error', message: 'Please provide a valid email address.' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ status: 'error', message: 'User already exists.' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            // Calculate dynamic level even for new users - WRAPPED in separate try-catch
            try {
                const allCourses = await Course.find().sort({ order: 1 });
                if (allCourses.length > 0) {
                    user.level = allCourses[0].title;
                    await user.save();
                }
            } catch (levelErr) {
                console.error('Non-blocking error during signup level calculation:', levelErr.message);
            }

            res.status(201).json({
                status: 'success',
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    level: user.level,
                    xp: user.xp,
                    streak: user.streak,
                    dailyProgress: user.dailyProgress,
                    dailyGoal: user.dailyGoal,
                    completedLessons: user.completedLessons,
                    assessmentCompleted: user.assessmentCompleted
                }
            });
        } else {
            res.status(400).json({ status: 'error', message: 'Invalid user data received.' });
        }
    } catch (error) {
        console.error('FATAL SIGNUP ERROR:', error);
        res.status(500).json({ status: 'error', message: 'Server error during signup. Please contact support.', debug: error.message });
    }
};