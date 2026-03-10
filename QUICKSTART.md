# 🚀 Quick Start: Run Signbridge YOLOv5 Detection

## Step 0: Prepare Your Best.pt File

```bash
# Download best.pt from Google Drive and place it here:
# Exact path: c:\Projects\Signbridge\ml-service\models\best.pt

# Verify it exists:
dir ml-service\models\
```

Expected output:

```
best.pt  (file should be here, size typically 50-200 MB)
```

---

## Step 1: Open 3 Terminals in VS Code

In VS Code terminal area, open 3 separate terminals.

---

## Step 2: Terminal 1 - Install Backend Dependencies

```bash
cd backend
npm install
```

Wait for it to complete. You should see:

```
added XX packages
```

---

## Step 3: Terminal 2 - Clone YOLOv5 & Setup Python

```bash
cd ml-service

# Clone official YOLOv5 repository (ALL source code)
git clone https://github.com/ultralytics/yolov5.git

# Create virtual environment (IMPORTANT!)
python -m venv venv

# Activate it:
venv\Scripts\activate

# Install dependencies:
pip install -r requirements.txt
```

Wait 5-10 minutes. You'll see:

```
Cloning into 'yolov5'...
Successfully installed torch torchvision yolov5 fastapi uvicorn ...
```

---

## Step 4: Terminal 3 - Frontend (No installation needed)

```bash
cd frontend
```

(Dependencies already installed, just cd into it)

---

## Step 5: Start ALL Three Services

### Terminal 1 (Backend):

```bash
cd backend
npm start
```

Wait for:

```
Server running on port 5000
Connected to MongoDB
```

### Terminal 2 (ML Service):

```bash
# Make sure you're in ml-service with venv activated
cd ml-service
venv\Scripts\activate

python -m uvicorn main:app --reload --port 8000
```

Wait for:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
✅ Signbridge ISL Detection API started
```

### Terminal 3 (Frontend):

```bash
cd frontend
npm run dev
```

Wait for:

```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## Step 6: Test in Browser

1. Open http://localhost:5173/
2. Go to **Translation** page
3. Click **"Sign to Text"** tab
4. Click **Start Camera** button
5. Check that:
   - ✅ Camera feed shows (your webcam)
   - ✅ **Model Ready** shows in green (top right)
   - ✅ When you make ISL gestures, you see bounding boxes
   - ✅ Detection count appears: "✓ 1 Signs Detected"

---

## ✅ Success Checklist

- [ ] best.pt exists at `ml-service/models/best.pt`
- [ ] Terminal 1 (Backend) shows "Connected to MongoDB"
- [ ] Terminal 2 (ML Service) shows "Model loaded successfully"
- [ ] Terminal 3 (Frontend) shows "ready in xxx ms"
- [ ] Browser shows real-time detection with bounding boxes
- [ ] Status badge shows 🟢 "Model Ready"

---

## 🆘 If Something Breaks

**"Model not loaded" error?**

```bash
# Terminal 2 - Restart ML service:
python -m uvicorn main:app --reload --port 8000
```

**"Cannot find module axios"?**

```bash
# Terminal 1 - Reinstall dependencies:
cd backend
npm install
```

**"No module named 'torch'"?**

```bash
# Terminal 2 - Reinstall Python:
pip install -r requirements.txt
```

**Port already in use?**

```bash
# Kill the process (Windows - Terminal in backend, ml-service, or frontend):
# Or just restart that terminal
```

---

## 📚 Full Guide

See **INTEGRATION_GUIDE.md** in project root for complete documentation.
