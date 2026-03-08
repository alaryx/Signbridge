import React, { useRef, useEffect, useState } from "react";
import { Camera, VideoOff, Maximize, AlertCircle, Wifi } from "lucide-react";
import axios from "axios";

const CameraPanel = ({ isActive, onToggle, onDetection }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fps, setFps] = useState(0);
  const [modelStatus, setModelStatus] = useState("checking");

  useEffect(() => {
    const checkMLService = async () => {
      try {
        const response = await axios.get("http://localhost:8000/health", { timeout: 2000 });
        setModelStatus(response.data.model_loaded ? "ready" : "loading");
      } catch (err) {
        setModelStatus("offline");
        console.warn("⚠️ ML service not available:", err.message);
      }
    };

    checkMLService();
    const interval = setInterval(checkMLService, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("❌ Camera error:", err);
        setError("Camera access denied. Please enable camera permissions.");
      }
    };

    startCamera();

    let frameCount = 0;
    let lastFpsTime = Date.now();
    let lastDetectionTime = 0;

    const detectFrame = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        detectionIntervalRef.current = requestAnimationFrame(detectFrame);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0);

      frameCount++;
      const now = Date.now();
      if (now - lastFpsTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastFpsTime = now;
      }

      if (now - lastDetectionTime >= 2000) {
        lastDetectionTime = now;
        captureAndDetect(canvas);
      }

      detectionIntervalRef.current = requestAnimationFrame(detectFrame);
    };

    detectionIntervalRef.current = requestAnimationFrame(detectFrame);

    return () => {
      if (detectionIntervalRef.current) cancelAnimationFrame(detectionIntervalRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isActive]);

  const captureAndDetect = async (canvas) => {
    try {
      const frameData = canvas.toDataURL("image/jpeg", 0.7);
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "/api/translate/detect",
        { frame: frameData },
        { timeout: 15000 },
      );

      const { detections: newDetections, classNames } = response.data;
      setDetections(newDetections);

      // ✅ Notify parent with detected signs
      if (onDetection && newDetections.length > 0) {
        onDetection(newDetections);
      }

      if (videoRef.current && canvas) {
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0);
        drawBoundingBoxes(canvas, newDetections, classNames);
      }
    } catch (error) {
      if (error.code !== "ECONNABORTED") {
        console.error("❌ Detection error:", error.message);
        if (error.response?.status === 401) {
          setError("Not authenticated. Please login first.");
        } else if (error.response?.status === 503) {
          setError("ML service offline. Check Python service.");
        } else {
          setError("Detection failed. Retrying...");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const drawBoundingBoxes = (canvas, detections, classNames) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    detections.forEach((det) => {
      const { bbox, class: className, confidence } = det;
      const x = bbox.x1;
      const y = bbox.y1;
      const w = bbox.x2 - bbox.x1;
      const h = bbox.y2 - bbox.y1;

      const hue = Math.round(confidence * 100) % 360;
      const color = `hsl(${hue}, 100%, 50%)`;

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      const label = `${className} ${(confidence * 100).toFixed(0)}%`;
      ctx.font = "bold 14px sans-serif";
      const textWidth = ctx.measureText(label).width + 10;
      const textHeight = 24;

      ctx.fillStyle = color;
      ctx.fillRect(x, y - textHeight, textWidth, textHeight);

      ctx.fillStyle = "#000";
      ctx.fillText(label, x + 5, y - 6);
    });
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full relative group rounded-2xl overflow-hidden bg-gray-900 border-2 border-gray-200 shadow-lg transition-all duration-300">
      {/* Top Controls */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-3">
          <div className={`flex bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 items-center gap-2 ${isActive ? "text-red-400" : "text-gray-400"}`}>
            {isActive ? (
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
            ) : (
              <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
            )}
            <span className="text-white text-xs font-medium tracking-wide">
              {isActive ? "LIVE" : "OFFLINE"}
            </span>
          </div>

          {isActive && (
            <div className="text-xs text-gray-300 bg-black/40 px-2 py-1 rounded-full">
              {fps} FPS
            </div>
          )}

          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            modelStatus === "ready" ? "bg-green-500/20 text-green-300"
            : modelStatus === "loading" ? "bg-yellow-500/20 text-yellow-300"
            : "bg-red-500/20 text-red-300"
          }`}>
            <Wifi size={12} />
            {modelStatus === "ready" ? "Model Ready" : modelStatus === "loading" ? "Loading..." : "Offline"}
          </div>
        </div>

        <button className="text-white/80 hover:text-white p-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full transition-all">
          <Maximize size={18} />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden bg-black">
        {isActive ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0 }}
            />
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover"
              style={{ display: 'block', minHeight: '200px' }}
            />

            {error && (
              <div className="absolute top-16 left-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 z-10">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {detections.length > 0 && (
              <div className="absolute bottom-4 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                ✓ {detections.length} {detections.length === 1 ? "Sign" : "Signs"} Detected
              </div>
            )}

            {loading && (
              <div className="absolute top-4 right-16 bg-black/50 px-3 py-1 rounded-full text-white text-xs">
                ⏳ Processing...
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
              <VideoOff size={32} className="text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium text-lg">Camera Paused</p>
            <p className="text-gray-500 text-sm">Click below to start detecting signs</p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col gap-4 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        {modelStatus === "offline" && isActive && (
          <div className="self-center flex items-center gap-2 bg-red-500/20 backdrop-blur-md border border-red-500/40 text-red-300 px-4 py-2 rounded-full text-xs font-medium">
            <AlertCircle size={14} />
            ML Service Offline - Run: python -m uvicorn ml-service.main:app --port 8000
          </div>
        )}

        {isActive && detections.length === 0 && !error && (
          <div className="self-center flex items-center gap-2 bg-blue-500/20 backdrop-blur-md border border-blue-500/40 text-blue-300 px-4 py-2 rounded-full text-xs font-medium">
            <AlertCircle size={14} />
            No signs detected yet
          </div>
        )}

        <div className="flex justify-center items-center gap-6">
          <button
            onClick={onToggle}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95 ${
              isActive
                ? "bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-500/30"
                : "bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:ring-teal-500/30"
            }`}
            title={isActive ? "Stop Camera" : "Start Camera"}
          >
            {isActive ? <VideoOff size={24} className="text-white" /> : <Camera size={24} className="text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraPanel;