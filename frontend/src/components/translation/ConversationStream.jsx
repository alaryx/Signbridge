import React, { useEffect, useRef } from 'react';
import { Volume2, Play, CheckCircle2, Hand } from 'lucide-react';

const ConversationStream = ({ messages }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto space-y-6 pr-4 pb-4 scroll-smooth">
            {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 flex-col gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Hand className="text-gray-300 w-8 h-8" />
                    </div>
                    <p>Start signing or typing to begin.</p>
                </div>
            ) : (
                messages.map((msg) => {
                    const isISL = msg.direction === 'sign_to_text';

                    return (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${isISL ? 'items-start' : 'items-end'} w-full animate-in fade-in slide-in-from-bottom-4 duration-300`}
                        >
                            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 relative shadow-sm
                ${isISL
                                    ? 'bg-white border text-gray-800 rounded-tl-sm border-gray-200'
                                    : 'bg-brand-600 text-white rounded-tr-sm'
                                }`}
                            >
                                {/* Confidence Badge for ISL input */}
                                {isISL && msg.confidence && (
                                    <div className="absolute -top-3 left-2 flex items-center gap-1 bg-white border border-gray-100 shadow-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-brand-600">
                                        <CheckCircle2 size={10} className="text-brand-500" />
                                        {Math.round(msg.confidence * 100)}% Match
                                    </div>
                                )}

                                <p className="text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap">
                                    {msg.content}
                                </p>

                                {/* Message Footer */}
                                <div className={`flex items-center mt-2 space-x-2 text-xs
                  ${isISL ? 'text-gray-400' : 'text-brand-200'}`}
                                >
                                    <span>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>

                                    {isISL && (
                                        <button className="hover:text-brand-600 transition-colors bg-gray-50 hover:bg-brand-50 rounded-full p-1 ml-auto">
                                            <Volume2 size={14} />
                                        </button>
                                    )}
                                    {!isISL && (
                                        <button className="hover:text-white transition-colors bg-brand-700 hover:bg-brand-500 rounded-full p-1 ml-auto">
                                            <Play size={14} className="fill-current" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}

            {/* Invisible anchor — always scrolled into view on new message */}
            <div ref={bottomRef} />
        </div>
    );
};

export default ConversationStream;