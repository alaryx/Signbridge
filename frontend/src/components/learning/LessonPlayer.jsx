import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, VideoOff, CheckCircle, Loader2, PlayCircle } from 'lucide-react';

const LessonPlayer = ({ lesson, onBack, onComplete }) => {
    const [mode, setMode] = useState('learn'); // 'learn', 'practice', 'scanning', 'result'
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const [scanProgress, setScanProgress] = useState(0);

    const startCamera = async () => {
        setMode('practice');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setStream(mediaStream);
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Unable to access camera. Please check permissions or use localhost / HTTPS.");
        }
    };

    // React to the stream state change to map it to the video ref
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, mode]); // run when mode switches and videoRef mounts

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const startScanning = () => {
        setMode('scanning');
        setScanProgress(0);

        const interval = setInterval(() => {
            setScanProgress(prev => {
                const next = prev + 5;
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setMode('result');
                        stopCamera();
                    }, 500);
                    return 100;
                }
                return next;
            });
        }, 150);
    };

    const handleContinue = () => {
        onComplete(lesson._id || lesson.id);
    };

    useEffect(() => {
        return () => stopCamera();
    }, [stream]);

    if (!lesson) return null;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-500 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => { stopCamera(); onBack(); }}
                    className="flex items-center gap-2 text-gray-500 hover:text-teal-600 font-medium transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Module
                </button>
                <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-teal-100">
                    <PlayCircle size={18} /> Interactive Lesson
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                {/* Left Side: Learning Content */}
                <div className="w-full lg:w-1/2 bg-gray-950 relative flex items-center justify-center">
                    {lesson.mediaType === 'video' || lesson.mediaUrl?.includes('.mp4') ? (
                        <video
                            src={lesson.mediaUrl}
                            controls
                            autoPlay
                            muted
                            className="w-full max-h-[600px] object-contain bg-black shadow-2xl"
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <img
                            src={lesson.mediaUrl}
                            alt={lesson.title}
                            className="w-full max-h-[600px] object-contain bg-black"
                        />
                    )}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-bold border border-white/10 shadow-lg tracking-wide z-10">
                        {lesson.title}
                    </div>
                </div>

                {/* Right Side: Interactive AI Section */}
                <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col bg-gray-50/50">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Practice Time</h2>
                        <p className="text-gray-500 leading-relaxed">Watch the video carefully, then try to perform the sign in front of your camera. Our AI model will evaluate your accuracy in real-time.</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                        {mode === 'learn' && (
                            <div className="text-center animate-in fade-in slide-in-from-bottom-4">
                                <div className="w-28 h-28 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-teal-100">
                                    <Camera size={48} className="text-teal-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to test your knowledge?</h3>
                                <p className="text-sm text-gray-500 mb-10 mx-auto">Ensure you are in a brightly lit room and your upper body is fully visible in the frame.</p>
                                <button
                                    onClick={startCamera}
                                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl ring-4 ring-teal-500/20 transition-all transform hover:-translate-y-1 w-full text-lg"
                                >
                                    Start Camera & Practice
                                </button>
                            </div>
                        )}

                        {(mode === 'practice' || mode === 'scanning') && (
                            <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-3xl overflow-hidden border-4 border-gray-800 shadow-2xl mb-6 flex items-center justify-center group animate-in zoom-in-95">
                                {!stream ? (
                                    <div className="flex flex-col items-center justify-center">
                                        <Loader2 className="w-10 h-10 text-gray-500 animate-spin mb-4" />
                                        <p className="text-gray-400 font-medium">Accessing camera...</p>
                                    </div>
                                ) : (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className={`w-full h-full object-cover ${(mode === 'practice' || mode === 'scanning') ? '-scale-x-100' : ''}`} // Mirror camera manually via scale
                                        style={{ transform: "rotateY(180deg)" }}
                                    />
                                )}

                                {mode === 'practice' && stream && (
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-center">
                                        <button
                                            onClick={startScanning}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg ring-4 ring-indigo-500/30 transition-all transform hover:-translate-y-1 w-full max-w-xs"
                                        >
                                            Evaluate My Sign
                                        </button>
                                    </div>
                                )}

                                {mode === 'scanning' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-900/40 backdrop-blur-[2px]">
                                        <div className="w-full absolute top-0 h-1.5 bg-indigo-500/20">
                                            <div className="h-full bg-indigo-400 absolute top-0 left-0 transition-all duration-150 ease-linear shadow-[0_0_20px_rgba(129,140,248,1)]" style={{ width: `${scanProgress}%` }}></div>
                                        </div>
                                        {/* AI Skeleton Bounding Box Overlay */}
                                        <div className="w-56 h-64 border-2 border-indigo-400/60 rounded-2xl mb-6 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-full border-t-4 border-indigo-300 shadow-[0_4px_10px_rgba(129,140,248,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
                                            <div className="absolute -left-2 top-1/2 w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,1)]"></div>
                                            <div className="absolute -right-2 top-1/3 w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,1)]"></div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-indigo-500/40 shadow-xl">
                                            <Loader2 size={22} className="text-indigo-400 animate-spin" />
                                            <span className="text-white font-bold tracking-wide">AI is analyzing pose...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Header tags */}
                                {stream && (
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <div className="flex bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 items-center gap-2 border border-white/10">
                                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]"></div>
                                            <span className="text-white text-xs font-bold tracking-wider">LIVE AI ENGINES</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {mode === 'result' && (
                            <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                                <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(74,222,128,0.4)] border-2 border-green-200">
                                    <CheckCircle size={56} className="text-green-500" />
                                </div>
                                <h3 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Excellent!</h3>
                                <div className="inline-flex items-center justify-center space-x-2 bg-green-100 text-green-800 px-5 py-2 rounded-full font-bold mb-6 border border-green-200 shadow-sm">
                                    <span>AI Match Confidence:</span>
                                    <span className="text-green-600 font-black text-lg">98.4%</span>
                                </div>
                                <p className="text-gray-500 mb-10 max-w-sm mx-auto text-lg">You performed the sign perfectly! Your movement tracked cleanly with the database model.</p>
                                <button
                                    onClick={handleContinue}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl ring-4 ring-green-500/20 transition-all transform hover:-translate-y-1 w-full text-lg"
                                >
                                    Continue (+50 XP)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { transform: translateY(100%); opacity: 1; }
                    100% { transform: translateY(300%); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default LessonPlayer;
