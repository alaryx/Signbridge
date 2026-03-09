import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, VideoOff, CheckCircle, Loader2, PlayCircle, Info, Sparkles, Trophy } from 'lucide-react';

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

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, mode]);

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
                    }, 800);
                    return 100;
                }
                return next;
            });
        }, 120);
    };

    const handleContinue = () => {
        onComplete(lesson._id || lesson.id);
    };

    useEffect(() => {
        return () => stopCamera();
    }, [stream]);

    if (!lesson) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700 pb-32">

            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <button
                    onClick={() => { stopCamera(); onBack(); }}
                    className="group flex items-center gap-2 text-gray-500 hover:text-teal-600 font-bold transition-all px-4 py-2 rounded-xl hover:bg-teal-50 w-fit -ml-4"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Module
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-black shadow-sm border border-indigo-100 uppercase tracking-wider">
                        <Sparkles size={16} /> Interactive Lesson
                    </div>
                </div>
            </div>

            {/* Main Lesson Title Section - High Impact */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter">
                    {lesson.title}
                </h1>
                <div className="w-24 h-2 bg-teal-500 rounded-full mt-4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Media & Instructions (7/12) */}
                <div className="lg:col-span-7 space-y-8">

                    {/* Media Card */}
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

                        {/* Status Overlay */}
                        <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle size={14} className="text-teal-400" /> Reference View
                        </div>
                    </div>

                    {/* Action Description Block - Premium Card */}
                    {lesson.description && (
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-teal-50 rounded-2xl text-teal-600 transition-transform group-hover:scale-110">
                                    <Info size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-teal-600 uppercase tracking-widest mb-2">How to sign</h3>
                                    <p className="text-gray-700 text-lg leading-relaxed font-medium">
                                        {lesson.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Interaction & AI (5/12) */}
                <div className="lg:col-span-5 h-full">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 p-8 md:p-10 h-full flex flex-col min-h-[500px]">

                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Practice Zone</h2>
                            <p className="text-gray-500 font-medium">Capture your movements via camera for AI evaluation.</p>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
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
                                        Join the interactive session to get instant AI feedback on your sign accuracy.
                                    </p>
                                    <button
                                        onClick={startCamera}
                                        className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 px-8 rounded-2xl shadow-2xl hover:-translate-y-1 transition-all active:scale-95 text-lg"
                                    >
                                        Activate AI Camera
                                    </button>
                                </div>
                            )}

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

                                        {mode === 'scanning' && (
                                            <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-[4px] flex flex-col items-center justify-center animate-in fade-in duration-300">
                                                <div className="w-48 h-56 border-2 border-dashed border-indigo-400/50 rounded-2xl relative">
                                                    <div className="absolute inset-0 border-2 border-indigo-400 rounded-2xl animate-[pulse_2s_infinite]"></div>
                                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-400/30 overflow-hidden">
                                                        <div
                                                            className="h-full bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,1)] transition-all duration-200 ease-linear"
                                                            style={{ width: `${scanProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-8 flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 text-white shadow-2xl">
                                                    <Loader2 size={18} className="animate-spin text-indigo-300" />
                                                    <span className="font-black text-xs uppercase tracking-[0.2em]">Deep Learning Analysis...</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute top-4 left-4 bg-teal-500/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Engine</span>
                                        </div>
                                    </div>

                                    {mode === 'practice' && stream && (
                                        <button
                                            onClick={startScanning}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            <Camera size={20} /> Evaluate Accuracy
                                        </button>
                                    )}
                                </div>
                            )}

                            {mode === 'result' && (
                                <div className="text-center animate-in zoom-in-95 duration-700">
                                    <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-2 border-green-100 shadow-xl shadow-green-100/50 relative">
                                        <Trophy size={48} className="text-green-500" />
                                        <div className="absolute -top-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-lg">
                                            <CheckCircle size={16} />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-2 leading-none">Victory!</h3>
                                    <div className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
                                        Hand Match: 98.4%
                                    </div>

                                    <p className="text-gray-500 font-medium mb-12 px-6">
                                        Outstanding performance! Your signs are fluid and match the reference model perfectly.
                                    </p>

                                    <button
                                        onClick={handleContinue}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 px-8 rounded-2xl shadow-2xl hover:-translate-y-1 transition-all active:scale-95 text-lg"
                                    >
                                        Claim Rewards (+50 XP)
                                    </button>
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
