import React, { useState } from 'react';
import { BookOpen, Trophy, Star, Lock, CheckCircle, PlayCircle, ShieldAlert } from 'lucide-react';
import AssessmentStart from '../components/learning/AssessmentStart';
import AssessmentFlow from '../components/learning/AssessmentFlow';
import AssessmentResult from '../components/learning/AssessmentResult';
import ModuleViewer from '../components/learning/ModuleViewer';
import { coursePaths } from '../api/mockCourses';

const LearnISL = () => {
    // States: 'pending', 'started', 'result', 'completed'
    // Defaulting to pending for onboarding
    const [assessmentState, setAssessmentState] = useState('pending');
    const [selectedModule, setSelectedModule] = useState(null);

    // Store assigned level ('Absolute Beginner' by default for testing if skipped)
    const [userProfile, setUserProfile] = useState({
        level: 'Absolute Beginner',
        xp: 120,
        streak: 3
    });

    const handleStartAssessment = () => {
        setAssessmentState('started');
    };

    const handleCompleteAssessment = (resultData) => {
        setUserProfile(prev => ({ ...prev, level: resultData.level || 'Beginner' }));
        setAssessmentState('result');
    };

    const handleContinueToDashboard = () => {
        setAssessmentState('completed');
    };

    const handleModuleClick = (moduleItem) => {
        if (moduleItem.status !== 'locked') {
            setSelectedModule(moduleItem);
        }
    };

    const handleBackToDashboard = () => {
        setSelectedModule(null);
    };

    if (assessmentState === 'pending') {
        return <AssessmentStart onStart={handleStartAssessment} />;
    }

    if (assessmentState === 'started') {
        return <AssessmentFlow onComplete={handleCompleteAssessment} />;
    }

    if (assessmentState === 'result') {
        return <AssessmentResult result={userProfile} onContinue={handleContinueToDashboard} />;
    }

    // --- MODULE VIEWER ---
    if (selectedModule) {
        return (
            <ModuleViewer
                moduleData={selectedModule}
                onBack={handleBackToDashboard}
                onStartLesson={(l) => alert(`Starting lesson: ${l.title} (Player UI in dev)`)}
                onStartQuiz={(q) => alert(`Starting quiz: ${q.title} (Quiz UI in dev)`)}
            />
        );
    }

    // --- DASHBOARD VIEW (State: completed) ---

    // Get the course curriculum for the user's level. Fallback to Absolute Beginner.
    const currentCourse = coursePaths[userProfile.level] || coursePaths["Absolute Beginner"];
    const modules = currentCourse.modules || [];

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-24">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-in fade-in slide-in-from-top-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <BookOpen className="text-teal-600" /> Learn ISL
                    </h1>
                    <p className="text-gray-500 mt-2">Your personalized path: <span className="font-bold text-teal-700">{currentCourse.levelName}</span></p>
                    <p className="text-sm text-gray-400 mt-1 max-w-xl">{currentCourse.description}</p>
                </div>

                {/* Gamification Stats */}
                <div className="flex gap-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                        <Trophy size={20} className="text-amber-500" />
                        <span className="font-bold text-amber-700">{userProfile.xp} XP</span>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                        <Star size={20} className="text-orange-500 fill-orange-500" />
                        <span className="font-bold text-orange-700">{userProfile.streak} Day Streak</span>
                    </div>
                </div>
            </div>

            {modules.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                    <ShieldAlert size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">Curriculum in Development</h3>
                    <p className="text-gray-500">The curriculum for "{userProfile.level}" is currently being built. Check back soon!</p>
                </div>
            ) : (
                /* Dynamic Lesson Path */
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent animate-in zoom-in-95 duration-500">
                    {modules.map((moduleItem, index) => (
                        <div
                            key={moduleItem.id}
                            onClick={() => handleModuleClick(moduleItem)}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                        >

                            {/* Timeline dot */}
                            <div className={`flex items-center justify-center w-20 h-20 rounded-full border-4 shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform cursor-pointer
                  ${moduleItem.status === 'completed' ? 'bg-teal-500 border-teal-200 hover:scale-105' :
                                    moduleItem.status === 'in-progress' ? 'bg-sky-500 border-sky-200 ring-4 ring-sky-500/20 hover:scale-105' :
                                        'bg-gray-100 border-gray-200'}`}
                            >
                                {moduleItem.status === 'completed' && <CheckCircle className="text-white w-8 h-8" />}
                                {moduleItem.status === 'in-progress' && <PlayCircle className="text-white w-8 h-8 fill-sky-600" />}
                                {moduleItem.status === 'locked' && <Lock className="text-gray-400 w-8 h-8" />}
                            </div>

                            {/* Module Card */}
                            <div className={`w-[calc(100%-6rem)] md:w-[calc(50%-4rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all
                                ${moduleItem.status !== 'locked' ? 'hover:shadow-md cursor-pointer group-hover:-translate-y-1 hover:border-teal-200' : 'opacity-75'}
                            `}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded
                      ${moduleItem.status === 'locked' ? 'bg-gray-100 text-gray-500' : 'bg-teal-100 text-teal-700'}`}
                                    >
                                        Module {index + 1}
                                    </span>
                                    <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
                                        <Trophy size={14} /> +{moduleItem.rewards?.xp || 0} XP
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{moduleItem.title}</h3>
                                <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden text-ellipsis line-clamp-2">
                                    {moduleItem.status === 'locked' ? 'Complete previous modules to unlock this content.' : moduleItem.description}
                                </p>

                                {moduleItem.status !== 'locked' && (
                                    <div className="flex gap-2 text-xs font-semibold text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <span>📚 {moduleItem.lessons?.length || 0} Lessons</span>
                                        <span>•</span>
                                        <span>📝 1 Checkpoint</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Final Test Block */}
                    <div
                        onClick={() => alert("Final Test Player coming soon...")}
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mt-12 cursor-pointer"
                    >
                        <div className="flex items-center justify-center w-24 h-24 rounded-full border-4 shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 bg-gradient-to-br from-amber-400 to-orange-500 border-yellow-200 transition-transform group-hover:scale-105 group-hover:shadow-orange-500/30">
                            <Trophy className="text-white w-10 h-10" />
                        </div>
                        <div className="w-[calc(100%-6rem)] md:w-[calc(50%-4rem)] bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 transition-transform group-hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                    Promotion Match
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{currentCourse.finalTest?.title || "Level Final Test"}</h3>
                            <p className="text-sm text-gray-300 line-clamp-2">Pass this comprehensive 10-question test to earn your promotion to the next skill level!</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearnISL;
