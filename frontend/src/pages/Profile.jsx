import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Trophy, Star, BookOpen, Clock, Activity, Settings, Calendar, AlertTriangle } from 'lucide-react';

const Profile = () => {
    const { user, updateUser } = useAuth();

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-medium">Please log in to view your profile.</p>
            </div>
        );
    }

    const xp = user.xp || 0;
    const streak = user.streak || 0;
    const completedLessons = user.completedLessons?.length || 0;
    const translations = user.translations || [];
    const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

    const handleResetProgress = () => {
        if (window.confirm("Are you sure you want to reset your learning progress? This will reset your XP, level, and completed lessons. This action cannot be undone.")) {
            updateUser({
                xp: 0,
                streak: 0,
                completedLessons: [],
                level: 'Level 1',
                assessmentCompleted: false
            });
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Left Column: User Card */}
                <div className="w-full md:w-1/3">
                    {/* NO overflow-hidden — allows avatar to straddle the banner edge */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 sticky top-24">

                        {/* Banner */}
                        <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-28 rounded-t-3xl relative">
                            {user.role === 'admin' && (
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-white/20">
                                    <Settings size={14} /> Admin
                                </div>
                            )}
                        </div>

                        {/* Avatar + Info */}
                        <div className="px-6 pb-8 text-center">
                            {/* -mt-12 pulls avatar up so half sits above the banner bottom */}
                            <div className="flex justify-center -mt-12 mb-4">
                                <div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg ring-4 ring-white">
                                    <div className="w-full h-full bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                                        <User size={40} />
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
                            <div className="flex items-center justify-center gap-2 text-gray-500 mt-1">
                                <Mail size={16} />
                                <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-gray-500 mt-2 text-sm">
                                <Calendar size={16} />
                                <span>Joined {joinedDate}</span>
                            </div>

                            {/* Reset Progress */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button
                                    onClick={handleResetProgress}
                                    className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 py-3 px-4 rounded-xl font-bold transition-colors border border-red-100"
                                >
                                    <AlertTriangle size={18} />
                                    Reset Progress
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-3 px-2">
                                    Careful! This will clear your XP and reset you to the start.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats & History */}
                <div className="w-full md:w-2/3 space-y-8">

                    {/* Stats Grid */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity className="text-brand-600" /> Learning Progress
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-brand-200 transition-colors">
                                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3 text-amber-500">
                                    <Trophy size={24} />
                                </div>
                                <span className="text-3xl font-black text-gray-900">{xp}</span>
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Total XP</span>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-orange-200 transition-colors">
                                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-3 text-orange-500">
                                    <Star size={24} />
                                </div>
                                <span className="text-3xl font-black text-gray-900">{streak}</span>
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Day Streak</span>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-blue-200 transition-colors">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 text-blue-500">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-3xl font-black text-gray-900">{completedLessons}</span>
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Lessons Done</span>
                            </div>
                        </div>
                    </div>

                    {/* Translation History */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Clock className="text-brand-600" /> Recent Translations
                            </h2>
                        </div>

                        {translations.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                                <Clock className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <h3 className="text-sm font-medium text-gray-900">No translation history</h3>
                                <p className="mt-1 text-sm text-gray-500">Your recent text-to-sign translations will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {translations.slice().reverse().map((t, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-brand-400"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-900 font-medium truncate">{t.text}</p>
                                            <p className="text-sm text-gray-400 mt-1">{new Date(t.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;