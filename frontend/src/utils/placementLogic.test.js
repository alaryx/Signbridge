import { describe, it, expect } from 'vitest';
import { getNextPlacementStep, generateQuizFromLessons, LEVELS } from './placementLogic';

describe('Placement Cascade Logic', () => {
    
    describe('Scenario 1: Recommended Beginner', () => {
        it('should skip tests and place in Beginner immediately', () => {
             const result = getNextPlacementStep(LEVELS.BEGINNER, null, false);
             expect(result.finalPlacement).toBe(LEVELS.BEGINNER);
             expect(result.nextTestCourseTitle).toBeNull();
             expect(result.lessonsToMarkCompleted).toBe(0);
        });
    });

    describe('Scenarios for Recommended Intermediate', () => {
        it('should trigger Beginner test initially', () => {
            const result = getNextPlacementStep(LEVELS.INTERMEDIATE, null, false);
            expect(result.finalPlacement).toBeNull();
            expect(result.nextTestCourseTitle).toBe(LEVELS.BEGINNER);
            expect(result.lessonsToMarkCompleted).toBe(0);
        });

        it('Scenario 2: should place in Intermediate if Beginner test passed', () => {
            const result = getNextPlacementStep(LEVELS.INTERMEDIATE, LEVELS.BEGINNER, true);
            expect(result.finalPlacement).toBe(LEVELS.INTERMEDIATE);
            expect(result.nextTestCourseTitle).toBeNull();
            expect(result.lessonsToMarkCompleted).toBe(1);
        });

        it('Scenario 3: should place in Beginner if Beginner test failed', () => {
            const result = getNextPlacementStep(LEVELS.INTERMEDIATE, LEVELS.BEGINNER, false);
            expect(result.finalPlacement).toBe(LEVELS.BEGINNER);
            expect(result.nextTestCourseTitle).toBeNull();
            expect(result.lessonsToMarkCompleted).toBe(0);
        });
    });

    describe('Scenarios for Recommended Advance', () => {
        it('should trigger Intermediate test initially', () => {
            const result = getNextPlacementStep(LEVELS.ADVANCE, null, false);
            expect(result.finalPlacement).toBeNull();
            expect(result.nextTestCourseTitle).toBe(LEVELS.INTERMEDIATE);
        });

        it('Scenario 4: should place in Advance if Intermediate test passed', () => {
            const result = getNextPlacementStep(LEVELS.ADVANCE, LEVELS.INTERMEDIATE, true);
            expect(result.finalPlacement).toBe(LEVELS.ADVANCE);
            expect(result.nextTestCourseTitle).toBeNull();
            expect(result.lessonsToMarkCompleted).toBe(2);
        });

        it('Scenario 5a: should trigger Beginner test if Intermediate test failed', () => {
            const result = getNextPlacementStep(LEVELS.ADVANCE, LEVELS.INTERMEDIATE, false);
            expect(result.finalPlacement).toBeNull();
            expect(result.nextTestCourseTitle).toBe(LEVELS.BEGINNER);
        });

        it('Scenario 5b: should place in Intermediate if fallback Beginner test passed', () => {
            const result = getNextPlacementStep(LEVELS.ADVANCE, LEVELS.BEGINNER, true);
            expect(result.finalPlacement).toBe(LEVELS.INTERMEDIATE);
            expect(result.nextTestCourseTitle).toBeNull();
            expect(result.lessonsToMarkCompleted).toBe(1);
        });

        it('Scenario 6: should place in Beginner if fallback Beginner test failed', () => {
            const result = getNextPlacementStep(LEVELS.ADVANCE, LEVELS.BEGINNER, false);
            expect(result.finalPlacement).toBe(LEVELS.BEGINNER);
            expect(result.nextTestCourseTitle).toBeNull();
            expect(result.lessonsToMarkCompleted).toBe(0);
        });
    });

});

describe('Dynamic Quiz Generation', () => {
    it('should return null quiz if less than 3 valid lessons', () => {
        const course = { title: 'Test', lessons: [{_id: 1}, {_id: 2}] };
        const result = generateQuizFromLessons(course);
        expect(result.quiz).toBeNull();
    });

    it('should deduplicate lessons based on _id', () => {
        const mockLessons = [
            { _id: '1', title: 'A', mediaUrl: 'url1' },
            { _id: '1', title: 'A_dup', mediaUrl: 'url1_dup' },
            { _id: '2', title: 'B', mediaUrl: 'url2' },
            { _id: '3', title: 'C', mediaUrl: 'url3' }
        ];
        
        const course = { title: 'Dedupe', lessons: mockLessons };
        const result = generateQuizFromLessons(course);
        expect(result.quiz).not.toBeNull();
        expect(result.quiz.questions.length).toBe(3); // Dupes removed
    });

    it('should select exactly between 5 and 10 random lessons when many are provided', () => {
        const mockLessons = Array.from({length: 15}, (_, i) => ({
            _id: `id_${i}`,
            title: `Lesson ${i}`,
            mediaUrl: `fake_url_${i}`
        }));
        
        const course = { title: 'Large', lessons: mockLessons };
        const result = generateQuizFromLessons(course);
        
        expect(result.quiz.questions.length).toBe(10);
    });
});
