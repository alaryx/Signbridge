const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

// @desc    Get full curriculum (Courses -> Modules -> Lessons)
// @route   GET /api/learning/curriculum
exports.getCurriculum = async (req, res) => {
    try {
        const courses = await Course.find().sort({ order: 1 }).lean();

        // Fetch all modules and lessons to avoid N+1 queries
        const allModules = await Module.find().sort({ order: 1 }).lean();
        const allLessons = await Lesson.find().sort({ order: 1 }).lean();

        // Build the nested structure
        const curriculum = courses.map(course => {
            const courseModules = allModules
                .filter(m => m.courseId.toString() === course._id.toString())
                .map(module => {
                    const moduleLessons = allLessons.filter(l => l.moduleId.toString() === module._id.toString());
                    return {
                        ...module,
                        lessons: moduleLessons
                    };
                });

            return {
                ...course,
                modules: courseModules
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

// @desc    Get modules for a specific course (for admin dropdown)
// @route   GET /api/learning/courses/:courseId/modules
exports.getModulesByCourse = async (req, res) => {
    try {
        const modules = await Module.find({ courseId: req.params.courseId }).sort({ order: 1 });
        res.status(200).json({ status: 'success', data: modules });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch modules' });
    }
};

const User = require('../models/User');

// @desc    Get user's progress and stats
// @route   GET /api/learning/progress/:userId
exports.getUserProgress = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        res.status(200).json({
            status: 'success', data: {
                xp: user.xp,
                streak: user.streak,
                dailyGoal: user.dailyGoal,
                dailyProgress: user.dailyProgress,
                completedLessons: user.completedLessons,
                completedModules: user.completedModules,
                unlockedLessons: user.unlockedLessons
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
        const { userId, xpEarned = 50, accuracy = 100 } = req.body;
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
