const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learning.controller');

router.get('/curriculum', learningController.getCurriculum);
router.get('/courses', learningController.getCourses);
router.get('/courses/:courseId/modules', learningController.getModulesByCourse);

// Gamification & Progress Routes
router.get('/progress/:userId', learningController.getUserProgress); // Pass userId temporarily until auth middleware is ready
router.post('/progress/lesson/:lessonId', learningController.completeLesson);
router.get('/practice-hub/:userId', learningController.getPracticeHub);

module.exports = router;
