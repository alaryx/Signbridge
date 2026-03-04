const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learning.controller');

router.get('/lessons', learningController.getLessons);
router.get('/lessons/:id', learningController.getLessonById);

module.exports = router;
