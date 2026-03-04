import React, { useState } from 'react';
import CameraPanel from '../components/translation/CameraPanel';
import ConversationStream from '../components/translation/ConversationStream';
import { Camera, Type, ArrowRight } from 'lucide-react';

const Translation = () => {
    const [mode, setMode] = useState('sign_to_text'); // 'sign_to_text' | 'text_to_sign'
    const [isCameraActive, setIsCameraActive] = useState(true);
    const [textInput, setTextInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, direction: 'sign_to_text', content: 'Hello', confidence: 0.98, timestamp: new Date(Date.now() - 60000).toISOString() },
        { id: 2, direction: 'text_to_sign', content: 'Hi! How can I help you?', confidence: 1.0, timestamp: new Date(Date.now() - 30000).toISOString() },
    ]);

    const toggleCamera = () => setIsCameraActive(!isCameraActive);

    const handleSendText = () => {
        if (!textInput.trim()) return;
        const newMsg = {
            id: messages.length + 1,
            direction: 'text_to_sign',
            content: textInput,
            confidence: 0.95,
            timestamp: new Date().toISOString(),
        };
        setMessages([...messages, newMsg]);
        setTextInput('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">

            {/* Mode Selector Tabs */}
            <div className="flex items-center justify-center gap-2 p-4 bg-white border-b border-gray-100 shadow-sm">
                <button
                    onClick={() => setMode('sign_to_text')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${mode === 'sign_to_text'
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30 scale-105'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Camera size={18} />
                    Sign to Text
                </button>

                <ArrowRight size={20} className="text-gray-300 mx-1" />

                <button
                    onClick={() => setMode('text_to_sign')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${mode === 'text_to_sign'
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30 scale-105'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Type size={18} />
                    Text to Sign
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                {/* === SIGN TO TEXT MODE === */}
                {mode === 'sign_to_text' && (
                    <>
                        {/* Camera Panel */}
                        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col p-4 border-r border-gray-200">
                            <CameraPanel isActive={isCameraActive} onToggle={toggleCamera} />
                        </div>

                        {/* Conversation Output */}
                        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col p-4 bg-white relative">
                            <div className="mb-3">
                                <h2 className="text-lg font-bold text-gray-800">Recognized Text</h2>
                                <p className="text-xs text-gray-400">Signs detected by the camera will appear here as text</p>
                            </div>
                            <ConversationStream messages={messages.filter(m => m.direction === 'sign_to_text')} />
                        </div>
                    </>
                )}

                {/* === TEXT TO SIGN MODE === */}
                {mode === 'text_to_sign' && (
                    <>
                        {/* Text Input Area */}
                        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col p-6 border-r border-gray-200 bg-white">
                            <div className="mb-4">
                                <h2 className="text-lg font-bold text-gray-800">Enter Text</h2>
                                <p className="text-xs text-gray-400">Type the text you want to convert into Indian Sign Language</p>
                            </div>

                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Type something to translate to ISL..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 text-lg"
                            ></textarea>

                            <button
                                onClick={handleSendText}
                                className="mt-4 bg-teal-600 text-white rounded-xl px-6 py-3 font-semibold hover:bg-teal-700 transition-colors shadow-md focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                            >
                                Translate to ISL <ArrowRight size={18} />
                            </button>
                        </div>

                        {/* ISL Output Placeholder */}
                        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col p-6 bg-gray-50 items-center justify-center">
                            <div className="w-full max-w-md text-center space-y-6">
                                <div className="w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center border-2 border-gray-200 shadow-inner">
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                                            <Type size={28} className="text-gray-500" />
                                        </div>
                                        <p className="text-gray-400 font-medium">ISL Output</p>
                                        <p className="text-gray-600 text-xs">Avatar / GIF / Video will appear here</p>
                                        <p className="text-gray-700 text-xs">(Waiting for OpenCV integration)</p>
                                    </div>
                                </div>

                                {/* Playback Controls Placeholder */}
                                <div className="flex items-center justify-center gap-4">
                                    <button className="bg-white border border-gray-200 rounded-full p-3 text-gray-400 shadow-sm cursor-not-allowed" disabled>
                                        ⏮
                                    </button>
                                    <button className="bg-teal-600 text-white rounded-full p-4 shadow-lg shadow-teal-500/30 cursor-not-allowed" disabled>
                                        ▶
                                    </button>
                                    <button className="bg-white border border-gray-200 rounded-full p-3 text-gray-400 shadow-sm cursor-not-allowed" disabled>
                                        🐢
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400">Play / Pause / Slow Motion (coming soon)</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Translation;
