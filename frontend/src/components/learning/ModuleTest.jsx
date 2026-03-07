import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, ArrowRight, Video, FileText, Camera } from 'lucide-react';
import CameraPanel from '../translation/CameraPanel'; // Reusing the translation camera component

export default function ModuleTest({ module, onPass, onFail, onCancel }) {
    const { quiz } = module;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [isActionValidating, setIsActionValidating] = useState(false);

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-12">
                <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-3xl shadow-sm border border-gray-100 min-h-[50vh] max-w-lg w-full text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Test Available</h3>
                    <p className="text-gray-500 mb-6">This module doesn't have an active test yet.</p>
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-md"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    const handleSelectOption = (optionId) => {
        setAnswers({
            ...answers,
            [currentQuestion.id]: optionId
        });
    };

    const handleActionValidation = () => {
        // Mock validation for the "Action" question type (acting as if OpenCV verified it)
        setIsActionValidating(true);
        setTimeout(() => {
            setIsActionValidating(false);
            setAnswers({
                ...answers,
                [currentQuestion.id]: 'passed' // Mock passed state
            });
        }, 3000); // Simulate processing time
    };

    const handleNext = () => {
        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            calculateScore();
        }
    };

    const calculateScore = () => {
        let correctAnswers = 0;
        quiz.questions.forEach(q => {
            if (q.type === 'action') {
                if (answers[q.id] === 'passed') correctAnswers++;
            } else {
                const selectedOption = q.options.find(opt => opt.id === answers[q.id]);
                if (selectedOption && selectedOption.isCorrect) {
                    correctAnswers++;
                }
            }
        });

        const scorePercent = (correctAnswers / quiz.questions.length) * 100;

        setShowResult(true);
        // Slightly delay the callback so they can see the final screen flash if you want, or just render the result screen here.
        // For this implementation, we will render a result screen and let the user click "Continue".
    };

    const handleResultContinue = () => {
        let correctAnswers = 0;
        quiz.questions.forEach(q => {
            if (q.type === 'action') {
                if (answers[q.id] === 'passed') correctAnswers++;
            } else {
                const selectedOption = q.options.find(opt => opt.id === answers[q.id]);
                if (selectedOption && selectedOption.isCorrect) correctAnswers++;
            }
        });
        const scorePercent = (correctAnswers / quiz.questions.length) * 100;

        if (scorePercent >= quiz.passingScore) {
            onPass(quiz.id, scorePercent);
        } else {
            onFail(quiz.id, scorePercent);
        }
    };


    const progressWidth = `${((currentQuestionIndex) / quiz.questions.length) * 100}%`;
    const hasAnsweredCurrent = !!answers[currentQuestion.id];


    // --- RENDERS ---

    const renderVideoToText = () => (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-full bg-black aspect-video rounded-2xl overflow-hidden shadow-md flex items-center justify-center relative">
                <video
                    src={currentQuestion.videoUrl}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    muted
                    loop
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {currentQuestion.options.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`p-4 rounded-xl border-2 text-lg font-bold transition-all ${answers[currentQuestion.id] === opt.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50 text-gray-700'
                            }`}
                    >
                        {opt.text}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderTextToVideo = () => (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-gray-900 text-center">"{currentQuestion.questionText}"</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {currentQuestion.options.map(opt => (
                    <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`relative rounded-2xl border-4 overflow-hidden cursor-pointer transition-all ${answers[currentQuestion.id] === opt.id
                            ? 'border-indigo-600 shadow-lg shadow-indigo-600/20'
                            : 'border-transparent shadow-md hover:border-indigo-300'
                            }`}
                    >
                        <video
                            src={opt.videoUrl}
                            className="w-full aspect-square object-cover bg-black"
                            muted
                            loop
                            onMouseEnter={e => e.target.play()}
                            onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
                        />
                        {answers[currentQuestion.id] === opt.id && (
                            <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1 shadow-sm">
                                <CheckCircle size={20} />
                            </div>
                        )}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                            Hover to play
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAction = () => (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <Camera className="text-indigo-600" />
                    {currentQuestion.questionText}
                </h2>
                <p className="text-gray-500">Sign the word to the camera clearly.</p>
            </div>

            <div className="w-full max-w-2xl bg-black aspect-video rounded-3xl overflow-hidden shadow-2xl relative border-4 border-gray-900 border-opacity-10">
                {/* Reusing Camera Panel from translation, hardcoded active for test */}
                <CameraPanel isActive={true} onToggle={() => { }} />

                {/* Mock Validation Overlay */}
                {isActionValidating && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-50">
                        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-bold text-lg">Validating your sign...</p>
                        <p className="text-indigo-200 text-sm">Please hold the pose.</p>
                    </div>
                )}

                {answers[currentQuestion.id] === 'passed' && (
                    <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex flex-col items-center justify-center text-white z-50">
                        <CheckCircle size={64} className="text-green-400 mb-4" />
                        <p className="font-bold text-2xl text-white drop-shadow-md">Great Job!</p>
                    </div>
                )}
            </div>

            {!answers[currentQuestion.id] && !isActionValidating && (
                <button
                    onClick={handleActionValidation}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition duration-200 hover:-translate-y-1 active:translate-y-0"
                >
                    Verify Sign
                </button>
            )}
        </div>
    );


    // --- MAIN RENDER ---
    if (showResult) {
        let correctAnswers = 0;
        quiz.questions.forEach(q => {
            if (q.type === 'action') {
                if (answers[q.id] === 'passed') correctAnswers++;
            } else {
                const selectedOption = q.options.find(opt => opt.id === answers[q.id]);
                if (selectedOption && selectedOption.isCorrect) correctAnswers++;
            }
        });
        const scorePercent = (correctAnswers / quiz.questions.length) * 100;
        const passed = scorePercent >= quiz.passingScore;

        return (
            <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100 flex flex-col items-center animate-in zoom-in-95">
                    {passed ? (
                        <>
                            <div className="w-24 h-24 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-6 relative">
                                <CheckCircle size={48} />
                                {/* Confetti dots pseudo logic can go here in css */}
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Module Passed!</h2>
                            <p className="text-gray-500 mb-6">You scored {Math.round(scorePercent)}% and unlocked the next module.</p>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-red-100 text-red-600 flex items-center justify-center rounded-full mb-6">
                                <XCircle size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Keep Trying!</h2>
                            <p className="text-gray-500 mb-6">You scored {Math.round(scorePercent)}%, but you need {quiz.passingScore}% to pass. Revise the lessons and try again.</p>
                        </>
                    )}

                    <button
                        onClick={handleResultContinue}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-transform hover:-translate-y-1 active:translate-y-0 ${passed ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
                            }`}
                    >
                        {passed ? 'Continue Learning' : 'Revise Module'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col pt-16">
            {/* Header / Nav */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center px-4 sm:px-8 justify-between z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <span className="font-bold text-gray-700 tracking-wide">{quiz.title}</span>
                </div>

                {/* Progress Bar Container */}
                <div className="max-w-md w-full hidden sm:block mx-8">
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                        <div
                            className="bg-indigo-600 h-full transition-all duration-300 ease-out"
                            style={{ width: progressWidth }}
                        ></div>
                    </div>
                </div>

                <div className="font-bold text-indigo-600 tracking-widest hidden sm:block">
                    {currentQuestionIndex + 1} / {quiz.questions.length}
                </div>
            </div>

            {/* Test Content Area */}
            <div className="flex-1 overflow-y-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
                {currentQuestion.type === 'video_to_text' && renderVideoToText()}
                {currentQuestion.type === 'text_to_video' && renderTextToVideo()}
                {currentQuestion.type === 'action' && renderAction()}
            </div>

            {/* Footer Bar */}
            <div className="bg-white border-t border-gray-100 p-4 sm:px-8 sm:py-6 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                <div className="text-gray-400 font-medium text-sm hidden sm:block">
                    Complete all questions to finish the module test.
                </div>
                <button
                    onClick={handleNext}
                    disabled={!hasAnsweredCurrent}
                    className={`ml-auto px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all duration-200 ${hasAnsweredCurrent
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 hover:-translate-y-1'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isLastQuestion ? 'Submit Test' : 'Next Question'}
                    {!isLastQuestion && <ArrowRight size={20} />}
                </button>
            </div>
        </div>
    );
}
