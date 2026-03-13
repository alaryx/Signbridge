import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import LearnISL from './LearnISL';
import { useAuth } from '../context/AuthContext';

// Mock dependencies
vi.mock('../context/AuthContext');

// Mock child components that aren't the focus of integration logic
vi.mock('../components/learning/AssessmentStart', () => ({
    default: ({ onStart }) => <button data-testid="start-assessment" onClick={onStart}>Start Assessment</button>
}));
vi.mock('../components/learning/AssessmentFlow', () => ({
    default: ({ onComplete }) => (
        <div data-testid="assessment-flow">
            <button data-testid="complete-beginner" onClick={() => onComplete({ level: 'Daily Conversations (Beginner)' })}>Complete Beginner</button>
            <button data-testid="complete-intermediate" onClick={() => onComplete({ level: 'Daily Conversations (Intermediate)' })}>Complete Intermediate</button>
            <button data-testid="complete-advance" onClick={() => onComplete({ level: 'Daily Conversations (Advance)' })}>Complete Advance</button>
        </div>
    )
}));
vi.mock('../components/learning/AssessmentResult', () => ({
    default: ({ result, onContinue }) => (
        <div data-testid="assessment-result">
            <p>Recommended: {result.level}</p>
            <button data-testid="continue-dashboard" onClick={onContinue}>View Dashboard</button>
        </div>
    )
}));
vi.mock('../components/learning/ModuleTest', () => ({
    default: ({ module, onPass, onFail }) => (
        <div data-testid="module-test">
            <p>{module.title}</p>
            <button data-testid="pass-test" onClick={() => onPass(module.quiz.id, 100)}>Pass</button>
            <button data-testid="fail-test" onClick={() => onFail(module.quiz.id, 0)}>Fail</button>
        </div>
    )
}));

// Mock Curriculum Data
const mockCourses = [
    { _id: 'c1', title: 'Daily Conversations (Beginner)', order: 1, lessons: [
        { _id: 'l1', title: 'A', mediaUrl: 'u1' }, { _id: 'l2', title: 'B', mediaUrl: 'u2' }, { _id: 'l3', title: 'C', mediaUrl: 'u3' }
    ]},
    { _id: 'c2', title: 'Daily Conversations (Intermediate)', order: 2, lessons: [
        { _id: 'l4', title: 'D', mediaUrl: 'u4' }, { _id: 'l5', title: 'E', mediaUrl: 'u5' }, { _id: 'l6', title: 'F', mediaUrl: 'u6' }
    ]},
    { _id: 'c3', title: 'Daily Conversations (Advance)', order: 3, lessons: [
        { _id: 'l7', title: 'G', mediaUrl: 'u7' }, { _id: 'l8', title: 'H', mediaUrl: 'u8' }, { _id: 'l9', title: 'I', mediaUrl: 'u9' }
    ]}
];

describe('LearnISL Placement Test Cascade', () => {
    let mockUpdateUser;

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ status: 'success', data: mockCourses }),
                ok: true
            })
        );
        
        mockUpdateUser = vi.fn();
        useAuth.mockReturnValue({
            isAuthenticated: true,
            loading: false,
            user: { assessmentCompleted: false, completedLessons: [] },
            updateUser: mockUpdateUser,
            refreshUser: vi.fn(),
        });
        
        // Mock token for API requests
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(() => 'fake-token'),
            setItem: vi.fn(),
            removeItem: vi.fn(),
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    const renderComponent = () => render(
        <BrowserRouter>
            <LearnISL />
        </BrowserRouter>
    );

    it('Scenario 1: Recommended Beginner skips tests and places immediately', async () => {
        renderComponent();
        
        // Wait for curriculum load
        await waitFor(() => expect(screen.getByTestId('start-assessment')).toBeInTheDocument());
        
        await act(async () => {
            fireEvent.click(screen.getByTestId('start-assessment'));
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId('complete-beginner'));
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId('continue-dashboard'));
        });

        await waitFor(() => {
            // Should not show any module test
            expect(screen.queryByTestId('module-test')).not.toBeInTheDocument();
            // Should have called updateUser with Final Placement
            expect(mockUpdateUser).toHaveBeenCalledWith(expect.objectContaining({
                level: 'Daily Conversations (Beginner)',
                assessmentCompleted: true
            }));
            // Should have called the API correctly
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/learning/me/assessment-complete'),
                expect.objectContaining({
                    body: expect.stringContaining('"finalCourseLevel":"Daily Conversations (Beginner)"')
                })
            );
        });
    });

    it('Scenario 2: Recommended Intermediate passes Beginner test and places Intermediate', async () => {
        renderComponent();
        await waitFor(() => expect(screen.getByTestId('start-assessment')).toBeInTheDocument());
        
        fireEvent.click(screen.getByTestId('start-assessment'));
        
        await waitFor(() => expect(screen.getByTestId('complete-intermediate')).toBeInTheDocument());
        fireEvent.click(screen.getByTestId('complete-intermediate'));

        await waitFor(() => expect(screen.getByTestId('continue-dashboard')).toBeInTheDocument());
        fireEvent.click(screen.getByTestId('continue-dashboard'));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
        });

        // Should be showing the Beginner test
        const moduleTest = screen.getByTestId('module-test');
        expect(moduleTest).toBeInTheDocument();
        expect(screen.getAllByText('Daily Conversations (Beginner)')[0]).toBeInTheDocument();

        // Pass the beginner test
        await act(async () => {
            fireEvent.click(screen.getByTestId('pass-test'));
        });

        await waitFor(() => {
            expect(mockUpdateUser).toHaveBeenCalledWith(expect.objectContaining({
                level: 'Daily Conversations (Intermediate)',
                assessmentCompleted: true,
                completedLessons: ['l1', 'l2', 'l3'] // Course 0 lessons
            }));
        });
    });

    it('Scenario 3: Recommended Intermediate fails Beginner test and places Beginner', async () => {
        renderComponent();
        await waitFor(() => expect(screen.getByTestId('start-assessment')).toBeInTheDocument());
        
        fireEvent.click(screen.getByTestId('start-assessment'));

        await waitFor(() => expect(screen.getByTestId('complete-intermediate')).toBeInTheDocument());
        fireEvent.click(screen.getByTestId('complete-intermediate'));

        await waitFor(() => expect(screen.getByTestId('continue-dashboard')).toBeInTheDocument());
        fireEvent.click(screen.getByTestId('continue-dashboard'));

        await act(async () => {
            await new Promise(r => setTimeout(r, 500));
        });

        const moduleTest = screen.getByTestId('module-test');
        expect(moduleTest).toBeInTheDocument();
        
        // Fail the beginner test
        await act(async () => {
            fireEvent.click(screen.getByTestId('fail-test'));
        });

        await waitFor(() => {
            expect(mockUpdateUser).toHaveBeenCalledWith({
                level: 'Daily Conversations (Beginner)',
                assessmentCompleted: true
            });
             expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/learning/me/assessment-complete'),
                expect.objectContaining({
                    body: expect.stringContaining('"finalCourseLevel":"Daily Conversations (Beginner)"')
                })
            );
        });
    });

    it('Scenarios 4-6: Recommended Advance cascades correctly based on passes and fails', async () => {
        renderComponent();
        await waitFor(() => expect(screen.getByTestId('start-assessment')).toBeInTheDocument());
        
        fireEvent.click(screen.getByTestId('start-assessment'));

        await waitFor(() => expect(screen.getByTestId('complete-advance')).toBeInTheDocument());
        fireEvent.click(screen.getByTestId('complete-advance'));

        await waitFor(() => expect(screen.getByTestId('continue-dashboard')).toBeInTheDocument());
        fireEvent.click(screen.getByTestId('continue-dashboard'));

        await act(async () => {
            await new Promise(r => setTimeout(r, 500));
        });

        // First step: Shows intermediate test
        const moduleTest = screen.getByTestId('module-test');
        expect(moduleTest).toBeInTheDocument();
        expect(screen.getAllByText('Daily Conversations (Intermediate)')[0]).toBeInTheDocument();

        // Fail Intermediate -> Should see Beginner
        await act(async () => {
            fireEvent.click(screen.getByTestId('fail-test'));
        });
        
        await act(async () => {
            await new Promise(r => setTimeout(r, 500));
        });

        const beginnerTest = screen.getAllByText('Daily Conversations (Beginner)')[0];
        expect(beginnerTest).toBeInTheDocument();

        // Fail Beginner -> Should place Beginner
        await act(async () => {
            fireEvent.click(screen.getByTestId('fail-test'));
        });

        await waitFor(() => {
            expect(mockUpdateUser).toHaveBeenCalledWith({
                level: 'Daily Conversations (Beginner)',
                assessmentCompleted: true
            });
        });
    });
});
