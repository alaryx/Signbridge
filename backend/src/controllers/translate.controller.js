const axios = require("axios");
const FormData = require("form-data");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

exports.translate = (req, res) => {
  const { direction, content } = req.body;

  if (!direction || !content) {
    return res
      .status(400)
      .json({ status: "error", message: "Direction and content required" });
  }

  let output = "";

  if (direction === "sign_to_text") {
    output = `Mock translated text for sign gestures: [${content}]`;
  } else if (direction === "text_to_sign") {
    output = `mock_sign_gif_url_for_text: [${content}]`;
  } else {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid direction" });
  }

  res.status(200).json({
    status: "success",
    direction,
    output,
    confidence: 0.95,
  });
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
