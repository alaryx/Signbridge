import React from 'react';
import { Award, ArrowRight } from 'lucide-react';

const AssessmentResult = ({ result, onContinue }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 py-12 text-center h-[70vh]">
            <div className="p-4 bg-teal-50 rounded-full">
                <Award size={64} className="text-teal-600" />
            </div>

            <div className="space-y-4 max-w-2xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                    Assessment Complete!
                </h2>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-600 mb-2">Based on your responses, we've assigned you to:</p>
                    <p className="text-2xl font-bold text-gray-900">{result?.level || 'Beginner'} Level</p>
                </div>

                <p className="text-gray-600">
                    We've customized your learning path to focus on what matters most to you.
                    Let's get started with your first lesson.
                </p>
            </div>

            <button
                onClick={onContinue}
                className="group flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-all hover:pr-6"
            >
                View Learning Dashboard
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
            </button>
        </div>
    );
};

export default AssessmentResult;
