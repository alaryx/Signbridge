import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Trophy,
  Star,
  Lock,
  CheckCircle,
  PlayCircle,
  ShieldAlert,
} from "lucide-react";
import AssessmentStart from "../components/learning/AssessmentStart";
import AssessmentFlow from "../components/learning/AssessmentFlow";
import AssessmentResult from "../components/learning/AssessmentResult";
import LessonPlayer from "../components/learning/LessonPlayer";
import LearningPath from "../components/learning/LearningPath";
import DailyGoalHeader from "../components/learning/DailyGoalHeader";
import ModuleTest from "../components/learning/ModuleTest";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getNextPlacementStep, generateQuizFromLessons, LEVELS } from "../utils/placementLogic";

const API_URL = import.meta.env.VITE_API_URL;

const LearnISL = () => {
  const { isAuthenticated, loading, user, updateUser, refreshUser } = useAuth();
  const navigate = useNavigate();

  // States: 'pending', 'started', 'result', 'completed'
  const [assessmentState, setAssessmentState] = useState(
    user?.assessmentCompleted ? "completed" : "pending",
  );

  console.log("REACT RENDER PASS: assessmentState=", assessmentState);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedCoursePopup, setCompletedCoursePopup] = useState(null);
  const [activeTest, setActiveTest] = useState(null);
  const [placementRec, setPlacementRec] = useState(null); // beginner, intermediate, advanced
  const [placementTestCourse, setPlacementTestCourse] = useState(null);
  const [isPlacementMode, setIsPlacementMode] = useState(false);

  // Derive userProfile from the auth context user (server-sourced)
  const userProfile = {
    level: user?.level || "Level 1",
    xp: user?.xp || 0,
    streak: user?.streak || 0,
    name: user?.name || "Student",
    completedLessons: user?.completedLessons || [],
    dailyProgress: user?.dailyProgress || 0,
    dailyGoal: user?.dailyGoal || 10,
  };

  useEffect(() => {
    if (user?.assessmentCompleted && assessmentState === "pending") {
      setAssessmentState("completed");
    }
  }, [user]);

  // Live Curriculum State
  const [courses, setCourses] = useState([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    } else if (isAuthenticated) {
      fetchCurriculum();
    }
  }, [isAuthenticated, loading, navigate]);

  const fetchCurriculum = async () => {
    try {
      const res = await fetch(`${API_URL}/api/learning/curriculum`);
      const data = await res.json();
      if (data.status === "success" && data.data.length > 0) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error fetching curriculum:", error);
    } finally {
      setLoadingCurriculum(false);
    }
  };

  const handleStartAssessment = () => {
    setAssessmentState("started");
  };

  const handleCompleteAssessment = (result) => {
    setPlacementRec(result?.level || 'Daily Conversations (Beginner)');
    updateUser({ assessmentCompleted: true });
    setAssessmentState("result");
  };

  const executePlacementStep = (step) => {
    console.log("executePlacementStep TRACE:", step);
    if (step.finalPlacement) {
      console.log("Executing final placement...", step.finalPlacement);
      handleFinalPlacement(step.finalPlacement, step.lessonsToMarkCompleted);
    } else if (step.nextTestCourseTitle) {
      const nextCourse = courses.find(c => c.title === step.nextTestCourseTitle);
      console.log("Found Next Course for Test:", nextCourse?.title);
      if (nextCourse) {
        const generatedTest = generateQuizFromLessons(nextCourse);
        console.log("Generated test is truthy:", !!generatedTest, generatedTest?.title);
        setActiveTest(generatedTest);
        setPlacementTestCourse(nextCourse);
      } else {
        console.log("Fallback hitting Beginner because course not found");
        // Fallback if course not found
        handleFinalPlacement(LEVELS.BEGINNER, 0);
      }
    }
  };

  const handleContinueToDashboard = async () => {
    console.log("handleContinueToDashboard TRACE:");
    console.log(" - placementRec:", placementRec);
    console.log(" - courses:", courses.map(c => c.title));
    setIsPlacementMode(true);
    setAssessmentState("completed"); // Must exit 'result' state to show dashboard & overlays
    const step = getNextPlacementStep(placementRec, null, false);
    console.log(" - step:", step);
    await executePlacementStep(step);
  };

  const handleFinalPlacement = async (finalLevelTitle, numCoursesToComplete) => {
    const completedLessonIds = [];
    
    // Mark requested courses as complete protecting against duplicates
    for (let i = 0; i < Math.min(numCoursesToComplete, courses.length); i++) {
      const course = courses[i];
      if (course.lessons) {
        course.lessons.forEach(l => {
          if (!userProfile.completedLessons.includes(l._id)) {
            completedLessonIds.push(l._id);
          }
        });
      }
    }

    const updates = { 
      level: finalLevelTitle, 
      assessmentCompleted: true 
    };
    
    if (completedLessonIds.length > 0) {
      updates.completedLessons = [...userProfile.completedLessons, ...completedLessonIds];
    }

    updateUser(updates);
    setAssessmentState("completed");
    setIsPlacementMode(false);
    setActiveTest(null);

    // Persist finalized state to backend with retry logic
    const saveToBackend = async (retries = 1) => {
      try {
        const token = localStorage.getItem('signbridge_token');
        if (!token) {
          console.error("No token found. Cannot save placement.");
          return;
        }

        const backendLevel = finalLevelTitle === 'Daily Conversations (Advanced)' ? 'Daily Conversations (Advance)' : finalLevelTitle;

        const res = await fetch(`${API_URL}/api/learning/me/assessment-complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ finalCourseLevel: backendLevel, completedLessonIds })
        });
        
        if (!res.ok) throw new Error("API request failed");
      } catch (err) {
        if (retries > 0) {
          console.log(`Retrying save final placement. Retries left: ${retries}`);
          await saveToBackend(retries - 1);
        } else {
          console.error('Failed to save final placement after retries:', err);
        }
      }
    };
    
    await saveToBackend();
  };

  const handlePlacementTestPass = async (testId, score) => {
    const step = getNextPlacementStep(placementRec, placementTestCourse?.title, true);
    await executePlacementStep(step);
  };

  const handlePlacementTestFail = async (testId, score) => {
    const step = getNextPlacementStep(placementRec, placementTestCourse?.title, false);
    await executePlacementStep(step);
  };

  const handleLessonComplete = async (lessonId) => {
    if (!userProfile.completedLessons.includes(lessonId)) {
      // 1. Optimistically update UI
      const newCompletedLessons = [...userProfile.completedLessons, lessonId];
      const newXp = userProfile.xp + 50;
      updateUser({ xp: newXp, completedLessons: newCompletedLessons });

      // 2. Persist to backend
      try {
        const token = localStorage.getItem('signbridge_token');
        if (token) {
          const res = await fetch(`${API_URL}/api/learning/progress/lesson/${lessonId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ xpEarned: 50, accuracy: 100 }),
          });

          if (res.ok) {
            // Refresh user data from server to get authoritative state
            await refreshUser();
          }
        }
      } catch (err) {
        console.error('Failed to save lesson completion:', err);
      }

      // 3. Check if all lessons in a course are now completed
      for (const course of courses) {
        if (!course.lessons) continue;
        const lessonIndex = course.lessons.findIndex(
          (l) => l._id === lessonId || l.id === lessonId,
        );
        if (lessonIndex !== -1) {
          const allCompleted = course.lessons.every((l) =>
            newCompletedLessons.includes(l._id || l.id),
          );
          if (allCompleted) {
            setCompletedCoursePopup(course);
          }
          break;
        }
      }
    }
    setSelectedLesson(null);
  };

  // --- Dynamic Quiz Generator ---
  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // generateQuizFromLessons has been moved to utils/placementLogic.js

  const handleStartTest = () => {
    const course = completedCoursePopup;
    setCompletedCoursePopup(null);
    setActiveTest(generateQuizFromLessons(course));
  };

  const handleTestPass = async (testId, score) => {
    if (isPlacementMode) {
      handlePlacementTestPass(testId, score);
      return;
    }
    setActiveTest(null);
    const newXp = userProfile.xp + 200;
    updateUser({ xp: newXp });
    // Optionally: persist test pass to backend in the future
  };

  const handleTestFail = (testId, score) => {
    if (isPlacementMode) {
      handlePlacementTestFail(testId, score);
      return;
    }
    setActiveTest(null);
  };

  if (loading || (!loading && !isAuthenticated) || loadingCurriculum) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        Loading Curriculum...
      </div>
    );
  }

  if (assessmentState === "pending") {
    return <AssessmentStart onStart={handleStartAssessment} />;
  }

  if (assessmentState === "started") {
    return <AssessmentFlow onComplete={handleCompleteAssessment} />;
  }

  if (assessmentState === "result") {
    // Show recommendation before triggering tests
    return (
      <AssessmentResult
        result={{ level: placementRec }} 
        onContinue={handleContinueToDashboard}
      />
    );
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
    <div className="bg-gray-50 min-h-screen pb-24 relative">
      {/* Course Completion Overlay */}
      {completedCoursePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-in zoom-in-95 fill-mode-both border border-gray-100">
            <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Course Complete!
            </h2>
            <p className="text-gray-500 mb-8 px-4 font-medium">
              You've finished all lessons in{" "}
              <strong>{completedCoursePopup.title}</strong>.
            </p>

            <div className="space-y-3">
              {completedCoursePopup.lessons && completedCoursePopup.lessons.length >= 3 && (
                <button
                  onClick={handleStartTest}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  Test Your Knowledge
                </button>
              )}
              <button
                onClick={() => setCompletedCoursePopup(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-xl transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Test Overlay */}
      {activeTest && (
        <ModuleTest
          module={activeTest}
          onPass={handleTestPass}
          onFail={handleTestFail}
          onCancel={() => setActiveTest(null)}
        />
      )}

      <DailyGoalHeader userProgress={userProfile} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header section */}
        <div className="mb-4 animate-in fade-in slide-in-from-top-4 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center sm:justify-start gap-3">
            <BookOpen className="text-brand-600" /> Welcome, {userProfile.name}!
          </h1>
          <p className="text-gray-500 mt-2">Continue your learning journey.</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 mt-8">
            <ShieldAlert size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">
              Curriculum in Development
            </h3>
            <p className="text-gray-500">
              The curriculum is currently being built. Check back soon!
            </p>
          </div>
        ) : (
          <LearningPath
            curriculum={courses}
            userProgress={userProfile}
            onLessonSelect={(lesson) => setSelectedLesson(lesson)}
            onTestSelect={(course) => setActiveTest(generateQuizFromLessons(course))}
          />
        )}
      </div>
    </div>
  );
};

export default LearnISL;
