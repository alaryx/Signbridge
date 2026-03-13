import React, { useState } from 'react';
import QuestionRenderer from './QuestionRenderer';
import AssessmentProgressBar from './AssessmentProgressBar';
import { assessmentQuestions, generateFinalPlacement } from '../../api/mockQuestions';

const AssessmentFlow = ({ onComplete }) => {
    const [currentQuestionId, setCurrentQuestionId] = useState('Q1');
    const [stepCount, setStepCount] = useState(1);

    // Total steps is now fixed to 4 based on the simplified linear mockQuestions
    const estimatedTotalSteps = 4;

    const [answersLog, setAnswersLog] = useState([]);

    const handleAnswer = (selectedOption) => {
        const currentQ = assessmentQuestions[currentQuestionId];

        // Log answers (useful for eventually generating personalized paths)
        setAnswersLog([...answersLog, { qId: currentQuestionId, selected: selectedOption }]);

        const nextId = selectedOption.nextId;

        // Check if we hit an early "finish" based on evaluation failure
        if (nextId === 'finish') {
            const finalLevel = generateFinalPlacement();

            // Finish Assessment
            onComplete({
                level: finalLevel,
                path: ['The Continuous Course']
            });
            return;
        }

        // Proceed to next question
        if (assessmentQuestions[nextId]) {
            setCurrentQuestionId(nextId);
            setStepCount(prev => prev + 1);
        } else {
            // Fallback finish if nextId is invalid or unexpectedly missing
            window.console.error("Missing question ID:", nextId);
            onComplete({ level: 'Level 1', path: [] });
        }
    };

    const currentQuestion = assessmentQuestions[currentQuestionId];

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
            <AssessmentProgressBar currentStep={stepCount} totalSteps={estimatedTotalSteps} />

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
                <QuestionRenderer
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                />
            </div>
        </div>
    );
};

export default AssessmentFlow;
