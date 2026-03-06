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
    // PHASE 2: Basics
    Q3: {
        id: "Q3",
        category: "Basics",
        type: "single_choice",
        question: "Are you familiar with any sign languages?",
        options: [
            { text: "Yes, I know a little ISL", nextId: "Q4" },
            { text: "Yes, I know ASL or BSL", nextId: "Q4" },
            { text: "No, I am completely new", nextId: "Q4" }
        ]
    },
    Q4: {
        id: "Q4",
        category: "Basics",
        type: "single_choice",
        question: "How much time can you dedicate daily?",
        options: [
            { text: "5-10 minutes", nextId: "finish" },
            { text: "15-30 minutes", nextId: "finish" },
            { text: "More than 30 minutes", nextId: "finish" }
        ]
    }
};

// Helper function to map generic placements - Always returns Level 1 for the new flow
export const generateFinalPlacement = () => {
    return 'Level 1';
};
