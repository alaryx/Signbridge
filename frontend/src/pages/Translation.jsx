import React, { useState } from 'react';
import CameraPanel from '../components/translation/CameraPanel';
import ConversationStream from '../components/translation/ConversationStream';
import SignVideoPlayer from '../components/translation/SignVideoPlayer';
import { Camera, Type, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NODE_API_URL = 'http://localhost:5000/api/translate';

const Translation = () => {
    const { user, updateUser } = useAuth();
    const [mode, setMode] = useState('sign_to_text');
    const [isCameraActive, setIsCameraActive] = useState(false); // ✅ FIX: was `true`, camera now starts only when user clicks button
    const [textInput, setTextInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sequence, setSequence] = useState(null);
    const [error, setError] = useState('');

    // ✅ FIX: Also turn camera OFF when switching to text_to_sign mode,
    //    so the stream doesn't stay alive in the background.
    const handleModeSwitch = (newMode) => {
        if (newMode === 'text_to_sign') {
            setIsCameraActive(false); // stop camera when leaving sign_to_text
        }
        setMode(newMode);
    };

    const toggleCamera = () => setIsCameraActive(prev => !prev);

    // ✅ Called by CameraPanel when a sign is detected
    const handleSignDetected = (detections) => {
        if (!detections || detections.length === 0) return;
        const top = detections[0]; // highest confidence detection
        const newMsg = {
            id: Date.now(),
            direction: 'sign_to_text',
            content: top.class,
            confidence: top.confidence,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, newMsg]);
    };

    const handleSendText = async () => {
        if (!textInput.trim()) return;

        setIsLoading(true);
        setError('');
        setSequence(null);

        const newMsg = {
            id: Date.now(),
            direction: 'text_to_sign',
            content: textInput,
            confidence: 0.95,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, newMsg]);

        if (user) {
            const currentTranslations = user.translations || [];
            updateUser({
                translations: [...currentTranslations, { text: textInput, timestamp: new Date().toISOString() }]
            });
        }

        try {
            const response = await fetch(NODE_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ direction: 'text_to_sign', content: textInput }),
            });

            if (!response.ok) throw new Error('Translation service unavailable.');

            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Translation failed.');

            setSequence(data.sequence);
        } catch (err) {
            console.error('Translation error:', err);
            setError(err.message || 'Could not connect to the translation service.');
        } finally {
            setIsLoading(false);
        }

        setTextInput('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">

            {/* Mode Selector Tabs */}
            <div className="flex items-center justify-center gap-2 p-4 bg-white border-b border-gray-100 shadow-sm">
                <button
                    onClick={() => handleModeSwitch('sign_to_text')} // ✅ use handleModeSwitch
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${mode === 'sign_to_text'
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Camera size={18} />
                    Sign to Text
                </button>

                <ArrowRight size={20} className="text-gray-300 mx-1" />

                <button
                    onClick={() => handleModeSwitch('text_to_sign')} // ✅ use handleModeSwitch
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${mode === 'text_to_sign'
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 scale-105'
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
                        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col p-4 border-r border-gray-200">
                            <CameraPanel
                                isActive={isCameraActive}
                                onToggle={toggleCamera}
                                onDetection={handleSignDetected}
                            />
                        </div>

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
                        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col p-6 border-r border-gray-200 bg-white">
                            <div className="mb-4">
                                <h2 className="text-lg font-bold text-gray-800">Enter Text</h2>
                                <p className="text-xs text-gray-400">Type the text you want to convert into Indian Sign Language</p>
                            </div>

                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Type something to translate to ISL..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-700 text-lg"
                            ></textarea>

                            <button
                                onClick={handleSendText}
                                className="mt-4 bg-brand-600 text-white rounded-xl px-6 py-3 font-semibold hover:bg-brand-700 transition-colors shadow-md focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                            >
                                Translate to ISL <ArrowRight size={18} />
                            </button>
                        </div>

                        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col p-4 bg-gray-50 overflow-y-auto">
                            {isLoading && (
                                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-brand-600">
                                    <Loader2 size={40} className="animate-spin" />
                                    <p className="font-semibold text-gray-500">Fetching ISL sequence...</p>
                                </div>
                            )}
                            {error && !isLoading && (
                                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl flex items-start gap-3">
                                    <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={20} />
                                    <div>
                                        <p className="font-bold text-red-700 text-sm">Translation Error</p>
                                        <p className="text-red-600 text-sm mt-1">{error}</p>
                                    </div>
                                </div>
                            )}
                            {!isLoading && (
                                <SignVideoPlayer sequence={sequence} />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Translation;