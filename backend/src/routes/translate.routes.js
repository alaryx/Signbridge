const express = require("express");
const router = express.Router();
const translateController = require("../controllers/translate.controller");
const { protect } = require("../middleware/auth");

// Regular translation endpoint
router.post("/", translateController.translate);

// Real-time sign detection endpoint
// Requires authentication to ensure API usage tracking
router.post("/detect", translateController.detect);
module.exports = router;
