import React, { useState } from 'react';
import { BookOpen, Trophy, Star, Lock, CheckCircle, PlayCircle, ShieldAlert } from 'lucide-react';
import AssessmentStart from '../components/learning/AssessmentStart';
import AssessmentFlow from '../components/learning/AssessmentFlow';
import AssessmentResult from '../components/learning/AssessmentResult';
import LessonPlayer from '../components/learning/LessonPlayer';
import LearningPath from '../components/learning/LearningPath';
import DailyGoalHeader from '../components/learning/DailyGoalHeader';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { coursePaths as mockCourses } from '../api/mockCourses';

const LearnISL = () => {
    // States: 'pending', 'started', 'result', 'completed'
    // Defaulting to pending for onboarding
    const [assessmentState, setAssessmentState] = useState('pending');
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const { isAuthenticated, loading, user } = useAuth();
    const navigate = useNavigate();

    // Store assigned level ('Level 1' by default)
    const [userProfile, setUserProfile] = useState({
        level: 'Level 1', // We can match this to Course title
        xp: 0,
        streak: 0,
        name: user?.name || 'Student',
        completedLessonIds: []
    });

    // Live Curriculum State
    const [courses, setCourses] = useState([]);
    const [loadingCurriculum, setLoadingCurriculum] = useState(true);

    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/auth');
        } else if (isAuthenticated) {
            fetchCurriculum();
        }
    }, [isAuthenticated, loading, navigate]);

    const fetchCurriculum = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/learning/curriculum');
            const data = await res.json();
            if (data.status === 'success' && data.data.length > 0) {
                setCourses(data.data);
            } else {
                loadMockFallback();
            }
        } catch (error) {
            console.error('Error fetching live curriculum, falling back to mock data:', error);
            loadMockFallback();
        } finally {
            setLoadingCurriculum(false);
        }
    };

    const loadMockFallback = () => {
        const mockArray = Object.values(mockCourses).map((course, index) => ({
            _id: `mock-course-${index}`,
            title: `Level ${index + 1}`,
            description: course.description,
            modules: course.modules
        }));
        setCourses(mockArray);
    };


    const handleStartAssessment = () => {
        setAssessmentState('started');
    };

    const handleCompleteAssessment = () => {
        // Always assign Level 1 after the new simplified assessment
        setUserProfile(prev => ({ ...prev, level: 'Level 1' }));
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

    const handleLessonComplete = (lessonId) => {
        if (!userProfile.completedLessonIds.includes(lessonId)) {
            setUserProfile(prev => ({
                ...prev,
                xp: prev.xp + 50,
                completedLessonIds: [...prev.completedLessonIds, lessonId]
            }));
        }
        setSelectedLesson(null);
    };

    if (loading || (!loading && !isAuthenticated) || loadingCurriculum) {
        return <div className="min-h-[70vh] flex items-center justify-center">Loading Curriculum...</div>;
    }

    if (assessmentState === 'pending') {
        return <AssessmentStart onStart={handleStartAssessment} />;
    }

    if (assessmentState === 'started') {
        return <AssessmentFlow onComplete={handleCompleteAssessment} />;
    }

    if (assessmentState === 'result') {
        return <AssessmentResult result={userProfile} onContinue={handleContinueToDashboard} />;
    }

    // --- LESSON PLAYER ---
    if (selectedLesson) {
        return (
            <LessonPlayer
                lesson={selectedLesson}
                onBack={() => setSelectedLesson(null)}
                onComplete={handleLessonComplete}
            />
        );
    }

    // --- DASHBOARD VIEW (State: completed) ---
    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            <DailyGoalHeader userProgress={userProfile} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Header section */}
                <div className="mb-4 animate-in fade-in slide-in-from-top-4 text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center sm:justify-start gap-3">
                        <BookOpen className="text-teal-600" /> Welcome, {userProfile.name}!
                    </h1>
                    <p className="text-gray-500 mt-2">Continue your learning journey.</p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 mt-8">
                        <ShieldAlert size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">Curriculum in Development</h3>
                        <p className="text-gray-500">The curriculum is currently being built. Check back soon!</p>
                    </div>
                ) : (
                    <LearningPath
                        curriculum={courses}
                        userProgress={userProfile}
                        onLessonSelect={(lesson) => setSelectedLesson(lesson)}
                    />
                )}
            </div>
        </div>
    );
};

export default LearnISL;
