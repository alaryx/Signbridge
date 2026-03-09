import React from 'react';
import { Play, Check, Lock, Trophy } from 'lucide-react';

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
                    bg: 'bg-brand-500',
                    border: 'border-brand-600',
                    text: 'text-white',
                    shadow: 'shadow-[0_4px_0_rgb(13,148,136)] ring-4 ring-brand-200',
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
            className="relative flex flex-col items-center justify-center my-6 group z-10"
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

const LearningPath = ({ curriculum, userProgress, onLessonSelect, onTestSelect }) => {
    // Flatten the curriculum into a distinct linear path of lessons across modules
    // In a real Duolingo app, chapters group lessons together.

    if (!curriculum || curriculum.length === 0) return <div className="p-8 text-center text-gray-500 font-bold">No courses available yet!</div>;

    const completedIds = userProgress?.completedLessons || [];
    let isFirstLockedFound = false;

    // We calculate a fixed distance between nodes to draw the SVG correctly.
    // The nodes have margin-y of 6 (which is 24px top and bottom, plus 64px height)
    // Roughly 112px per node
    const nodeSpacing = 112;

    // Function to generate SVG Path logic for the curved snake line
    const generatePathData = (nodeCount) => {
        let path = '';
        for (let i = 0; i < nodeCount; i++) {
            const startY = i * nodeSpacing;
            const endY = (i + 1) * nodeSpacing;
            const startX = Math.sin(i * 0.5) * 60;
            const endX = Math.sin((i + 1) * 0.5) * 60;

            if (i === 0) {
                path += `M ${startX + 100} 0 `; // 100 is the center offset for viewBox 200
            }

            // Draw a bezier curve connecting this node to the next
            path += `C ${startX + 100} ${startY + 50}, ${endX + 100} ${endY - 50}, ${endX + 100} ${endY} `;
        }
        return path;
    };

    return (
        <div className="max-w-xl mx-auto py-12 px-4 flex flex-col items-center">

            {curriculum.map((course, cIdx) => (
                <div key={course._id} className="w-full flex flex-col items-center mb-16">
                    {/* Course Header Banner */}
                    <div className="w-full bg-brand-500 text-white rounded-2xl p-6 mb-12 relative overflow-hidden shadow-sm">
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black capitalize tracking-tight">{course.title}</h2>
                                <p className="text-brand-100 font-medium opacity-90">{course.description || 'Master the basics'}</p>
                            </div>
                            <div className="text-brand-700 bg-brand-400/30 px-3 py-1.5 rounded-lg font-black tracking-widest text-sm uppercase">
                                Unit {cIdx + 1}
                            </div>
                        </div>
                        {/* Background decoration */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* Modules & Lessons */}
                    {course.modules.map((mod, mIdx) => {
                        const hasTest = !!mod.quiz;
                        const lessonCount = mod.lessons.length;
                        // Determine how many nodes we have total in this module block
                        const totalNodes = hasTest ? lessonCount + 1 : lessonCount;
                        const pathSegments = totalNodes - 1; // Connectors are N-1

                        const svgHeight = pathSegments * nodeSpacing;
                        const pathData = generatePathData(pathSegments);

                        // Determine how many lessons in THIS module are completed
                        let moduleCompletedCount = 0;
                        let hasActive = false;

                        mod.lessons.forEach((l) => {
                            if (completedIds.includes(l._id)) {
                                moduleCompletedCount++;
                            } else if (!isFirstLockedFound) {
                                hasActive = true;
                            }
                        });

                        // For the Test Slab:
                        // Module is "finished" if all lessons are complete
                        const allLessonsComplete = moduleCompletedCount === lessonCount;

                        // If all lessons are complete, but no test has been taken? We treat the test slab as active/completed.
                        // We'll increment the completed node count conceptually to render the colored path down to the test slab.
                        let nodesToConnectColored = moduleCompletedCount;

                        if (allLessonsComplete && hasTest) {
                            nodesToConnectColored = lessonCount; // Color the path all the way from the last lesson down to the test slab
                        } else if (!hasActive && moduleCompletedCount > 0) {
                            nodesToConnectColored = moduleCompletedCount - 1;
                        }

                        // Calculate active path length
                        let activePathData = '';
                        if (nodesToConnectColored > 0) {
                            activePathData = generatePathData(nodesToConnectColored);
                        }

                        return (
                            <div key={mod._id} className="w-full flex flex-col items-center relative mb-8">

                                {/* Module Name floating marker */}
                                <div className="bg-white px-4 py-2 rounded-full border-2 border-gray-200 font-bold text-gray-600 text-sm mb-6 z-10 shadow-sm">
                                    {mod.title}
                                </div>

                                {/* SVG Connecting Path container */}
                                <div className="relative flex flex-col items-center w-full pb-8">

                                    {/* SVG Overlay */}
                                    {lessonCount > 1 && (
                                        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-0 pointer-events-none" style={{ height: svgHeight, width: '200px' }}>
                                            <svg width="200" height={svgHeight} viewBox={`0 0 200 ${svgHeight}`} className="drop-shadow-sm overflow-visible">
                                                {/* Inactive grey path */}
                                                <path
                                                    d={pathData}
                                                    fill="none"
                                                    stroke="#E5E7EB"
                                                    strokeWidth="12"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                {/* Active colored path */}
                                                {activePathData && (
                                                    <path
                                                        d={activePathData}
                                                        fill="none"
                                                        stroke="#14B8A6"
                                                        strokeWidth="12"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="drop-shadow-[0_2px_8px_rgba(20,184,166,0.3)]"
                                                    />
                                                )}
                                            </svg>
                                        </div>
                                    )}
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

                                    {/* Test Slab appended dynamically */}
                                    {hasTest && (
                                        <div
                                            className="relative flex flex-col items-center justify-center my-6 group z-10"
                                            style={{
                                                transform: `translateX(${Math.sin(lessonCount * 0.5) * 60}px)`
                                            }}
                                        >
                                            <button
                                                onClick={() => allLessonsComplete && onTestSelect && onTestSelect(mod)}
                                                className={`
                                                    min-w-[200px] px-8 py-4 rounded-3xl flex items-center justify-center gap-3 font-black text-lg
                                                    border-b-[6px] transition-all duration-200 relative
                                                    ${allLessonsComplete
                                                        ? 'bg-indigo-600 border-indigo-800 text-white hover:-translate-y-1 hover:border-b-[8px] active:translate-y-2 active:border-b-0 shadow-lg shadow-indigo-600/30'
                                                        : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed border-b-4'
                                                    }
                                                `}
                                            >
                                                <Trophy size={24} className={allLessonsComplete ? "fill-white" : ""} />
                                                <span>Test Module</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        );
                    })}

                    {/* Section End Divider */}
                    <div className="w-16 h-1 bg-gray-200 rounded-full mt-8"></div>
                </div>
            ))}
        </div>
    );
};

export default LearningPath;
