import React, { useState } from 'react';
import QuestionRenderer from './QuestionRenderer';
import AssessmentProgressBar from './AssessmentProgressBar';
import { assessmentQuestions, generateFinalPlacement } from '../../api/mockQuestions';

const AssessmentFlow = ({ onComplete }) => {
    const [currentQuestionId, setCurrentQuestionId] = useState('Q1');
    const [stepCount, setStepCount] = useState(1);

    // Total steps is dynamic in an adaptive flow, we'll estimate it relative to an average path length
    const estimatedTotalSteps = 8;

    // Keep track of the highest level reached for logic processing on 'finish'
    const [highestLevelCategory, setHighestLevelCategory] = useState("Context");
    const [answersLog, setAnswersLog] = useState([]);

    const handleAnswer = (selectedOption) => {
        const currentQ = assessmentQuestions[currentQuestionId];

        // Log answers (useful for eventually generating personalized paths)
        setAnswersLog([...answersLog, { qId: currentQuestionId, selected: selectedOption }]);

        if (currentQ.category !== 'Context' && currentQ.category !== 'Self-Assessment') {
            setHighestLevelCategory(currentQ.category);
        }

        const nextId = selectedOption.nextId;

        // Check if we hit an early "finish" based on evaluation failure
        if (nextId === 'finish') {
            const finalLevel = generateFinalPlacement(
                currentQ.category,
                selectedOption.evaluateFlow,
                currentQ.failPlacement
            );

            // Finish Assessment
            onComplete({
                level: finalLevel,
                path: ['Module 1: Foundations', 'Module 2: Daily Life', 'Module 3: Practice'] // Mocked path
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
            onComplete({ level: highestLevelCategory || 'Beginner', path: [] });
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
