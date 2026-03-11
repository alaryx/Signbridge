import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, CheckCircle, Loader2, PlayCircle, Info, Sparkles, Trophy, XCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

const ML_URL = import.meta.env.VITE_ML_URL;

// Normalize lesson title to match ML class names
// e.g. "Thank You" → "THANK_YOU", "Hello" → "HELLO"
const normalizeLessonTitle = (title = '') =>
    title.trim().toUpperCase().replace(/\s+/g, '_');

const LessonPlayer = ({ lesson, onBack, onComplete }) => {
    const [mode, setMode] = useState('learn'); // 'learn' | 'practice' | 'scanning' | 'result'
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // ML state
    const [mlStatus, setMlStatus] = useState('checking'); // 'checking' | 'ready' | 'offline'
    const [detectionResult, setDetectionResult] = useState(null); // { passed, detectedSign, confidence, allDetections }
    const [scanError, setScanError] = useState(null);

    // ── ML health check ───────────────────────────────────────────────────────
    useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch(`${ML_URL}/health`, { signal: AbortSignal.timeout(5000) });
                const data = await res.json();
                setMlStatus(data.model_loaded ? 'ready' : 'loading');
            } catch {
                setMlStatus('offline');
            }
        };
        check();
        const id = setInterval(check, 8000);
        return () => clearInterval(id);
    }, []);

    // ── Camera helpers ────────────────────────────────────────────────────────
    const startCamera = async () => {
        setMode('practice');
        setScanError(null);
        setDetectionResult(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
                audio: false,
            });
            setStream(mediaStream);
        } catch (err) {
            console.error('Camera error:', err);
            setScanError('Camera access denied. Please enable camera permissions.');
            setMode('learn');
        }
    };

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, mode]);

    // ── Auto-evaluate 4 seconds after stream starts ───────────────────────────
    useEffect(() => {
        if (!stream) return;
        const timer = setTimeout(() => {
            evaluateSign();
        }, 4000);
        return () => clearTimeout(timer);
    }, [stream]); // eslint-disable-line react-hooks/exhaustive-deps

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
    };

    useEffect(() => () => stopCamera(), []); // cleanup on unmount

    // ── Frame capture & ML call ───────────────────────────────────────────────
    const captureFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !video.videoWidth) return null;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        return canvas;
    };

    const evaluateSign = async () => {
        if (mlStatus === 'offline') {
            setScanError('ML service is offline. Please try again later.');
            return;
        }

        setMode('scanning');
        setScanError(null);

        const canvas = captureFrame();
        if (!canvas) {
            setScanError('Could not capture frame. Please try again.');
            setMode('practice');
            return;
        }

        canvas.toBlob(async (blob) => {
            try {
                const formData = new FormData();
                formData.append('file', blob, 'frame.jpg');

                const response = await fetch(`${ML_URL}/detect`, {
                    method: 'POST',
                    body: formData,
                    signal: AbortSignal.timeout(30000),
                });

                if (!response.ok) {
                    throw new Error(`ML service responded with ${response.status}`);
                }

                const data = await response.json();
                const detections = data.detections || [];

                const expectedSign = normalizeLessonTitle(lesson?.title);

                // Find the top detection that matches the expected sign
                const matchingDetection = detections.find(
                    d => d.class.toUpperCase() === expectedSign
                );

                // Also get the overall top detection
                const topDetection = detections[0] || null;

                const passed = matchingDetection && matchingDetection.confidence >= 0.5;

                setDetectionResult({
                    passed,
                    detectedSign: topDetection ? topDetection.class : null,
                    confidence: matchingDetection ? matchingDetection.confidence : (topDetection?.confidence || 0),
                    matchingConfidence: matchingDetection?.confidence || 0,
                    expectedSign,
                    allDetections: detections,
                    noDetection: detections.length === 0,
                });

                stopCamera();
                setMode('result');

            } catch (err) {
                console.error('Detection error:', err);
                setScanError('Detection failed. Please try again.');
                setMode('practice');
            }
        }, 'image/jpeg', 0.92);
    };

    const handleRetry = () => {
        setDetectionResult(null);
        setScanError(null);
        startCamera();
    };

    const handleContinue = () => {
        onComplete(lesson._id || lesson.id);
    };

    if (!lesson) return null;

    const expectedSign = normalizeLessonTitle(lesson?.title);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700 pb-32">
            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <button
                    onClick={() => { stopCamera(); onBack(); }}
                    className="group flex items-center gap-2 text-gray-500 hover:text-teal-600 font-bold transition-all px-4 py-2 rounded-xl hover:bg-teal-50 w-fit -ml-4"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Module
                </button>

                <div className="flex items-center gap-3">
                    {/* ML Status pill */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                        mlStatus === 'ready'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : mlStatus === 'offline'
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                    }`}>
                        {mlStatus === 'ready' ? <Wifi size={12} /> : <WifiOff size={12} />}
                        {mlStatus === 'ready' ? 'AI Ready' : mlStatus === 'offline' ? 'AI Offline' : 'AI Loading...'}
                    </div>

                    <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-black shadow-sm border border-indigo-100 uppercase tracking-wider">
                        <Sparkles size={16} /> Interactive Lesson
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter">
                    {lesson.title}
                </h1>
                <div className="w-24 h-2 bg-teal-500 rounded-full mt-4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left: Video + Description */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/10 relative group">
                        {lesson.mediaType === 'video' || lesson.mediaUrl?.includes('.mp4') ? (
                            <video
                                src={lesson.mediaUrl}
                                controls
                                autoPlay
                                loop
                                muted
                                className="w-full aspect-video object-contain"
                                crossOrigin="anonymous"
                            />
                        ) : (
                            <img
                                src={lesson.mediaUrl}
                                alt={lesson.title}
                                className="w-full aspect-video object-contain"
                            />
                        )}
                        <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle size={14} className="text-teal-400" /> Reference View
                        </div>
                    </div>

                    {lesson.description && (
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-teal-50 rounded-2xl text-teal-600 transition-transform group-hover:scale-110">
                                    <Info size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-teal-600 uppercase tracking-widest mb-2">How to sign</h3>
                                    <p className="text-gray-700 text-lg leading-relaxed font-medium">{lesson.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Practice Zone */}
                <div className="lg:col-span-5 h-full">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 p-8 md:p-10 h-full flex flex-col min-h-[500px]">

                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Practice Zone</h2>
                            <p className="text-gray-500 font-medium">
                                Show the sign for <span className="text-teal-600 font-black">"{lesson.title}"</span> and let AI evaluate your accuracy.
                            </p>
                        </div>

                        {/* Error Banner */}
                        {scanError && (
                            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                                <XCircle size={16} className="shrink-0" />
                                {scanError}
                            </div>
                        )}

                        <div className="flex-1 flex flex-col justify-center">

                            {/* ── LEARN MODE ── */}
                            {mode === 'learn' && (
                                <div className="text-center animate-in fade-in slide-in-from-bottom-6 duration-500">
                                    <div className="relative inline-block mb-10">
                                        <div className="w-32 h-32 bg-teal-50 rounded-full flex items-center justify-center border-2 border-teal-100 shadow-inner">
                                            <Camera size={56} className="text-teal-600" />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-gray-100">
                                            <Sparkles size={20} className="text-amber-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">Test Your Skills</h3>
                                    <p className="text-gray-500 leading-relaxed max-w-xs mx-auto mb-10">
                                        Watch the reference video, then activate the camera and perform the sign.
                                    </p>
                                    <button
                                        onClick={startCamera}
                                        disabled={mlStatus === 'offline'}
                                        className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 px-8 rounded-2xl shadow-2xl hover:-translate-y-1 transition-all active:scale-95 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                    >
                                        {mlStatus === 'offline' ? 'AI Offline — Unavailable' : 'Activate AI Camera'}
                                    </button>
                                </div>
                            )}

                            {/* ── PRACTICE / SCANNING MODE ── */}
                            {(mode === 'practice' || mode === 'scanning') && (
                                <div className="flex-1 flex flex-col">
                                    <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl mb-8 group ring-1 ring-gray-100">

                                        {!stream ? (
                                            <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-400">
                                                <Loader2 size={40} className="animate-spin text-teal-500" />
                                                <p className="font-bold tracking-widest uppercase text-xs">Awaiting Camera...</p>
                                            </div>
                                        ) : (
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover -scale-x-100"
                                            />
                                        )}

                                        {/* Scanning overlay */}
                                        {mode === 'scanning' && (
                                            <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-[4px] flex flex-col items-center justify-center animate-in fade-in duration-300">
                                                <div className="w-48 h-56 border-2 border-dashed border-indigo-400/50 rounded-2xl flex items-center justify-center">
                                                    <div className="absolute inset-0 border-2 border-indigo-400 rounded-2xl animate-pulse opacity-50"></div>
                                                </div>
                                                <div className="mt-8 flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 text-white shadow-2xl">
                                                    <Loader2 size={18} className="animate-spin text-indigo-300" />
                                                    <span className="font-black text-xs uppercase tracking-[0.2em]">Analysing sign...</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute top-4 left-4 bg-teal-500/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Live</span>
                                        </div>
                                    </div>

                                    {mode === 'practice' && stream && (
                                        <div className="w-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 text-sm">
                                            <Loader2 size={18} className="animate-spin" />
                                            Evaluating in a moment… hold your sign steady
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── RESULT MODE ── */}
                            {mode === 'result' && detectionResult && (
                                <div className="text-center animate-in zoom-in-95 duration-700">

                                    {/* Pass */}
                                    {detectionResult.passed && (
                                        <>
                                            <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-2 border-green-100 shadow-xl relative">
                                                <Trophy size={48} className="text-green-500" />
                                                <div className="absolute -top-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-lg">
                                                    <CheckCircle size={16} />
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-black text-gray-900 mb-2 leading-none">Correct!</h3>
                                            <div className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                                                {detectionResult.detectedSign} · {(detectionResult.matchingConfidence * 100).toFixed(0)}% confidence
                                            </div>
                                            <p className="text-gray-500 font-medium mb-10 px-4">
                                                The AI recognised your sign. Outstanding work!
                                            </p>
                                            <button
                                                onClick={handleContinue}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 px-8 rounded-2xl shadow-2xl hover:-translate-y-1 transition-all active:scale-95 text-lg"
                                            >
                                                Claim Rewards (+50 XP)
                                            </button>
                                        </>
                                    )}

                                    {/* Fail */}
                                    {!detectionResult.passed && (
                                        <>
                                            <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-2 border-red-100 shadow-xl relative">
                                                <XCircle size={48} className="text-red-400" />
                                            </div>
                                            <h3 className="text-3xl font-black text-gray-900 mb-2 leading-none">Not quite!</h3>

                                            {detectionResult.noDetection ? (
                                                <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                                                    No sign detected
                                                </div>
                                            ) : (
                                                <div className="inline-block bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                                                    Detected: {detectionResult.detectedSign || 'Unknown'} · Expected: {expectedSign}
                                                </div>
                                            )}

                                            <p className="text-gray-500 font-medium mb-10 px-4">
                                                {detectionResult.noDetection
                                                    ? 'Make sure your hand is clearly visible and well-lit, then try again.'
                                                    : `You showed "${detectionResult.detectedSign}" but we need "${lesson.title}". Watch the reference video and try again.`
                                                }
                                            </p>

                                            <div className="space-y-3">
                                                <button
                                                    onClick={handleRetry}
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                                                >
                                                    <RefreshCw size={20} /> Try Again
                                                </button>
                                                <button
                                                    onClick={handleContinue}
                                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 px-8 rounded-2xl transition-colors text-sm"
                                                >
                                                    Skip for now
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonPlayer;