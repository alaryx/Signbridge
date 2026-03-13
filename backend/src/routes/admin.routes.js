const express = require('express');
const router = express.Router();
const { getDashboardStats, uploadLesson, createCourse, updateCourse, deleteCourse, createModule, updateModule, deleteModule, deleteLesson, getQueries } = require('../controllers/admin.controller');
// We commented out protect/admin for development/testing ease until you have an admin user in DB
// const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Admin Stats
router.get('/stats', getDashboardStats); // Should be protect, admin

// Course Management
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Lesson Management
// Handle multipart form data 'file' field for lesson uploads
router.post('/lessons', upload.single('file'), uploadLesson);
router.delete('/lessons/:id', deleteLesson);

// Queries Management
router.get('/queries', getQueries);

module.exports = router;
