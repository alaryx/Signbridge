import logging
import sys
import pathlib
import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import torch
import numpy as np
from io import BytesIO
from PIL import Image
from pathlib import Path

# Fix: map WindowsPath to PosixPath (model saved on Windows, running on Linux)
pathlib.WindowsPath = pathlib.PosixPath

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Signbridge ISL Detection API")

allowed_origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    os.getenv("BACKEND_URL", "http://localhost:5000"),
    "http://127.0.0.1:5000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Class names for ISL (10 classes)
CLASS_NAMES = ['GOOD', 'HAPPY', 'HELLO', 'HELP', 'INDIA', 'LOVE', 'NAMASTE', 'SORRY', 'THANK_YOU', 'WHAT']

# Global model variable
model = None
device = None

def load_model():
    """Load YOLOv5 model on startup using installed yolov5 package"""
    global model, device
    try:
        device = torch.device('cpu')
        logger.info(f"Using device: {device}")

        model_path = Path(__file__).parent / "models" / "best.pt"

        if not model_path.exists():
            logger.error(f"Model not found at {model_path}")
            raise FileNotFoundError(f"Model file not found: {model_path}")

        logger.info(f"Loading model from {model_path}...")

        # Use installed yolov5 pip package to load custom model
        import yolov5
        model = yolov5.load(str(model_path), device='cpu')
        model.conf = 0.3  # was 0.5, lower = more sensitive
        model.iou = 0.45

        logger.info(f"✅ Model loaded successfully on {device}")
        logger.info(f"📝 Detectable classes: {CLASS_NAMES}")
        logger.info(f"🎯 Confidence threshold: {model.conf}")

    except Exception as e:
        logger.error(f"❌ Failed to load model: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


@app.on_event("startup")
async def startup_event():
    """Load model when API starts"""
    load_model()
    logger.info("✅ Signbridge ISL Detection API started")

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "Signbridge ISL Detection",
        "model_loaded": model is not None,
        "device": str(device),
        "class_names": CLASS_NAMES
    }


@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    try:
        if model is None:
            raise HTTPException(status_code=500, detail="Model not loaded")

        image_data = await file.read()
        image = Image.open(BytesIO(image_data)).convert('RGB')

        logger.info(f"Processing image: {image.size}")

        # Use yolov5 package predict directly on PIL image
        results = model(image, size=640)
        predictions = results.pred[0]  # tensor of [x1,y1,x2,y2,conf,cls]

        detections = []
        if predictions is not None and len(predictions) > 0:
            for *xyxy, conf, cls in predictions:
                class_id = int(cls)
                class_name = CLASS_NAMES[class_id] if class_id < len(CLASS_NAMES) else "UNKNOWN"

                detection = {
                    "class": class_name,
                    "class_id": class_id,
                    "confidence": float(conf),
                    "bbox": {
                        "x1": float(xyxy[0]),
                        "y1": float(xyxy[1]),
                        "x2": float(xyxy[2]),
                        "y2": float(xyxy[3]),
                    }
                }
                detections.append(detection)

        detections.sort(key=lambda x: x['confidence'], reverse=True)

        logger.info(f"Found {len(detections)} detections")

        return JSONResponse({
            "status": "success",
            "detections": detections,
            "image_size": {
                "width": image.size[0],
                "height": image.size[1]
            },
            "class_names": CLASS_NAMES
        })

    except Exception as e:
        logger.error(f"Detection error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")


@app.get("/classes")
async def get_classes():
    return {
        "classes": CLASS_NAMES,
        "count": len(CLASS_NAMES)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)), log_level="info")