import React, { useState } from 'react';
import { Mic, Volume2, ArrowRightLeft } from 'lucide-react';

const SpeechText = () => {
    const [isListening, setIsListening] = useState(false);
    const [text, setText] = useState('');

    const toggleListen = () => {
        setIsListening(!isListening);
        if (!isListening) {
            setTimeout(() => {
                setText("This is mock transcribed text from speech...");
                setIsListening(false);
            }, 3000);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="bg-teal-600 p-6 text-center">
                    <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                        <ArrowRightLeft className="opacity-80" /> Speech ↔ Text
                    </h1>
                    <p className="text-teal-100 mt-1">Supplementary communication tools</p>
                </div>

                <div className="p-8 space-y-8 flex flex-col items-center">

                    {/* Microphone Button */}
                    <div className="relative group cursor-pointer" onClick={toggleListen}>
                        {isListening && (
                            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
                        )}
                        <div className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl
                    ${isListening
                                ? 'bg-red-500 scale-110 shadow-red-500/30'
                                : 'bg-teal-500 hover:bg-teal-600 hover:scale-105 shadow-teal-500/30'
                            }`}
                        >
                            <Mic className="text-white w-10 h-10" />
                        </div>
                    </div>

                    <p className="text-gray-500 font-medium">
                        {isListening ? 'Listening...' : 'Tap to start speaking'}
                    </p>

                    {/* Output Text Area */}
                    <div className="w-full relative">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Transcribed text will appear here, or type text to speak it aloud..."
                            className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow text-gray-700 bg-gray-50"
                        ></textarea>

                        <button className="absolute bottom-4 right-4 bg-white p-2 text-teal-600 rounded-full shadow-sm border border-gray-100 hover:bg-teal-50 hover:scale-105 active:scale-95 transition-all">
                            <Volume2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpeechText;
