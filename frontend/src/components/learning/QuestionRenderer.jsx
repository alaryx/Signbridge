import React from 'react';

const QuestionRenderer = ({ question, onAnswer }) => {
    if (!question) return null;

    const renderOptions = () => {
        if (question.type === 'single_choice' || question.type === 'context' || question.type === 'inference') {
            return (
                <div className="space-y-3 mt-6">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => onAnswer(option)}
                            className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-colors"
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
            );
        }

        if (question.type === 'multiple_choice') {
            // Note: Simplification for now, treats it similarly to single choice to advance flow
            // Real implementation would gather array of answers and have a "Submit" button
            return (
                <div className="space-y-3 mt-6">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => onAnswer(option)} // Just proceeding on click for MVP flow
                            className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-colors"
                        >
                            {option.text}
                        </button>
                    ))}
                    <p className="text-sm text-gray-400 text-center mt-2">(Select one to continue for this demo)</p>
                </div>
            );
        }

        if (question.type === 'recognition_visual') {
            return (
                <div className="space-y-6 mt-6">
                    <div className="w-full max-w-sm mx-auto h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <span className="text-gray-400">[Placeholder Image/GIF for "{question.mediaAlt}"]</span>
                    </div>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => onAnswer(option)}
                                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-colors"
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (question.type === 'camera_practice') {
            return (
                <div className="space-y-6 mt-6">
                    <div className="w-full max-w-md mx-auto aspect-video bg-gray-900 rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden">
                        <span className="text-gray-400 mb-2">📷 Camera Feed Placeholder</span>
                        <div className="absolute inset-0 border-4 border-brand-500 rounded-xl opacity-50"></div>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => onAnswer({ text: 'Completed Practice' })}
                            className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700"
                        >
                            I Did It!
                        </button>
                        <button
                            onClick={() => onAnswer({ text: 'Skipped Practice' })}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
                        >
                            Skip for Now
                        </button>
                    </div>
                </div>
            );
        }

        return <p className="text-red-500 my-4">Unsupported question type: {question.type}</p>;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="inline-block px-3 py-1 bg-brand-100 text-brand-800 text-xs font-bold uppercase rounded-full mb-4 tracking-wider">
                {question.category || 'Question'}
            </span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{question.question}</h3>
            {question.subtitle && <p className="text-gray-500">{question.subtitle}</p>}

            {renderOptions()}
        </div>
    );
};

export default QuestionRenderer;
