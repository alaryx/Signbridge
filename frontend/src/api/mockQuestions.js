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
            { text: "No, I haven't learnt ISL", nextId: "Q4", placementLevel: "Daily Conversations (Beginner)" },
            { text: "I have learnt a little ISL", nextId: "Q4", placementLevel: "Daily Conversations (Intermediate)" },
            { text: "I have learnt ISL properly", nextId: "Q4", placementLevel: "Daily Conversations (Advance)" }
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

// Helper function to map generic placements
export const generateFinalPlacement = (answers) => {
    const q3Answer = answers.find(a => a.qId === 'Q3');
    return q3Answer?.selected?.placementLevel || 'Daily Conversations (Beginner)';
};
