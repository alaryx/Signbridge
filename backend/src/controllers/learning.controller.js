const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// @desc    Get full curriculum (Courses -> Lessons)
// @route   GET /api/learning/curriculum
exports.getCurriculum = async (req, res) => {
    try {
        const courses = await Course.find().sort({ order: 1 }).lean();
        const allLessons = await Lesson.find().sort({ order: 1 }).lean();

        // Build the nested structure
        const curriculum = courses.map(course => {
            const courseLessons = allLessons.filter(l => l.courseId.toString() === course._id.toString());
            return {
                ...course,
                lessons: courseLessons
            };
        });

        res.status(200).json({ status: 'success', data: curriculum });
    } catch (error) {
        console.error('Error fetching curriculum:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch curriculum' });
    }
};

// @desc    Get all courses (simple list for admin dropdown)
// @route   GET /api/learning/courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ order: 1 });
        res.status(200).json({ status: 'success', data: courses });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch courses' });
    }
};



const User = require('../models/User');

// @desc    Get currently logged-in user's progress and stats
// @route   GET /api/learning/me/progress
exports.getMyProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        // Calculate dynamic level if curriculum exists
        const courses = await Course.find().sort({ order: 1 });
        let currentLevel = user.level;

        if (courses.length > 0) {
            const allLessons = await Lesson.find({});
            const completedIds = user.completedLessons.map(id => id.toString());

            // Find first course not fully completed
            const currentCourse = courses.find(course => {
                const courseLessons = allLessons.filter(l => l.courseId.toString() === course._id.toString());
                return !courseLessons.every(l => completedIds.includes(l._id.toString()));
            });

            if (currentCourse) {
                currentLevel = currentCourse.title;
            } else {
                currentLevel = courses[courses.length - 1].title; // All done, stay at last
            }

            // Sync database if changed
            if (user.level !== currentLevel) {
                user.level = currentLevel;
                await user.save();
            }
        }

        res.status(200).json({
            status: 'success', data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                level: user.level,
                xp: user.xp,
                streak: user.streak,
                dailyGoal: user.dailyGoal,
                dailyProgress: user.dailyProgress,
                completedLessons: user.completedLessons,
                unlockedLessons: user.unlockedLessons,
                assessmentCompleted: user.assessmentCompleted
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching progress', error: error.message });
    }
};

// @desc    Log lesson completion and award XP
// @route   POST /api/learning/progress/lesson/:lessonId
exports.completeLesson = async (req, res) => {
    try {
        const { xpEarned = 50, accuracy = 100 } = req.body;
        const userId = req.user._id;
        const lessonId = req.params.lessonId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        // Check if lesson is already completed
        const isNewCompletion = !user.completedLessons.includes(lessonId);

        if (isNewCompletion) {
            user.completedLessons.push(lessonId);
            user.xp += xpEarned;

            // Daily active streak logic
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
            if (lastActive) lastActive.setHours(0, 0, 0, 0);

            if (!lastActive || lastActive < today) {
                // Determine if it was exactly yesterday
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastActive && lastActive.getTime() === yesterday.getTime()) {
                    user.streak += 1;
                } else {
                    user.streak = 1; // reset or start streak
                }
                user.dailyProgress = xpEarned;
            } else if (lastActive && lastActive.getTime() === today.getTime()) {
                user.dailyProgress += xpEarned;
            }

            user.lastActiveDate = new Date();

            // Handle weak signs
            if (accuracy < 80 && !user.weakSigns.includes(lessonId)) {
                user.weakSigns.push(lessonId);
            } else if (accuracy >= 80 && user.weakSigns.includes(lessonId)) {
                user.weakSigns = user.weakSigns.filter(id => id.toString() !== lessonId.toString());
            }

            // We unlock the next lesson logic here (Ideally querying the curriculum to find the *next* ordered lesson id)
            // For MVP, if it's new it unlocks the very next one. This requires complex tree traversal.
        }

        await user.save();

        res.status(200).json({
            status: 'success',
            data: { xp: user.xp, streak: user.streak, dailyProgress: user.dailyProgress, isNew: isNewCompletion }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error completing lesson', error: error.message });
    }
};

// @desc    Get weak signs for review
// @route   GET /api/learning/practice-hub/:userId
exports.getPracticeHub = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('weakSigns');
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        res.status(200).json({ status: 'success', data: user.weakSigns });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching practice hub', error: error.message });
    }
};

// @desc    Mark user's assessment as completed
// @route   POST /api/learning/me/assessment-complete
exports.completeAssessment = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        user.assessmentCompleted = true;
        await user.save();

        res.status(200).json({ status: 'success', message: 'Assessment marked as completed.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error completing assessment', error: error.message });
    }
};
