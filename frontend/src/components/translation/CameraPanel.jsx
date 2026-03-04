import React from 'react';
import { Camera, VideoOff, Maximize, AlertCircle } from 'lucide-react';

const CameraPanel = ({ isActive, onToggle }) => {
    return (
        <div className="flex-1 flex flex-col w-full h-full relative group rounded-2xl overflow-hidden bg-gray-900 border-2 border-gray-100 shadow-sm transition-all duration-300">

            {/* Top Controls Overlay */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 items-center gap-2">
                    {isActive ? (
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                    ) : (
                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                    )}
                    <span className="text-white text-xs font-medium tracking-wide">
                        {isActive ? 'LIVE REC' : 'OFFLINE'}
                    </span>
                </div>

                <button className="text-white/80 hover:text-white p-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full transition-all">
                    <Maximize size={18} />
                </button>
            </div>

            {/* Main Camera View */}
            <div className="flex-1 w-full h-full flex items-center justify-center relative">
                {isActive ? (
                    <div className="relative w-full h-full">
                        {/* Fake Camera Feed placeholder (Grey block) */}
                        <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center">
                            <Camera className="w-16 h-16 text-slate-600 mb-4 opacity-50" />
                            <p className="text-slate-500 font-medium">Camera Active</p>
                            <p className="text-slate-600 text-sm mt-1">Waiting for OpenCV integration...</p>
                        </div>

                        {/* Bounding Box Overlay for Face/Hands */}
                        <div className="absolute inset-0 border-2 border-teal-500/30 m-8 rounded-xl border-dashed opacity-50 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <div className="w-48 h-56 border-2 border-teal-400/50 rounded-full mb-32 relative">
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-teal-400 text-xs font-semibold tracking-wider bg-black/50 px-2 py-0.5 rounded">FACE</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                            <VideoOff size={32} className="text-gray-500" />
                        </div>
                        <p className="text-gray-400 font-medium text-lg">Camera is paused</p>
                    </div>
                )}
            </div>

            {/* Bottom Controls Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col gap-4 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                {/* Warning Toast */}
                {isActive && (
                    <div className="self-center flex items-center gap-2 bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-amber-200 px-4 py-2 rounded-full text-xs font-medium">
                        <AlertCircle size={14} /> Low Light Detected
                    </div>
                )}

                <div className="flex justify-center items-center gap-6">
                    <button
                        onClick={onToggle}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isActive
                                ? 'bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-500/30'
                                : 'bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:ring-teal-500/30'
                            }`}
                    >
                        {isActive ? <VideoOff size={24} className="text-white" /> : <Camera size={24} className="text-white" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CameraPanel;
