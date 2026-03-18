# 🤟 SignBridge

> A bidirectional Indian Sign Language (ISL) translator and interactive learning platform — bridging the gap between the hearing and deaf communities.

🔗 **Live Demo:** [signbridge-2.onrender.com](https://signbridge-2.onrender.com)

---

## 📖 Description

**SignBridge** is a full-stack web application that enables bidirectional translation between Indian Sign Language (ISL) and text. It serves both as a real-time translation tool and a structured learning platform, empowering users to learn, practice, and get tested on ISL signs — all in one place.

Whether you're a beginner looking to learn ISL or someone who needs quick sign-to-text translation, SignBridge makes it accessible, interactive, and measurable.

---

## ✨ Features

### 🔄 Bidirectional ISL Translation
- **Sign → Text:** Real-time sign language detection using a custom-trained YOLOv8 ML model via webcam
- **Text → Sign:** Converts typed words into animated ISL sign videos mapped from a curated Kaggle dataset

### 🎓 Learning Platform
- **Prerequisite Module:** Structured lessons with ISL tutorial videos before practice
- **Practice Module:** Users watch a sign video, then perform it in front of their camera — the ML model evaluates correctness in real time
  - ✅ Pass → Proceed to the next sign
  - ❌ Fail → Retry until mastered
- **Test Module:** Post-practice assessments to evaluate retention
- **Progress Tracking:** Every practice session and test awards **XP points**, letting users track their growth over time

### 🧠 ML Model (YOLOv8)
- Detects **10 ISL signs**: `GOOD`, `HAPPY`, `HELLO`, `HELP`, `INDIA`, `LOVE`, `NAMASTE`, `SORRY`, `THANK_YOU`, `WHAT`
- Trained on **Google Colab T4 GPU**
- Average **confidence: 70–80%** | Average **accuracy: 75–80%**

### 🔐 Auth & Access
- Translation feature is publicly accessible
- Learning platform requires user login (JWT-based authentication)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js |
| **Backend** | Node.js, Express.js, JWT |
| **Database** | MongoDB |
| **ML Service** | FastAPI (Python) |
| **Media Storage** | Cloudinary (animated sign dataset) |
| **Deployment** | Render (Frontend + Backend), Hugging Face (ML Docker container) |

---

## 🚀 Installation & Usage

### Prerequisites

- Node.js v18+
- Python 3.9+
- MongoDB (local or Atlas)
- Docker (for ML service)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/signbridge.git
cd signbridge
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd backend
npm install
node server.js
```

### 4. ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_ML_SERVICE_URL=http://localhost:8000
```

---

## 📸 Screenshots / Demo

| Home Page | Sign → Text | Learning Module |
|-----------|-------------|-----------------|
| ![Home](screenshots/home.png) | ![Translator](screenshots/translator.png) | ![Learning](screenshots/learning.png) |

🔗 **Live App:** [signbridge-2.onrender.com](https://signbridge-2.onrender.com)

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a new branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "Add: your feature description"`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please follow the existing code style and include relevant details in your PR description.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ by a team of 5:

| Name | GitHub |
|------|--------|
| **Samridhi Arora** | [@samridhiarora](https://github.com/samridhiarora) |
| **Khushal Sharma** | [@khushalsharma](https://github.com/khushalsharma) |
| **Anzel Gupta** | [@anzelgupta](https://github.com/anzelgupta) |
| **Himanshu Gautam** | [@himanshu-gautam](https://github.com/himanshu-gautam) |
| **Aditya Kumar Singh** | [@adityakumarsingh](https://github.com/adityakumarsingh) |

> *Feel free to update the GitHub usernames with the correct ones!*

---

> 🤟 *SignBridge — Making sign language accessible for everyone.*
