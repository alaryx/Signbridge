import React from 'react';

const AssessmentStart = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center h-[70vh]">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                ISL Learning Onboarding
            </h2>
            <p className="max-w-xl text-gray-600 text-lg">
                Before we show you the lessons, let's figure out the best starting point for you. We will ask a few questions to determine your level and personalize your experience.
            </p>
            <button
                onClick={onStart}
                className="mt-8 px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-colors shadow-lg hover:shadow-xl"
            >
                Start Learning Indian Sign Language
            </button>
        </div>
    );
};

export default AssessmentStart;
