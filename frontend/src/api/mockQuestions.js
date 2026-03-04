// src/api/mockQuestions.js

export const assessmentQuestions = {
    // PHASE 1: User Context
    Q1: {
        id: "Q1",
        category: "Context",
        type: "single_choice",
        question: "Who are you learning ISL for?",
        options: [
            { text: "I am deaf / hard of hearing", nextId: "Q2" },
            { text: "Family member / friend is deaf", nextId: "Q2" },
            { text: "Professional use (doctor, teacher, staff, etc.)", nextId: "Q2" },
            { text: "General interest / learning", nextId: "Q2" },
            { text: "Other", nextId: "Q2" }
        ]
    },
    Q2: {
        id: "Q2",
        category: "Context",
        type: "multiple_choice",
        question: "How do you plan to use ISL most?",
        subtitle: "(Select all that apply, then click your primary choice to proceed)",
        options: [
            { text: "Daily conversation", nextId: "Q3" },
            { text: "Education", nextId: "Q3" },
            { text: "Healthcare / emergencies", nextId: "Q3" },
            { text: "Workplace", nextId: "Q3" },
            { text: "Public services", nextId: "Q3" },
            { text: "Social interaction", nextId: "Q3" }
        ]
    },

    // PHASE 2: Self-Reported Level (Branching Entry)
    Q3: {
        id: "Q3",
        category: "Self-Assessment",
        type: "single_choice",
        question: "How familiar are you with Indian Sign Language?",
        options: [
            { text: "I have never learned ISL", nextId: "Q4", levelContext: "Absolute Beginner" },
            { text: "I know a few basic signs", nextId: "Q6", levelContext: "Beginner" },
            { text: "I can understand simple conversations", nextId: "Q9", levelContext: "Lower-Intermediate" },
            { text: "I am comfortable with ISL", nextId: "Q12", levelContext: "Intermediate" },
            { text: "I am advanced / fluent", nextId: "Q15", levelContext: "Upper-Intermediate" } // Adjusted mapping per tree
        ]
    },

    // --- ABSOLUTE BEGINNER BRANCH ---
    Q4: {
        id: "Q4",
        category: "Absolute Beginner",
        type: "single_choice",
        question: "Have you ever seen or used hand signs to communicate?",
        options: [
            { text: "Yes", nextId: "Q5" },
            { text: "No", nextId: "Q5" }
        ]
    },
    Q5: {
        id: "Q5",
        category: "Absolute Beginner",
        type: "recognition_visual",
        question: "What does this sign mean?",
        mediaAlt: "Hello Sign",
        options: [
            { text: "Hello", nextId: "Q6", isCorrect: true, evaluateFlow: 'pass' }, // Pass -> Go to Beginner
            { text: "Thank you", nextId: "finish", isCorrect: false, evaluateFlow: 'fail' }, // Fail -> Stay Absolute Beginner
            { text: "Sorry", nextId: "finish", isCorrect: false, evaluateFlow: 'fail' },
            { text: "I don't know", nextId: "finish", isCorrect: false, evaluateFlow: 'fail' }
        ],
        failPlacement: 'Absolute Beginner'
    },

    // --- BEGINNER BRANCH ---
    Q6: {
        id: "Q6",
        category: "Beginner",
        type: "single_choice", // Simplified matching for the skeleton structure
        question: "Select the correct meaning for the basic sign sequence (Greeting):",
        options: [
            { text: "Correct Match", nextId: "Q7", isCorrect: true, evaluateFlow: 'pass' }, // 3+ correct proxy
            { text: "Incorrect Match", nextId: "finish", isCorrect: false, evaluateFlow: 'fail' } // <3 correct proxy
        ],
        failPlacement: 'Absolute Beginner'
    },
    Q7: {
        id: "Q7",
        category: "Beginner",
        type: "camera_practice",
        question: "Try signing 'Hello'",
        options: [
            { text: "Completed Practice", nextId: "Q8" },
            { text: "Skipped Practice", nextId: "Q8" }
        ]
    },
    Q8: {
        id: "Q8",
        category: "Beginner",
        type: "single_choice",
        question: "If someone signs 'Thank you', when are they most likely using it?",
        options: [
            { text: "When leaving", nextId: "finish", isCorrect: false, evaluateFlow: 'fail' },
            { text: "To show gratitude", nextId: "Q9", isCorrect: true, evaluateFlow: 'pass' }, // Pass -> Lower-Intermediate
            { text: "To ask a question", nextId: "finish", isCorrect: false, evaluateFlow: 'fail' }
        ],
        failPlacement: 'Beginner'
    },

    // --- LOWER INTERMEDIATE BRANCH ---
    Q9: {
        id: "Q9",
        category: "Lower Intermediate",
        type: "recognition_visual",
        question: "What does this 2-sign sequence mean?",
        mediaAlt: "I + Help",
        options: [
            { text: "I need help", nextId: "Q10", isCorrect: true, evaluateFlow: 'continue' },
            { text: "Help me tomorrow", nextId: "Q10", isCorrect: false, evaluateFlow: 'continue' },
            { text: "I am fine", nextId: "Q10", isCorrect: false, evaluateFlow: 'continue' },
            { text: "I don't know", nextId: "Q10", isCorrect: false, evaluateFlow: 'continue' }
        ]
    },
    Q10: {
        id: "Q10",
        category: "Lower Intermediate",
        type: "single_choice",
        question: "Choose the correct text translation for the sign 'Water'",
        options: [
            { text: "Correct Translation", nextId: "Q11", isCorrect: true, evaluateFlow: 'continue' },
            { text: "Incorrect Translation", nextId: "Q11", isCorrect: false, evaluateFlow: 'continue' }
        ]
    },
    Q11: {
        id: "Q11",
        category: "Lower Intermediate",
        type: "camera_practice",
        question: "Sign 'Thank you' or 'Help'",
        options: [
            // Next nodes here are handled by complex evaluation logic in Flow component normally, 
            // but we'll mock the final transition to Q12 or Finish here for simplicity of the skeleton
            { text: "Completed Practice (Pass)", nextId: "Q12", isCorrect: true, evaluateFlow: 'pass' }, // Pass -> Intermediate
            { text: "Skipped Practice (Fail)", nextId: "finish", isCorrect: false, evaluateFlow: 'fail' } // Fail -> Beginner
        ],
        failPlacement: 'Beginner'
    },

    // --- INTERMEDIATE BRANCH ---
    Q12: {
        id: "Q12",
        category: "Intermediate",
        type: "context",
        question: "Someone signs 'Doctor + Pain + Here'. What are they trying to say?",
        options: [
            { text: "I want to become a doctor", nextId: "Q13", isCorrect: false, evaluateFlow: 'continue' },
            { text: "I have pain here", nextId: "Q13", isCorrect: true, evaluateFlow: 'continue' },
            { text: "I am afraid of doctors", nextId: "Q13", isCorrect: false, evaluateFlow: 'continue' },
            { text: "I don't know", nextId: "Q13", isCorrect: false, evaluateFlow: 'continue' }
        ]
    },
    Q13: {
        id: "Q13",
        category: "Intermediate",
        type: "multiple_choice",
        question: "If someone signs 'How are you?', what is a correct reply?",
        options: [
            { text: "Good", nextId: "Q14", isCorrect: true, evaluateFlow: 'continue' },
            { text: "Fine", nextId: "Q14", isCorrect: true, evaluateFlow: 'continue' },
            { text: "Red", nextId: "Q14", isCorrect: false, evaluateFlow: 'continue' }
        ]
    },
    Q14: {
        id: "Q14",
        category: "Intermediate",
        type: "camera_practice",
        question: "Sign 'I am fine' OR 'I need help'",
        options: [
            { text: "Strong Pass", nextId: "Q15", isCorrect: true, evaluateFlow: 'pass' }, // Upper-Ind
            { text: "Weak / Fail", nextId: "finish", isCorrect: false, evaluateFlow: 'fail' }
        ],
        failPlacement: 'Intermediate'
    },

    // --- UPPER INTERMEDIATE BRANCH ---
    Q15: {
        id: "Q15",
        category: "Upper Intermediate",
        type: "inference",
        question: "What is the intent of the message shown in the video?",
        mediaAlt: "3-4 sign sentence video",
        options: [
            { text: "Asking", nextId: "Q16", isCorrect: false, evaluateFlow: 'continue' },
            { text: "Informing", nextId: "Q16", isCorrect: true, evaluateFlow: 'continue' },
            { text: "Requesting", nextId: "Q16", isCorrect: false, evaluateFlow: 'continue' },
            { text: "Warning", nextId: "Q16", isCorrect: false, evaluateFlow: 'continue' }
        ]
    },
    Q16: {
        id: "Q16",
        category: "Upper Intermediate",
        type: "recognition_visual",
        question: "Is this sentence order correct?",
        subtitle: "(Shows slightly incorrect sign order)",
        options: [
            { text: "Yes", nextId: "finish", isCorrect: false, evaluateFlow: 'fail' }, // Stay Intermediate
            { text: "No", nextId: "Q17", isCorrect: true, evaluateFlow: 'pass' } // Move to advanced
        ],
        failPlacement: 'Intermediate'
    },

    // --- ADVANCED BRANCH ---
    Q17: {
        id: "Q17",
        category: "Advanced",
        type: "recognition_visual",
        question: "What is being discussed in this short conversation?",
        mediaAlt: "Short dialogue video",
        options: [
            { text: "Correct Topic", nextId: "Q18", isCorrect: true, evaluateFlow: 'continue' },
            { text: "Another Topic", nextId: "Q18", isCorrect: false, evaluateFlow: 'continue' }
        ]
    },
    Q18: {
        id: "Q18",
        category: "Advanced",
        type: "single_choice",
        question: "How confident do you feel understanding ISL conversations?",
        options: [
            { text: "Very Confident", nextId: "finish", evaluateFlow: 'pass' },
            { text: "Somewhat Confident", nextId: "finish", evaluateFlow: 'pass' },
            { text: "Not Confident", nextId: "finish", evaluateFlow: 'pass' }
        ]
    }
};

// Helper function to map generic placements to levels based on tree structure.
export const generateFinalPlacement = (lastLevelVisited, evaluateFlowStatus, failPlacementOverride) => {
    // If the node explicitly dictates where to go on failure, use that:
    if (evaluateFlowStatus === 'fail' && failPlacementOverride) {
        return failPlacementOverride;
    }

    // Otherwise, normal mapping logic based on where they finished successfully
    const mapping = {
        'Absolute Beginner': 'Absolute Beginner',
        'Beginner': 'Beginner',
        'Lower Intermediate': 'Lower Intermediate',
        'Intermediate': 'Intermediate',
        'Upper Intermediate': 'Upper Intermediate',
        'Advanced': 'Advanced'
    };

    return mapping[lastLevelVisited] || 'Beginner';
};
