import React, { useState } from "react";
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
import { coursePaths as mockCourses } from "../api/mockCourses";
import { useEffect } from "react";

const LearnISL = () => {
  const { isAuthenticated, loading, user, updateUser } = useAuth();
  const navigate = useNavigate();

  // States: 'pending', 'started', 'result', 'completed'
  // Defaulting to pending for onboarding if they haven't completed it
  const [assessmentState, setAssessmentState] = useState(
    user?.assessmentCompleted ? "completed" : "pending",
  );
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedModulePopup, setCompletedModulePopup] = useState(null); // The module they just finished
  const [activeTest, setActiveTest] = useState(null); // The module they are actively testing

  // Store assigned level ('Level 1' by default)
  const [userProfile, setUserProfile] = useState({
    level: user?.level || "Level 1",
    xp: user?.xp || 0,
    streak: user?.streak || 0,
    name: user?.name || "Student",
    completedLessons: user?.completedLessons || [],
  });

  useEffect(() => {
    if (user) {
      setUserProfile((prev) => ({
        ...prev,
        level: user.level || prev.level,
        xp: user.xp || prev.xp,
        streak: user.streak || prev.streak,
        name: user.name || prev.name,
        completedLessons: user.completedLessons || prev.completedLessons,
      }));

      if (user.assessmentCompleted && assessmentState === "pending") {
        setAssessmentState("completed");
      }
    }
  }, [user]);

  // Live Curriculum State
  const [courses, setCourses] = useState([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(true);

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    } else if (isAuthenticated) {
      fetchCurriculum();
    }
  }, [isAuthenticated, loading, navigate]);

  const fetchCurriculum = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/learning/curriculum`,
      );
      const data = await res.json();
      if (data.status === "success" && data.data.length > 0) {
        // Merge in the quiz data from mockCourses, since the DB doesn't have it yet
        const mockLevels = Object.values(mockCourses);

        const mergedCourses = data.data.map((course, cIdx) => {
          // Try to find the corresponding mock course by index
          const mockCourse = mockLevels[cIdx];
          if (!mockCourse) return course;

          return {
            ...course,
            modules: course.modules.map((mod, mIdx) => {
              const mockMod = mockCourse.modules[mIdx];
              if (!mockMod || !mockMod.quiz) return mod;

              return {
                ...mod,
                quiz: mockMod.quiz,
              };
            }),
          };
        });

        setCourses(mergedCourses);
      } else {
        loadMockFallback();
      }
    } catch (error) {
      console.error(
        "Error fetching live curriculum, falling back to mock data:",
        error,
      );
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
      modules: course.modules,
    }));
    setCourses(mockArray);
  };

  const handleStartAssessment = () => {
    setAssessmentState("started");
  };

  const handleCompleteAssessment = () => {
    // Always assign Level 1 after the new simplified assessment
    const newProfile = {
      ...userProfile,
      level: "Level 1",
      assessmentCompleted: true,
    };
    setUserProfile(newProfile);
    updateUser({ level: "Level 1", assessmentCompleted: true });
    setAssessmentState("result");
  };

  const handleContinueToDashboard = () => {
    updateUser({ assessmentCompleted: true });
    setAssessmentState("completed");
  };

  const handleModuleClick = (moduleItem) => {
    if (moduleItem.status !== "locked") {
      setSelectedModule(moduleItem);
    }
  };

  const handleBackToDashboard = () => {
    setSelectedModule(null);
  };

  const handleLessonComplete = (lessonId) => {
    if (!userProfile.completedLessons.includes(lessonId)) {
      const newXp = userProfile.xp + 50;
      const newCompletedLessons = [...userProfile.completedLessons, lessonId];

      setUserProfile((prev) => ({
        ...prev,
        xp: newXp,
        completedLessons: newCompletedLessons,
      }));

      // Sync to global user state
      updateUser({
        xp: newXp,
        completedLessons: newCompletedLessons,
      });

      // Check if this lesson completed a module
      // Iterate through courses to find which module this lesson belonged to
      for (const course of courses) {
        for (const mod of course.modules) {
          const lessonIndex = mod.lessons.findIndex(
            (l) => l._id === lessonId || l.id === lessonId,
          );
          if (lessonIndex !== -1) {
            // Check if all lessons in THIS module are now in newCompletedLessons
            const allCompleted = mod.lessons.every((l) =>
              newCompletedLessons.includes(l._id || l.id),
            );

            // If all completed, and it's this specific lesson that triggered it
            // Ensure we don't trigger if they replay a lesson in an already completed module
            // The outer `if(!includes)` already prevents this from running twice for the same lesson
            if (allCompleted) {
              setCompletedModulePopup(mod);
            }
            break;
          }
        }
      }
    }
    setSelectedLesson(null);
  };

  const buildCumulativeTest = (targetMod) => {
    if (!targetMod || !targetMod.quiz || !targetMod.quiz.questions)
      return targetMod;

    let pastQuestions = [];
    let foundTarget = false;

    // Iterate chronologically to gather past questions
    for (const course of courses) {
      for (const mod of course.modules) {
        if (mod._id === targetMod._id || mod.id === targetMod.id) {
          foundTarget = true;
          break;
        }
        if (mod.quiz && mod.quiz.questions) {
          // Collect all questions from this past module
          pastQuestions = pastQuestions.concat(
            mod.quiz.questions.map((q) => ({ ...q, isFromPast: true })),
          );
        }
      }
      if (foundTarget) break;
    }

    // Randomly select 80% of past questions
    let selectedPastQuestions = [];
    if (pastQuestions.length > 0) {
      // Shuffle
      const shuffledPast = [...pastQuestions].sort(() => 0.5 - Math.random());
      const numToSelect = Math.ceil(shuffledPast.length * 0.8);
      selectedPastQuestions = shuffledPast.slice(0, numToSelect);
    }

    // Combine current module questions with the selected past questions
    const combinedQuestions = [
      ...targetMod.quiz.questions.map((q) => ({ ...q, isFromPast: false })),
      ...selectedPastQuestions,
    ];

    // Shuffle the final combined list
    const finalShuffled = combinedQuestions.sort(() => 0.5 - Math.random());

    // Return a cloned module with the expanded quiz
    return {
      ...targetMod,
      quiz: {
        ...targetMod.quiz,
        questions: finalShuffled,
        // Optionally adjust passing score or keep the percentage requirement the same
        // We'll keep the percentage the same, but it now applies to the larger pool
      },
    };
  };

  const handleStartTest = () => {
    const mod = completedModulePopup;
    setCompletedModulePopup(null);
    setActiveTest(buildCumulativeTest(mod));
  };

  const handleTestPass = (moduleId, score) => {
    setActiveTest(null);

    const newXp = userProfile.xp + 200; // Bonus for passing
    // In a real app we'd track completed modules specifically, here we just give XP
    updateUser({ xp: newXp });
    setUserProfile((prev) => ({ ...prev, xp: newXp }));
  };

  const handleTestFail = (moduleId, score) => {
    setActiveTest(null);
    // They return to dashboard to revise
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
    return (
      <AssessmentResult
        result={userProfile}
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
      {/* Module Completion Overlay */}
      {completedModulePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-in zoom-in-95 fill-mode-both border border-gray-100">
            <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Module Complete!
            </h2>
            <p className="text-gray-500 mb-8 px-4 font-medium">
              You've finished all lessons in{" "}
              <strong>{completedModulePopup.title}</strong>.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleStartTest}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Test Your Knowledge
              </button>
              <button
                onClick={() => setCompletedModulePopup(null)}
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
            onTestSelect={(mod) => setActiveTest(buildCumulativeTest(mod))}
          />
        )}
      </div>
    </div>
  );
};

export default LearnISL;
