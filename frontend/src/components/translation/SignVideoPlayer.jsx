import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, MonitorPlay } from 'lucide-react';

const SignVideoPlayer = ({ sequence }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef(null);

    // Reset state when a new sequence arrives
    useEffect(() => {
        if (sequence && sequence.length > 0) {
            setCurrentIndex(0);
            setIsFinished(false);
            setIsPlaying(true);
            setHasError(false);
        }
    }, [sequence]);

    // Handle video ending
    const handleVideoEnded = () => {
        if (currentIndex < sequence.length - 1) {
            // Move to next video
            setCurrentIndex(prev => prev + 1);
        } else {
            // Sequence complete
            setIsFinished(true);
            setIsPlaying(false);
        }
    };

    // Auto-play when index changes
    useEffect(() => {
        if (videoRef.current && isPlaying && !isFinished && sequence?.length > 0) {
            videoRef.current.play().catch(err => {
                console.error("Auto-play blocked or failed:", err);
                setIsPlaying(false);
            });
        }
    }, [currentIndex, isPlaying, isFinished, sequence]);

    const handleReplay = () => {
        setCurrentIndex(0);
        setIsFinished(false);
        setIsPlaying(true);
        setHasError(false);
    };

    if (!sequence || sequence.length === 0) {
        return (
            <div className="w-full aspect-video bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-8 text-center max-w-4xl mx-auto">
                <MonitorPlay size={64} strokeWidth={1.5} className="mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-700">Waiting for translation</h3>
                <p className="mt-2 text-sm">Type a sentence above and hit translate to see the ISL animation sequence.</p>
            </div>
        );
    }

    const currentItem = sequence[currentIndex];
    // Use the Cloudinary URL returned by the Node/MongoDB backend
    const videoUrl = currentItem.videoUrl;

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Video Player Container */}
            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5">

                {hasError ? (
                    <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                            <Play size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Video load failed</h3>
                        <p className="text-sm mb-6 max-w-xs">There was an intermittent issue fetching this part of the sign sequence.</p>
                        <button
                            onClick={() => { setHasError(false); setIsPlaying(true); }}
                            className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-xl font-bold transition-transform active:scale-95"
                        >
                            Retry Segment
                        </button>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        key={videoUrl} // Force remount/reload on source change
                        src={videoUrl}
                        className="w-full h-full object-contain"
                        onEnded={handleVideoEnded}
                        onError={() => {
                            console.error("Video failed to load:", videoUrl);
                            setHasError(true);
                            setIsPlaying(false);
                        }}
                        autoPlay={isPlaying}
                        playsInline
                        preload="auto"
                    />
                )}

                {/* Overlays */}
                {!isPlaying && !isFinished && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                        <button
                            onClick={() => setIsPlaying(true)}
                            className="bg-white/20 hover:bg-white/30 p-6 rounded-full backdrop-blur-md transition-transform hover:scale-110"
                        >
                            <Play size={48} className="fill-white text-white ml-2" />
                        </button>
                    </div>
                )}

                {isFinished && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-md animate-in fade-in duration-300">
                        <h3 className="text-white text-2xl font-bold mb-6 tracking-wide drop-shadow-md">Translation Complete</h3>
                        <button
                            onClick={handleReplay}
                            className="flex items-center gap-3 bg-brand-500 hover:bg-brand-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-500/30"
                        >
                            <RotateCcw size={24} />
                            Replay Sequence
                        </button>
                    </div>
                )}

                {/* Video Info Pill */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                    <MonitorPlay size={16} />
                    <span>Part {currentIndex + 1} of {sequence.length}</span>
                </div>
            </div>

            {/* Subtitle Ribbon / Word Tracker */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {sequence.map((item, idx) => {
                        const isCurrent = idx === currentIndex && !isFinished;
                        const isPast = idx < currentIndex || isFinished;

                        // Fingerspell vs Whole Word display logic
                        const displayText = item.type === 'fingerspell' ? item.character : item.word;

                        return (
                            <React.Fragment key={idx}>
                                <div
                                    className={`
                                        px-4 py-2 rounded-xl font-bold text-lg transition-all duration-300
                                        ${isCurrent ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 scale-110 -translate-y-1' : ''}
                                        ${isPast && !isFinished ? 'bg-brand-50 text-brand-700 opacity-80' : ''}
                                        ${!isCurrent && !isPast ? 'bg-gray-100 text-gray-400' : ''}
                                        ${isFinished ? 'bg-brand-500 text-white' : ''}
                                    `}
                                >
                                    {displayText}
                                    {item.type === 'fingerspell' && (
                                        <span className="block text-[10px] uppercase tracking-widest opacity-70 mt-0.5 text-center">
                                            Letter
                                        </span>
                                    )}
                                </div>

                                {/* Arrow connector except for last item */}
                                {idx < sequence.length - 1 && (
                                    <div className={`text-xl ${isPast && !isFinished ? 'text-brand-300' : 'text-gray-300'} font-black`}>
                                        →
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SignVideoPlayer;
