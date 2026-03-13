const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learning.controller');
const { protect } = require('../middleware/auth');

router.get('/curriculum', learningController.getCurriculum);
router.get('/courses', learningController.getCourses);

// Gamification & Progress Routes (protected)
router.get('/me/progress', protect, learningController.getMyProgress);
router.post('/me/assessment-complete', protect, learningController.completeAssessment);
router.post('/progress/lesson/:lessonId', protect, learningController.completeLesson);
router.get('/practice-hub/:userId', protect, learningController.getPracticeHub);

module.exports = router;
