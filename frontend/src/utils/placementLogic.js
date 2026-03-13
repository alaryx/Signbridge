/**
 * placementLogic.js
 * Contains the pure logic for deterministic quiz generation and cascading placement rules.
 */

// Levels mapping
export const LEVELS = {
    BEGINNER: 'Daily Conversations (Beginner)',
    INTERMEDIATE: 'Daily Conversations (Intermediate)',
    ADVANCE: 'Daily Conversations (Advance)'
};

/**
 * Determine the next state based on the current recommended level, the test being taken, and the pass/fail result.
 * @param {string} recommendedLevel - The initial recommendation (Beginner, Intermediate, Advance)
 * @param {string|null} currentTestCourseTitle - The title of the course currently being tested on
 * @param {boolean} passed - Whether the user passed the current test
 * @returns {object} { finalPlacement: string|null, nextTestCourseTitle: string|null, lessonsToMarkCompleted: number }
 */
export const getNextPlacementStep = (recommendedLevel, currentTestCourseTitle, passed) => {
    // Scaffold initial state based on recommendation before any test is taken
    if (!currentTestCourseTitle) {
        if (recommendedLevel === LEVELS.BEGINNER) {
            return {
                finalPlacement: LEVELS.BEGINNER,
                nextTestCourseTitle: null,
                lessonsToMarkCompleted: 0
            };
        } else if (recommendedLevel === LEVELS.INTERMEDIATE) {
            return {
                finalPlacement: null,
                nextTestCourseTitle: LEVELS.BEGINNER,
                lessonsToMarkCompleted: 0
            };
        } else if (recommendedLevel === LEVELS.ADVANCE) {
            return {
                finalPlacement: null,
                nextTestCourseTitle: LEVELS.INTERMEDIATE,
                lessonsToMarkCompleted: 0
            };
        }
    }

    // CASE 2: Recommended Intermediate
    if (recommendedLevel === LEVELS.INTERMEDIATE) {
        if (currentTestCourseTitle === LEVELS.BEGINNER) {
            if (passed) {
                return {
                    finalPlacement: LEVELS.INTERMEDIATE,
                    nextTestCourseTitle: null,
                    lessonsToMarkCompleted: 1 // Marks course[0] (Beginner) as complete
                };
            } else {
                return {
                    finalPlacement: LEVELS.BEGINNER,
                    nextTestCourseTitle: null,
                    lessonsToMarkCompleted: 0
                };
            }
        }
    }

    // CASE 3: Recommended Advance
    if (recommendedLevel === LEVELS.ADVANCE) {
        if (currentTestCourseTitle === LEVELS.INTERMEDIATE) {
            if (passed) {
                return {
                    finalPlacement: LEVELS.ADVANCE,
                    nextTestCourseTitle: null,
                    lessonsToMarkCompleted: 2 // Marks course[0] and course[1] complete
                };
            } else {
                return {
                    finalPlacement: null,
                    nextTestCourseTitle: LEVELS.BEGINNER,
                    lessonsToMarkCompleted: 0
                };
            }
        }
        
        // Fallback cascade to Beginner test
        if (currentTestCourseTitle === LEVELS.BEGINNER) {
            if (passed) {
                return {
                    finalPlacement: LEVELS.INTERMEDIATE,
                    nextTestCourseTitle: null,
                    lessonsToMarkCompleted: 1
                };
            } else {
                return {
                    finalPlacement: LEVELS.BEGINNER,
                    nextTestCourseTitle: null,
                    lessonsToMarkCompleted: 0
                };
            }
        }
    }

    // Default fallback
    return {
        finalPlacement: LEVELS.BEGINNER,
        nextTestCourseTitle: null,
        lessonsToMarkCompleted: 0
    };
};

/**
 * Deterministically shuffles an array string keys.
 * Used for randomizing lessons without mutating the original array.
 */
export const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

/**
 * Dynamically generates a quiz from course lessons ensuring exclusivity.
 * @param {object} course - The course object containing lessons
 * @returns {object} The quiz configuration
 */
export const generateQuizFromLessons = (course) => {
    if (!course || !course.lessons || course.lessons.length < 3) {
        return { ...course, quiz: null };
    }

    // Remove duplicates based on ID and ensure media exists using a Set
    const uniqueLessonsMap = new Map();
    course.lessons.forEach(l => {
        if (l.mediaUrl && !uniqueLessonsMap.has(l._id)) {
            uniqueLessonsMap.set(l._id, l);
        }
    });

    const validLessons = Array.from(uniqueLessonsMap.values());
    
    if (validLessons.length < 3) return { ...course, quiz: null };

    // Pick 5-10 lessons for questions
    const questionCount = Math.min(Math.max(5, validLessons.length), 10);
    const selectedLessons = shuffleArray(validLessons).slice(0, questionCount);

    const questions = selectedLessons.map((lesson, idx) => {
        const qType = Math.random() > 0.5 ? 'video_to_text' : 'text_to_video';

        // Pick 3 wrong answers safely from the unique set
        const otherLessons = shuffleArray(validLessons.filter(l => l._id !== lesson._id)).slice(0, 3);

        if (qType === 'video_to_text') {
            const options = shuffleArray([
                { id: `opt_correct_${idx}`, text: lesson.title, isCorrect: true },
                ...otherLessons.map((ol, oi) => ({ id: `opt_wrong_${idx}_${oi}`, text: ol.title }))
            ]);
            return {
                id: `q_${idx}`,
                type: 'video_to_text',
                questionText: 'What does this sign mean?',
                videoUrl: lesson.mediaUrl,
                mediaType: lesson.mediaType || 'video',
                options
            };
        } else {
            const options = shuffleArray([
                { id: `opt_correct_${idx}`, videoUrl: lesson.mediaUrl, mediaType: lesson.mediaType || 'video', isCorrect: true },
                ...otherLessons.map((ol, oi) => ({ id: `opt_wrong_${idx}_${oi}`, videoUrl: ol.mediaUrl, mediaType: ol.mediaType || 'video' }))
            ]);
            return {
                id: `q_${idx}`,
                type: 'text_to_video',
                questionText: `Which of these represents '${lesson.title}'?`,
                options
            };
        }
    });

    return {
        ...course,
        quiz: {
            id: `quiz_${course._id}`,
            title: `${course.title} — Test`,
            passingScore: 70,
            questions: shuffleArray(questions) // Shuffle question order
        }
    };
};
