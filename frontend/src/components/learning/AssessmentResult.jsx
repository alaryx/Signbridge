import React from 'react';
import { Award, ArrowRight } from 'lucide-react';

const AssessmentResult = ({ result, onContinue }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 py-12 text-center h-[70vh]">
            <div className="p-4 bg-brand-50 rounded-full">
                <Award size={64} className="text-brand-600" />
            </div>

            <div className="space-y-4 max-w-2xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                    Assessment Complete!
                </h2>

                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-brand-500/10 border border-gray-100 max-w-lg mx-auto transform transition-all hover:scale-[1.02]">
                    <p className="text-lg text-gray-500 leading-relaxed font-semibold uppercase tracking-wider mb-2">
                        Your Recommended Start:
                    </p>
                    <div className="text-3xl font-black text-brand-600 leading-tight">
                        {result.level}
                    </div>
                </div>
            </div>

            <button
                onClick={onContinue}
                className="group flex items-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-all hover:pr-6"
            >
                View Learning Dashboard
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
            </button>
        </div>
    );
};

export default AssessmentResult;
