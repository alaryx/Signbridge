// src/api/mockCourses.js

export const coursePaths = {
    "Absolute Beginner": {
        levelName: "Absolute Beginner",
        description: "Zero knowledge of ISL. Goal: basic visual understanding, hand shapes, simple communication signs.",
        modules: [
            {
                id: "AB_M1",
                title: "Understanding Sign Language",
                description: "Introduce the user to how sign language works.",
                rewards: { xp: 50 },
                status: "in-progress", // For mock purposes, first is unlocked
                lessons: [
                    { id: "AB_M1_L1", title: "What is Indian Sign Language", type: "teach", duration: "2 min" },
                    { id: "AB_M1_L2", title: "Signing Space", type: "practice", duration: "3 min" },
                    { id: "AB_M1_L3", title: "Basic Hand Awareness", type: "practice", duration: "4 min" }
                ],
                quiz: {
                    id: "AB_M1_Q1",
                    title: "Module 1 Checkpoint",
                    passingScore: 66, // percentage
                    questions: [
                        { q: "Where should signs be performed?", options: ["Above head", "In front of body", "Behind back"], ans: "In front of body" },
                        { q: "Why are facial expressions important?", options: ["They look nice", "They convey meaning and tone", "They aren't"], ans: "They convey meaning and tone" },
                        { q: "Which hand usually performs the primary movement of a sign?", options: ["Left", "Right", "Dominant hand"], ans: "Dominant hand" }
                    ]
                }
            },
            {
                id: "AB_M2",
                title: "Basic Greetings",
                description: "Teach first real signs.",
                rewards: { xp: 75 },
                status: "locked",
                lessons: [
                    { id: "AB_M2_L1", title: "Hello", type: "teach_practice", duration: "3 min" },
                    { id: "AB_M2_L2", title: "Thank You", type: "teach_recognize", duration: "4 min" },
                    { id: "AB_M2_L3", title: "Sorry", type: "teach_practice", duration: "3 min" },
                    { id: "AB_M2_L4", title: "Please", type: "teach_recognize", duration: "3 min" }
                ],
                quiz: {
                    id: "AB_M2_Q1",
                    title: "Module 2 Quiz",
                    passingScore: 70,
                    // Simple mock structure
                    questions: []
                }
            },
            {
                id: "AB_M3",
                title: "Basic Responses",
                description: "Teach simple responses like Yes, No, Okay.",
                rewards: { xp: 100 },
                status: "locked",
                lessons: [
                    { id: "AB_M3_L1", title: "Yes / No", type: "teach_recognize", duration: "5 min" },
                    { id: "AB_M3_L2", title: "Okay", type: "teach_practice", duration: "2 min" },
                    { id: "AB_M3_L3", title: "I Understand", type: "teach_recognize", duration: "3 min" }
                ],
                quiz: {
                    id: "AB_M3_TQ1",
                    title: "Module 3 Mini Test",
                    passingScore: 60, // 3/5
                    questions: []
                }
            },
            {
                id: "AB_M4",
                title: "Basic Needs",
                description: "Teach survival communication like Help, Water, Food.",
                rewards: { xp: 120 },
                status: "locked",
                lessons: [
                    { id: "AB_M4_L1", title: "Help", type: "teach_practice", duration: "4 min" },
                    { id: "AB_M4_L2", title: "Water", type: "teach_recognize", duration: "3 min" },
                    { id: "AB_M4_L3", title: "Food", type: "teach_practice", duration: "3 min" },
                    { id: "AB_M4_L4", title: "Stop", type: "teach_recognize", duration: "3 min" }
                ],
                quiz: {
                    id: "AB_M4_Q1",
                    title: "Module 4 Quiz",
                    passingScore: 75,
                    questions: []
                }
            },
            {
                id: "AB_M5",
                title: "Simple Interaction",
                description: "Goal: combine signs into short sequences.",
                rewards: { xp: 150 },
                status: "locked",
                lessons: [
                    { id: "AB_M5_L1", title: "Sign Sequences", type: "teach", duration: "5 min" },
                    { id: "AB_M5_L2", title: "Meaning of sequences", type: "teach_recognize", duration: "4 min" },
                    { id: "AB_M5_L3", title: "Understanding context", type: "recognize", duration: "5 min" }
                ],
                quiz: {
                    id: "AB_M5_Q1",
                    title: "Module 5 Quiz",
                    passingScore: 70,
                    questions: []
                }
            }
        ],
        finalTest: {
            id: "AB_FINAL",
            title: "Absolute Beginner Final Test",
            passingScore: 70, // 7/10
            rewards: { xp: 300, level_up: "Beginner" },
            questions: [] // 10 questions of various types
        }
    },
    // Placeholders for other levels...
    "Beginner": {
        levelName: "Beginner",
        description: "You know basic signs, ready to build simple sentences.",
        modules: []
    },
    "Intermediate": {
        levelName: "Intermediate",
        description: "Able to handle most everyday communication.",
        modules: []
    }
    // ...
};
