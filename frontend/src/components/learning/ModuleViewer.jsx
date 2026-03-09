import React from 'react';
import { ArrowLeft, PlayCircle, ShieldAlert, CheckCircle } from 'lucide-react';

const ModuleViewer = ({ moduleData, completedLessonIds = [], onBack, onStartLesson, onStartQuiz }) => {
    if (!moduleData) return null;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Navigation */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 hover:text-brand-600 font-medium mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Course Dashboard
            </button>

            {/* Module Context */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                <div className="flex gap-3 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-brand-50 text-brand-700 rounded-full">
                        Module View
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-amber-50 text-amber-600 rounded-full">
                        +{moduleData.rewards?.xp || 0} XP
                    </span>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{moduleData.title}</h1>
                <p className="text-lg text-gray-500 max-w-2xl">{moduleData.description}</p>
            </div>

            {/* Lessons List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Lessons in this Module</h2>

                {moduleData.lessons?.map((lesson, index) => (
                    <div
                        key={lesson._id || lesson.id}
                        onClick={() => onStartLesson(lesson)}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-brand-300 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:bg-brand-100 transition-all shadow-sm">
                                <PlayCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-brand-700 transition-colors">
                                    {index + 1}. {lesson.title}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1 font-medium">
                                    <span>{lesson.type.replace('_', ' / ').toUpperCase()}</span>
                                    <span>•</span>
                                    <span>{lesson.duration || '3 min'}</span>
                                </p>
                            </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${completedLessonIds.includes(lesson._id || lesson.id)
                            ? 'bg-green-500 border-green-500 text-white shadow-sm scale-110'
                            : 'border-gray-200 bg-gray-50'
                            }`}>
                            {completedLessonIds.includes(lesson._id || lesson.id) && <CheckCircle size={18} strokeWidth={3} />}
                        </div>
                    </div>
                ))}
            </div>

            {/* Assessment / Quiz Block */}
            {moduleData.quiz && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Module Assessment</h2>

                    <div
                        onClick={() => onStartQuiz(moduleData.quiz)}
                        className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-200 transition-all">
                                <ShieldAlert size={28} />
                            </div>
                            <div>
                                <h3 className="font-bold text-indigo-900 text-lg">{moduleData.quiz.title}</h3>
                                <p className="text-sm text-indigo-700/70 mt-1">
                                    Passing Score: {moduleData.quiz.passingScore}%
                                </p>
                            </div>
                        </div>
                        <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-sm group-hover:bg-indigo-700 transition-colors">
                            Start Quiz
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModuleViewer;
