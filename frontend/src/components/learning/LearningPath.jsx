import React from 'react';
import { Play, Check, Lock } from 'lucide-react';

const LevelNode = ({ lesson, index, status, onClick }) => {
    // Generate a curved path offset using Math.sin
    // This gives the Duolingo style snake path look
    const isLeft = index % 2 === 0;
    const offset = Math.sin(index * 0.5) * 60; // Max offset pixels

    const getStatusStyles = () => {
        switch (status) {
            case 'completed':
                return {
                    bg: 'bg-green-500 hover:bg-green-600',
                    border: 'border-green-600',
                    text: 'text-white',
                    shadow: 'shadow-[0_4px_0_rgb(22,163,74)]',
                    icon: <Check className="w-6 h-6" strokeWidth={3} />
                };
            case 'active':
                return {
                    bg: 'bg-teal-500',
                    border: 'border-teal-600',
                    text: 'text-white',
                    shadow: 'shadow-[0_4px_0_rgb(13,148,136)] ring-4 ring-teal-200',
                    icon: <Play className="w-6 h-6 ml-1 fill-white" />
                };
            case 'locked':
            default:
                return {
                    bg: 'bg-gray-200',
                    border: 'border-gray-300',
                    text: 'text-gray-400',
                    shadow: 'shadow-[0_4px_0_rgb(209,213,219)]',
                    icon: <Lock className="w-5 h-5" />
                };
        }
    };

    const styles = getStatusStyles();

    return (
        <div
            className="relative flex flex-col items-center justify-center my-6 group"
            style={{
                transform: `translateX(${offset}px)`
            }}
        >
            {/* Title bubble tooltip (hover) */}
            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-3 py-1.5 rounded-lg shadow-md border border-gray-100 z-10 font-bold text-sm text-gray-700 pointer-events-none">
                {lesson.title}
                {/* Tooltip caret */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45"></div>
            </div>

            {/* The circular node */}
            <button
                onClick={() => status !== 'locked' && onClick(lesson)}
                className={`
                    w-16 h-16 rounded-full flex items-center justify-center 
                    border-2 transition-all duration-200 relative
                    ${styles.bg} ${styles.border} ${styles.text} ${styles.shadow}
                    ${status !== 'locked' ? 'hover:-translate-y-1 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none' : 'cursor-not-allowed opacity-80'}
                `}
            >
                {styles.icon}
            </button>
        </div>
    );
};

const LearningPath = ({ curriculum, userProgress, onLessonSelect }) => {
    // Flatten the curriculum into a distinct linear path of lessons across modules
    // In a real Duolingo app, chapters group lessons together.

    if (!curriculum || curriculum.length === 0) return <div className="p-8 text-center text-gray-500 font-bold">No courses available yet!</div>;

    const completedIds = userProgress?.completedLessons || [];
    let isFirstLockedFound = false;

    return (
        <div className="max-w-xl mx-auto py-12 px-4 flex flex-col items-center">

            {curriculum.map((course, cIdx) => (
                <div key={course._id} className="w-full flex flex-col items-center mb-16">
                    {/* Course Header Banner */}
                    <div className="w-full bg-teal-500 text-white rounded-2xl p-6 mb-12 relative overflow-hidden shadow-sm">
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black capitalize tracking-tight">{course.title}</h2>
                                <p className="text-teal-100 font-medium opacity-90">{course.description || 'Master the basics'}</p>
                            </div>
                            <div className="text-teal-700 bg-teal-400/30 px-3 py-1.5 rounded-lg font-black tracking-widest text-sm uppercase">
                                Unit {cIdx + 1}
                            </div>
                        </div>
                        {/* Background decoration */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* Modules & Lessons */}
                    {course.modules.map((mod, mIdx) => (
                        <div key={mod._id} className="w-full flex flex-col items-center relative">

                            {/* Module Name floating marker */}
                            <div className="bg-white px-4 py-2 rounded-full border-2 border-gray-200 font-bold text-gray-600 text-sm mb-6 z-10 shadow-sm">
                                {mod.title}
                            </div>

                            {/* SVG Connecting Path - Drawn absolutely behind nodes */}
                            <div className="absolute top-8 bottom-0 w-1 bg-gray-200 -z-10 rounded-full"></div>

                            {/* Individual Lesson Nodes */}
                            <div className="flex flex-col items-center w-full pb-8">
                                {mod.lessons.map((lesson, lIdx) => {

                                    // Determine Status
                                    let status = 'locked';
                                    const isCompleted = completedIds.includes(lesson._id);

                                    if (isCompleted) {
                                        status = 'completed';
                                    } else if (!isFirstLockedFound) {
                                        // The very first uncompleted lesson is the 'active' one
                                        status = 'active';
                                        isFirstLockedFound = true;
                                    }

                                    return (
                                        <LevelNode
                                            key={lesson._id}
                                            lesson={lesson}
                                            index={lIdx}
                                            status={status}
                                            onClick={onLessonSelect}
                                        />
                                    );
                                })}
                            </div>

                        </div>
                    ))}

                    {/* Section End Divider */}
                    <div className="w-16 h-1 bg-gray-200 rounded-full mt-8"></div>
                </div>
            ))}
        </div>
    );
};

export default LearningPath;
