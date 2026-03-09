import React from 'react';

const AssessmentProgressBar = ({ currentStep, totalSteps }) => {
    // Ensuring percentage doesn't exceed 100%
    const progress = Math.min(Math.round(((currentStep - 1) / totalSteps) * 100), 100);

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Assessment Progress</span>
                <span className="text-sm font-bold text-brand-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                    className="bg-brand-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default AssessmentProgressBar;
