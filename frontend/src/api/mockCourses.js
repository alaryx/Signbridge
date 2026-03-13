// src/api/mockCourses.js

export const coursePaths = {
    "Level 1": {
        levelName: "Level 1: Greetings & Basics",
        description: "Start here! Learn the most common and useful signs for daily interaction.",
        lessons: [
            { id: "L1_M1_L1", title: "Namaste / Hello", type: "teach", duration: "1 min", videoUrl: "/learning/level 1/Namaste.mp4" },
            { id: "L1_M1_L2", title: "Thank You", type: "teach", duration: "1 min", videoUrl: "/learning/level 1/Thank You.mp4" },
            { id: "L1_M1_L3", title: "Sorry", type: "teach", duration: "1 min", videoUrl: "/learning/level 1/sorry.mp4" },
            { id: "L1_M2_L1", title: "Help", type: "teach_practice", duration: "2 min", videoUrl: "/learning/level 1/Help.mp4" },
            { id: "L1_M2_L2", title: "Food", type: "teach_practice", duration: "2 min", videoUrl: "/learning/level 1/food.mp4" }
        ],
        finalTest: {
            id: "L1_FINAL",
            title: "Level 1 Final Test",
            passingScore: 70,
            rewards: { xp: 300, level_up: "Level 2" },
            questions: [
                {
                    id: "q1",
                    type: "text_to_video",
                    questionText: "Which of these videos represents 'Namaste / Hello'?",
                    options: [
                        { id: "opt1", videoUrl: "/learning/level 1/sorry.mp4" },
                        { id: "opt2", videoUrl: "/learning/level 1/Thank You.mp4" },
                        { id: "opt3", videoUrl: "/learning/level 1/Namaste.mp4", isCorrect: true },
                        { id: "opt4", videoUrl: "/learning/level 1/Help.mp4" }
                    ]
                },
                {
                    id: "q2",
                    type: "video_to_text",
                    questionText: "What does this sign mean?",
                    videoUrl: "/learning/level 1/Thank You.mp4",
                    options: [
                        { id: "opt1", text: "Food" },
                        { id: "opt2", text: "Sorry" },
                        { id: "opt3", text: "Thank You", isCorrect: true },
                        { id: "opt4", text: "Hello" }
                    ]
                },
                {
                    id: "q3",
                    type: "action",
                    questionText: "Now it's your turn. Please sign: 'Sorry'",
                    targetSign: "sorry"
                }
            ]
        }
    },
    "Level 2": {
        levelName: "Level 2: Numbers (0-9)",
        description: "Master counting from zero to nine in Indian Sign Language.",
        lessons: [
            { id: "L2_M1_L0", title: "Zero (0)", type: "teach", duration: "1 min", videoUrl: "/learning/level 2 (numbers)/0.mp4", imageUrl: "/learning/level 2 (numbers)/0.jpg" },
            { id: "L2_M1_L1", title: "One (1)", type: "teach", duration: "1 min", videoUrl: "/learning/level 2 (numbers)/1.mp4", imageUrl: "/learning/level 2 (numbers)/1.jpg" },
            { id: "L2_M1_L2", title: "Two (2)", type: "teach", duration: "1 min", videoUrl: "/learning/level 2 (numbers)/2.mp4", imageUrl: "/learning/level 2 (numbers)/2.jpg" },
            { id: "L2_M1_L3", title: "Three (3)", type: "teach", duration: "1 min", videoUrl: "/learning/level 2 (numbers)/3.mp4", imageUrl: "/learning/level 2 (numbers)/3.jpg" },
            { id: "L2_M1_L4", title: "Four (4)", type: "teach", duration: "1 min", videoUrl: "/learning/level 2 (numbers)/4.mp4", imageUrl: "/learning/level 2 (numbers)/4.jpg" },
            { id: "L2_M2_L5", title: "Five (5)", type: "teach", duration: "1 min", videoUrl: "/learning/level 2 (numbers)/5.mp4", imageUrl: "/learning/level 2 (numbers)/5.jpg" },
            { id: "L2_M2_L6", title: "Six (6)", type: "teach", duration: "1 min", videoUrl: "/learning/level 2 (numbers)/6.mp4", imageUrl: "/learning/level 2 (numbers)/6.jpg" },
            { id: "L2_M2_L7", title: "Seven (7)", type: "teach", duration: "1 min", videoUrl: "/learning/level 2 (numbers)/7.mp4", imageUrl: "/learning/level 2 (numbers)/7.jpg" },
            { id: "L2_M2_L8", title: "Eight (8)", type: "teach", duration: "1 min", videoUrl: "/learning/level 2 (numbers)/8.mp4", imageUrl: "/learning/level 2 (numbers)/8.jpg" },
            { id: "L2_M2_L9", title: "Nine (9)", type: "teach", duration: "1 min", videoUrl: "/learning/level 2 (numbers)/9.mp4", imageUrl: "/learning/level 2 (numbers)/9.jpg" }
        ],
        finalTest: {
            id: "L2_FINAL",
            title: "Level 2 Final Test",
            passingScore: 70,
            rewards: { xp: 400, level_up: "Level 3" },
            questions: []
        }
    },
    "Level 3": {
        levelName: "Level 3: Alphabets (A-M)",
        description: "Learn the first half of the English alphabet in Indian Sign Language.",
        lessons: [
            { id: "L3_M1_A", title: "Letter A", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/A.jpg" },
            { id: "L3_M1_B", title: "Letter B", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/B.jpg" },
            { id: "L3_M1_C", title: "Letter C", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/C.jpg" },
            { id: "L3_M1_D", title: "Letter D", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/D.jpg" },
            { id: "L3_M1_E", title: "Letter E", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/E.jpg" },
            { id: "L3_M1_F", title: "Letter F", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/F.jpg" },
            { id: "L3_M2_G", title: "Letter G", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/G.jpg" },
            { id: "L3_M2_H", title: "Letter H", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/H.jpg" },
            { id: "L3_M2_I", title: "Letter I", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/I.jpg" },
            { id: "L3_M2_J", title: "Letter J", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/J.jpg" },
            { id: "L3_M2_K", title: "Letter K", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/K.jpg" },
            { id: "L3_M2_L", title: "Letter L", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/L.jpg" },
            { id: "L3_M2_M", title: "Letter M", type: "teach", duration: "1 min", imageUrl: "/learning/level 3/M.jpg" }
        ],
        finalTest: {
            id: "L3_FINAL",
            title: "Level 3 Final Test",
            passingScore: 70,
            rewards: { xp: 500, level_up: "Level 4" },
            questions: []
        }
    },
    "Level 4": {
        levelName: "Level 4: Alphabets (N-Z)",
        description: "Learn the second half of the English alphabet in Indian Sign Language.",
        lessons: [
            { id: "L4_M1_N", title: "Letter N", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/N.jpg" },
            { id: "L4_M1_O", title: "Letter O", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/O.jpg" },
            { id: "L4_M1_P", title: "Letter P", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/P.jpg" },
            { id: "L4_M1_Q", title: "Letter Q", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/Q.jpg" },
            { id: "L4_M1_R", title: "Letter R", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/R.jpg" },
            { id: "L4_M1_S", title: "Letter S", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/S.jpg" },
            { id: "L4_M1_T", title: "Letter T", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/T.jpg" },
            { id: "L4_M2_U", title: "Letter U", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/U.jpg" },
            { id: "L4_M2_V", title: "Letter V", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/V.jpg" },
            { id: "L4_M2_W", title: "Letter W", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/W.jpg" },
            { id: "L4_M2_X", title: "Letter X", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/X.jpg" },
            { id: "L4_M2_Y", title: "Letter Y", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/Y.jpg" },
            { id: "L4_M2_Z", title: "Letter Z", type: "teach", duration: "1 min", imageUrl: "/learning/level 4/Z.jpg" }
        ],
        finalTest: {
            id: "L4_FINAL",
            title: "Level 4 Final Test",
            passingScore: 70,
            rewards: { xp: 600, level_up: "Mastery" },
            questions: []
        }
    }
};
