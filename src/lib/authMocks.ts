/**
 * Auth mocking utilities for Playwright tests
 *
 * This module provides a way to mock authentication state during testing.
 * It checks for specific window properties or localStorage values to determine
 * what auth state to simulate.
 */

export type MockAuthState = 'none' | 'user' | 'admin';

interface MockUser {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    playerId: number;
}

const mockUsers: Record<MockAuthState, MockUser | null> = {
    none: null,
    user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'testuser@example.com',
        role: 'user',
        playerId: 1,
    },
    admin: {
        id: 'test-admin-id',
        name: 'Test Admin',
        email: 'testadmin@example.com',
        role: 'admin',
        playerId: 2,
    },
};

export function getMockAuthState(): MockAuthState {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        return 'none';
    }

    // Check for playwright test indicator
    const isPlaywrightTest = (window as unknown as Record<string, unknown>).__PLAYWRIGHT_TEST__ === true;

    if (!isPlaywrightTest) {
        return 'none'; // Not in a test, use real auth
    }

    // Get mock state from window property set by Playwright
    const mockState = (window as unknown as Record<string, unknown>).__MOCK_AUTH_STATE__ as MockAuthState;

    return mockState || 'none';
}

export function getMockUser(): MockUser | null {
    const state = getMockAuthState();
    return mockUsers[state];
}

export function isUsingMockAuth(): boolean {
    return typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).__PLAYWRIGHT_TEST__ === true;
}

export interface MockSession {
    data: {
        user: MockUser;
    } | null;
    isPending: boolean;
    error: null;
}

export function getMockSession(): MockSession {
    const user = getMockUser();

    return {
        data: user ? { user } : null,
        isPending: false,
        error: null,
    };
}
