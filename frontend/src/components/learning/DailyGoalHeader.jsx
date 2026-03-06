import React from 'react';
import { Flame, Star, Target } from 'lucide-react';

const DailyGoalHeader = ({ userProgress }) => {
    if (!userProgress) return null;

    const { xp = 0, streak = 0, dailyProgress = 0, dailyGoal = 10 } = userProgress;
    const progressPercentage = Math.min((dailyProgress / dailyGoal) * 100, 100);

    return (
        <div className="bg-white sticky top-16 z-30 shadow-sm border-b border-gray-100 px-4 py-3">
            <div className="max-w-4xl mx-auto flex items-center justify-between">

                {/* Course Indicator */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-600 font-bold text-sm">ISL</span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-6">
                    {/* Streak 🔥 */}
                    <div className="flex items-center gap-1.5 font-bold">
                        <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} />
                        <span className={streak > 0 ? 'text-orange-500' : 'text-gray-400'}>
                            {streak}
                        </span>
                    </div>

                    {/* Total XP ⭐️ */}
                    <div className="flex items-center gap-1.5 font-bold">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="text-amber-500">{xp}</span>
                    </div>

                    {/* Daily Goal 🎯 */}
                    <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-purple-500" />
                        <div className="hidden sm:flex flex-col w-32">
                            <div className="flex justify-between text-xs font-bold font-mono text-gray-500 mb-1">
                                <span>Daily Goal</span>
                                <span>{dailyProgress} / {dailyGoal}</span>
                            </div>
                            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-500 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DailyGoalHeader;
