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
    """Load YOLOv5 model on startup (from local repo)"""
    global model, device
    try:
        device = torch.device('cpu')
        logger.info(f"Using device: {device}")

        model_path = Path(__file__).parent / "models" / "best.pt"
        yolov5_repo = Path(__file__).parent / "yolov5"

        # ✅ Add yolov5 to sys.path BEFORE torch.load so models.yolo is found
        if yolov5_repo.exists():
            sys.path.insert(0, str(yolov5_repo))
            logger.info(f"Using local YOLOv5 repo from {yolov5_repo}")
        else:
            logger.error("YOLOv5 repo not found!")
            raise FileNotFoundError("YOLOv5 repo not found at expected path")

        if not model_path.exists():
            logger.error(f"Model not found at {model_path}")
            raise FileNotFoundError(f"Model file not found: {model_path}")

        logger.info(f"Loading model from {model_path}...")

        checkpoint = torch.load(str(model_path), map_location=device, weights_only=False)

        if isinstance(checkpoint, dict) and 'model' in checkpoint:
            model = checkpoint['model'].float().fuse().eval().to(device)
        else:
            model = checkpoint.float().fuse().eval().to(device)

        model.conf = 0.5
        model.iou = 0.45

        with torch.no_grad():
            logger.info("Warming up model...")
            dummy_image = torch.zeros((1, 3, 640, 640), device=device)
            _ = model(dummy_image)

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

        # Resize to 640x640 as YOLOv5 expects
        image_resized = image.resize((640, 640))
        img_array = np.array(image_resized)

        logger.info(f"Processing image: {image.size}")

        # Convert numpy HWC → tensor CHW, normalize, add batch dim
        img_tensor = torch.from_numpy(img_array).permute(2, 0, 1).float() / 255.0
        img_tensor = img_tensor.unsqueeze(0).to(device)  # (1, 3, 640, 640)

        # YOLOv5 inference
        with torch.no_grad():
            results = model(img_tensor)

        # Extract pred from tuple and apply NMS manually
        from utils.general import non_max_suppression

        pred = results[0] if isinstance(results, tuple) else results
        pred = non_max_suppression(pred, conf_thres=0.5, iou_thres=0.45, max_det=10)
        pred = pred[0]  # First image in batch

        # Scale boxes back to original image size
        orig_w, orig_h = image.size
        scale_x = orig_w / 640
        scale_y = orig_h / 640

        detections = []
        if pred is not None and len(pred) > 0:
            for *xyxy, conf, cls in pred:
                class_id = int(cls)
                class_name = CLASS_NAMES[class_id] if class_id < len(CLASS_NAMES) else "UNKNOWN"

                detection = {
                    "class": class_name,
                    "class_id": class_id,
                    "confidence": float(conf),
                    "bbox": {
                        "x1": float(xyxy[0]) * scale_x,
                        "y1": float(xyxy[1]) * scale_y,
                        "x2": float(xyxy[2]) * scale_x,
                        "y2": float(xyxy[3]) * scale_y,
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