# 🤟 Signbridge YOLOv5 Integration Guide

## Overview

This guide explains how to set up the complete YOLOv5 ISL detection pipeline with your React + Node.js application.

**Architecture:**

```
React Frontend (Port 3000)
    ↓ (video frames as base64)
Node.js Backend (Port 5000)
    ↓ (forward frames)
Python FastAPI Service (Port 8000)
    ↓ (YOLOv5 inference)
Returns: {detections, confidence, bboxes}
```

---

## Prerequisites ✅

### System Requirements

- **Node.js**: v16+ (for backend)
- **Python**: 3.8+ (for ML service)
- **GPU** (Optional): NVIDIA GPU with CUDA for faster inference
- **Disk Space**: ~2GB (for PyTorch + YOLOv5)

### Before Starting

1. ✅ Download `best.pt` from Google Drive
2. ✅ Place it at: `ml-service/models/best.pt`

---

## Installation Guide

### 1️⃣ Backend Setup (Node.js)

```bash
cd backend

# Install dependencies
npm install

# Verify axios and form-data are installed
npm list axios form-data
```

**Expected output:**

```
├── axios@1.6.2
├── form-data@4.0.0
└── ...
```

---

### 2️⃣ ML Service Setup (Python) - CPU Optimized

#### Prerequisites

This setup is optimized for **CPU-only systems** (no GPU needed).

#### Step 1: Clone YOLOv5 Repository

```bash
cd ml-service

# Clone official YOLOv5 repo
git clone https://github.com/ultralytics/yolov5.git
cd ..
```

This creates: `ml-service/yolov5/` with all YOLOv5 dependencies and code.

#### Step 2: Create Python Virtual Environment

```bash
cd ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies (CPU-optimized)
pip install -r requirements.txt
```

**Expected output:**

```
Successfully installed torch torchvision yolov5 fastapi uvicorn pillow numpy opencv-python ...
```

#### Step 3: Verify Installation

```bash
# Check PyTorch is installed
python -c "import torch; print(f'PyTorch {torch.__version__} on CPU')"

# Check YOLOv5 repo is present
ls yolov5/  # Should show: data/, models/, utils/, detect.py, etc.

# Check best.pt exists
ls models/best.pt
```

**Expected output:**

```
PyTorch 2.1.1 on CPU
best.pt (file exists)
```

---

#### Alternative: Using Conda (If you prefer)

```bash
cd ml-service

# Clone YOLOv5 repo (same as above)
git clone https://github.com/ultralytics/yolov5.git
cd ..

# Create conda environment
conda create -n signbridge-ml python=3.10

# Activate
conda activate signbridge-ml

# Install dependencies
pip install -r requirements.txt
```

---

### Why Clone YOLOv5 Repo?

✅ **Advantages:**

- Full control over the code
- Better debugging capabilities
- Can modify models.py for optimization
- Access to example scripts
- Works great for CPU-only systems
- Faster inference than torch.hub.load()

📦 **What's installed:**

- YOLOv5 source code in `ml-service/yolov5/`
- All required dependencies (PyTorch, Pillow, OpenCV, etc.)
- FastAPI & Uvicorn for the API server

---

### 3️⃣ Frontend Setup (React)

```bash
cd frontend

# Install dependencies (axios should already be there)
npm install

# Verify axios is installed
npm list axios
```

---

## Running Everything

### 🚀 Terminal 1: Python ML Service

```bash
cd ml-service

# Activate virtual environment (if using venv)
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Start FastAPI server
python -m uvicorn main:app --reload --port 8000
```

**Expected output:**

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
✅ Signbridge ISL Detection API started
```

**Test the health endpoint:**

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "Signbridge ISL Detection",
  "model_loaded": true,
  "device": "cuda"
}
```

---

### 🚀 Terminal 2: Node.js Backend

```bash
cd backend

# Start Express server
npm start
```

**Expected output:**

```
Server running on port 5000
Connected to MongoDB
```

---

### 🚀 Terminal 3: React Frontend

```bash
cd frontend

# Start Vite dev server
npm run dev
```

**Expected output:**

```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## Testing the Integration

### Step 1: Open the App

1. Go to http://localhost:5173/
2. Navigate to **Translation** page
3. Select **Sign to Text** mode

### Step 2: Start Detection

1. Click **Start Camera** button
2. Check status indicators:
   - 🟢 **Green (Model Ready)**: Everything is working
   - 🟡 **Yellow (Loading)**: Model is still loading
   - 🔴 **Red (Offline)**: ML service not running

### Step 3: Test Detection

1. Your ISL gestures should appear in bounding boxes
2. You should see:
   - **Detection count**: "✓ 2 Signs Detected"
   - **Confidence scores**: "NAMASTE 92%"
   - **Real-time FPS**: "30 FPS"

---

## Troubleshooting

### ❌ Problem: "ML Service Offline"

**Solution:**

```bash
# Check if Python service is running on port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # macOS/Linux

# Restart the service (Terminal 1)
python -m uvicorn main:app --reload --port 8000
```

---

### ❌ Problem: "Connection refused" Error

**Check:**

1. Is Python service running? (Should be on port 8000)
2. Is Node.js backend running? (Should be on port 5000)
3. Is React frontend running? (Should be on port 5173)

**Quick fix:**

```bash
# Kill all processes and restart in correct order:
# 1. Python (ML service) - Terminal 1
# 2. Node.js (Backend) - Terminal 2
# 3. React (Frontend) - Terminal 3
```

---

### ❌ Problem: "Model not found at ./models/best.pt"

**Solution:**

```bash
# From ml-service/ directory
# Check if best.pt exists
ls -la models/

# If not, download from Google Drive and place it at:
# ml-service/models/best.pt

# Restart Python service
python -m uvicorn main:app --reload --port 8000
```

---

### ❌ Problem: "CUDA out of memory"

**Solution:** Use CPU instead (slower but works)

- The app automatically falls back to CPU
- Or reduce detection frequency in CameraPanel.jsx (change `frameCount % 8` to higher number)

---

### ❌ Problem: "TypeError: expected str, bytes or os.PathLike object"

**Solution:**
Check that your Python path to best.pt is correct and use absolute paths in main.py.

---

## Configuration

### Adjust Detection Confidence

Edit `ml-service/main.py`:

```python
model.conf = 0.5  # Lower = more detections but more false positives
                  # Higher = fewer detections but more accurate
```

### Adjust Detection Frequency

Edit `frontend/src/components/translation/CameraPanel.jsx`:

```javascript
// Change detection interval (in requestAnimationFrame cycles)
if (frameCount % 8 === 0) {
  // Send every 8 frames (~5 FPS)
  captureAndDetect(canvas); // Lower number = higher FPS but slower
}
```

### Change ML Service Port

Edit `backend/.env`:

```
ML_SERVICE_URL=http://localhost:8000  # Change port here
```

---

## Performance Tips

| Metric            | Value                      |
| ----------------- | -------------------------- |
| **Detection FPS** | 5 FPS (200ms)              |
| **Video FPS**     | 30+ FPS                    |
| **Latency**       | ~100-200ms per frame       |
| **Memory Usage**  | ~1.5GB (GPU) / 2.5GB (CPU) |

### Optimize for Speed

1. Use GPU (NVIDIA with CUDA)
2. Lower detection frequency (increase `frameCount % X`)
3. Reduce input resolution (640x480 is good)
4. Use lighter model (YOLOv5s instead of YOLOv5l)

---

## API Endpoints

### Backend (Node.js)

```
POST /api/translate/detect
Headers: Authorization: Bearer <JWT_TOKEN>
Body: { "frame": "<base64-jpeg-image>" }
Response: { "status": "success", "detections": [...], "classNames": [...] }
```

### ML Service (Python)

```
POST http://localhost:8000/detect
Body: multipart/form-data (file: image)
Response: { "status": "success", "detections": [...], "image_size": {...} }

GET http://localhost:8000/health
Response: { "status": "ok", "model_loaded": true, "device": "cuda" }

GET http://localhost:8000/classes
Response: { "classes": ["GOOD", "HAPPY", "INDIA", "NAMASTE", "THANK_YOU"], "count": 5 }
```

---

## File Structure

```
Signbridge/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── translate.controller.js  ← detect() function added
│   │   ├── routes/
│   │   │   └── translate.routes.js      ← /detect route added
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json                      ← axios, form-data added
│   └── .env                              ← ML_SERVICE_URL added
│
├── ml-service/                           ← NEW
│   ├── models/
│   │   └── best.pt                       ← Your model file
│   ├── main.py                           ← FastAPI app
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   └── components/translation/
    │       └── CameraPanel.jsx           ← Real-time detection added
    └── package.json
```

---

## Next Steps

1. ✅ Install all dependencies (follow steps above)
2. ✅ Download best.pt from Google Drive → `ml-service/models/`
3. ✅ Run all three services in separate terminals
4. ✅ Test on http://localhost:5173/translation
5. 🔄 Fine-tune detection confidence and frequency
6. 📊 Monitor performance and optimize as needed

---

## FAQ

**Q: Why does detection take 100-200ms?**
A: Model inference + network latency. Normal for ML inference on consumer hardware.

**Q: Can I use my own model?**
A: Yes! Replace `best.pt` with your model. Update CLASS_NAMES in main.py accordingly.

**Q: Does it work without GPU?**
A: Yes! Falls back to CPU automatically, but slower (5-10 FPS vs 30+ FPS).

**Q: How do I deploy to production?**
A: See deployment guide (coming soon).

---

## Support

If you encounter issues:

1. Check logs in each terminal
2. Verify all ports are accessible (8000, 5000, 5173)
3. Ensure best.pt is at `ml-service/models/best.pt`
4. Check .env files are configured correctly
5. Restart all services in order

---

**Last Updated:** March 8, 2026  
**Status:** ✅ Ready for testing
