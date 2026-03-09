const User = require('../models/User');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Query = require('../models/Query');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const newUsersToday = await User.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });
        const totalCourses = await Course.countDocuments();
        const totalLessons = await Lesson.countDocuments();
        const openQueries = await Query.countDocuments({ status: 'open' });

        res.json({
            totalUsers,
            newUsersToday,
            totalCourses,
            totalLessons,
            openQueries
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

// @desc    Upload Lesson Video/Image to Cloudinary and DB
// @route   POST /api/admin/lessons
exports.uploadLesson = async (req, res) => {
    try {
        const { title, description, type, duration, order, moduleId } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Determine resource type for Cloudinary
        const isVideo = req.file.mimetype.startsWith('video/');
        const resourceType = isVideo ? 'video' : 'image';

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: resourceType,
            folder: 'signbridge/learning_assets'
        });

        // Remove temp file from local server
        fs.unlinkSync(req.file.path);

        // Create Lesson in DB
        const lesson = await Lesson.create({
            title,
            description: description || '',
            type: type || 'teach',
            mediaUrl: result.secure_url,
            mediaType: resourceType,
            duration: duration || '1 min',
            order: order || 0,
            moduleId
        });

        res.status(201).json(lesson);
    } catch (error) {
        // Attempt local file cleanup on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error(error);
        res.status(500).json({ message: 'Error uploading lesson', error: error.message });
    }
};

// @desc    Create a new course (Level)
// @route   POST /api/admin/courses
exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ status: 'success', data: course });
    } catch (error) {
        res.status(400).json({ message: 'Error creating course', error: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/admin/courses/:id
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ status: 'success', data: course });
    } catch (error) {
        res.status(400).json({ message: 'Error updating course', error: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/admin/courses/:id
exports.deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        // Cascade delete modules and lessons optionally
        res.status(200).json({ status: 'success', message: 'Course deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting course', error: error.message });
    }
};

// @desc    Create a new module
// @route   POST /api/admin/modules
exports.createModule = async (req, res) => {
    try {
        const module = await Module.create(req.body);
        res.status(201).json({ status: 'success', data: module });
    } catch (error) {
        res.status(400).json({ message: 'Error creating module', error: error.message });
    }
};

// @desc    Update a module
// @route   PUT /api/admin/modules/:id
exports.updateModule = async (req, res) => {
    try {
        const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ status: 'success', data: module });
    } catch (error) {
        res.status(400).json({ message: 'Error updating module', error: error.message });
    }
};

// @desc    Delete a module
// @route   DELETE /api/admin/modules/:id
exports.deleteModule = async (req, res) => {
    try {
        await Module.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Module deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting module', error: error.message });
    }
};

// @desc    Delete a lesson
// @route   DELETE /api/admin/lessons/:id
exports.deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (lesson && lesson.mediaUrl) {
            // Option to delete from cloudinary using regex matching public_id from URL
            const urlParts = lesson.mediaUrl.split('/');
            const filename = urlParts[urlParts.length - 1];
            const publicId = `signbridge/learning_assets/${filename.split('.')[0]}`;
            await cloudinary.uploader.destroy(publicId, { resource_type: lesson.mediaType });
        }
        await Lesson.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Lesson deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting lesson', error: error.message });
    }
};


// @desc    Get all queries
// @route   GET /api/admin/queries
exports.getQueries = async (req, res) => {
    try {
        const queries = await Query.find().sort('-createdAt').populate('userId', 'name email');
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching queries', error: error.message });
    }
};
