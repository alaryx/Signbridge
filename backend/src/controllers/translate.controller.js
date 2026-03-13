const axios = require("axios");
const FormData = require("form-data");
const Sign = require('../models/Sign');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

exports.translate = async (req, res) => {
  const { direction, content } = req.body;

  if (!direction || !content) {
    return res
      .status(400)
      .json({ status: "error", message: "Direction and content required" });
  }

  if (direction === 'sign_to_text') {
    const output = `Mock translated text for sign gestures: [${content}]`;
    return res.status(200).json({
      status: 'success',
      direction,
      output,
      confidence: 0.95
    });
  }

  if (direction === 'text_to_sign') {
    try {
      const rawWords = content.toUpperCase().split(/\s+/);
      let sequence = [];

      for (const wordStr of rawWords) {
        const cleanWord = wordStr.replace(/[^A-Z0-9]/g, '');
        if (!cleanWord) continue;

        // 1. Try to find the complete word in the DB
        const signWord = await Sign.findOne({ word: cleanWord, type: 'word' });

        if (signWord) {
          sequence.push({
            type: 'sign',
            word: cleanWord,
            videoUrl: signWord.videoUrl.replace('http://', 'https://')
          });
        } else {
          // 2. Fallback to fingerspelling character by character
          for (const char of cleanWord.split('')) {
            const charType = isNaN(char) ? 'letter' : 'number';
            const signChar = await Sign.findOne({ word: char, type: charType });

            // Push if found, omit gracefully if symbol doesn't exist
            if (signChar) {
              sequence.push({
                type: 'fingerspell',
                character: char,
                videoUrl: signChar.videoUrl.replace('http://', 'https://')
              });
            }
          }
        }
      }

      return res.status(200).json({
        success: true,
        sequence
      });

    } catch (error) {
      console.error('Translation error:', error);
      return res.status(500).json({ success: false, message: 'Server error during translation' });
    }
  }

  return res.status(400).json({ status: 'error', message: 'Invalid direction' });
};

/**
 * Detect ISL signs from video frame
 * Receives base64-encoded image → sends to Python ML service → returns detections
 */
exports.detect = async (req, res) => {
  try {
    const { frame } = req.body;

    if (!frame) {
      return res.status(400).json({
        status: "error",
        message: "No frame provided. Send base64-encoded image in frame field",
      });
    }

    // Convert Base64 to Buffer
    const base64Data = frame.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Create FormData for multipart request
    const formData = new FormData();
    formData.append("file", buffer, { filename: "frame.jpg" });

    console.log(
      `[Detection] Sending frame to ML service: ${ML_SERVICE_URL}/detect`,
    );

    // Forward request to Python ML service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/detect`, formData, {
      headers: formData.getHeaders(),
      timeout: 15000, // 5 second timeout
    });

    console.log(
      `[Detection] Received ${mlResponse.data.detections.length} detections`,
    );

    // Return predictions to frontend
    return res.json({
      status: "success",
      detections: mlResponse.data.detections,
      imageSize: mlResponse.data.image_size,
      classNames: mlResponse.data.class_names,
    });
  } catch (error) {
    console.error("[Detection Error]", error.message);

    // Check if ML service is unavailable
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        status: "error",
        message:
          "ML service unavailable. Is Python service running on port 8000?",
        error: "Connection refused",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Detection failed",
      error: error.message,
      details: error.response?.data || null,
    });
  }
};
