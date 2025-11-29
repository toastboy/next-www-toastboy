/**
 * Auth mocking utilities for Playwright tests
 *
 * This module provides a way to mock authentication state during testing.
 * It checks for specific window properties or localStorage values to determine
 * what auth state to simulate.
 */

import type * as BetterAuthClient from 'lib/auth-client';

// Shared mock creation/update date for consistency and maintainability
const MOCK_CREATED_AT = '2023-01-01T00:00:00Z';

export type MockAuthState = 'none' | 'user' | 'admin';

type SessionHook = ReturnType<typeof BetterAuthClient.authClient.useSession>;
type SessionData = SessionHook['data'];
type MockUser = NonNullable<SessionData>['user'];
type MockSessionDetails = NonNullable<SessionData>['session'];

export type MockSession = SessionHook;

const baseUserDates = {
    createdAt: new Date(MOCK_CREATED_AT),
    updatedAt: new Date(MOCK_CREATED_AT),
};

const mockUsers: Record<MockAuthState, MockUser | null> = {
    none: null,
    user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'testuser@example.com',
        role: 'user',
        playerId: 1,
        emailVerified: true,
        image: null,
        banned: false,
        banReason: null,
        banExpires: null,
        ...baseUserDates,
    },
    admin: {
        id: 'test-admin-id',
        name: 'Test Admin',
        email: 'testadmin@example.com',
        role: 'admin',
        playerId: 2,
        emailVerified: true,
        image: null,
        banned: false,
        banReason: null,
        banExpires: null,
        ...baseUserDates,
    },
};

const baseSessionDates = {
    createdAt: new Date(MOCK_CREATED_AT),
    updatedAt: new Date(MOCK_CREATED_AT),
    expiresAt: new Date('2099-01-01T00:00:00Z'),
};

const mockSessionDetails: Record<Exclude<MockAuthState, 'none'>, MockSessionDetails> = {
    user: {
        id: 'test-session-id',
        userId: 'test-user-id',
        token: 'mock-session-token',
        ipAddress: '127.0.0.1',
        userAgent: 'MockUserAgent',
        impersonatedBy: null,
        ...baseSessionDates,
    },
    admin: {
        id: 'test-admin-session-id',
        userId: 'test-admin-id',
        token: 'mock-admin-session-token',
        ipAddress: '127.0.0.1',
        userAgent: 'MockUserAgent',
        impersonatedBy: null,
        ...baseSessionDates,
    },
};

// Helper to safely cast window to record for test/shim access
function getWindowTestRecord(): Record<string, unknown> {
    return window as unknown as Record<string, unknown>;
}

export function getMockAuthState(): MockAuthState {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        return 'none';
    }

    // Check for playwright test indicator
    const isPlaywrightTest = getWindowTestRecord().__PLAYWRIGHT_TEST__ === true;

    if (!isPlaywrightTest) {
        return 'none'; // Not in a test, use real auth
    }

    // Get mock state from window property set by Playwright
    const mockState = getWindowTestRecord().__MOCK_AUTH_STATE__ as MockAuthState;

    return mockState || 'none';
}

export function getMockUser(): MockUser | null {
    const state = getMockAuthState();
    return mockUsers[state];
}

export function isUsingMockAuth(): boolean {
    return typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).__PLAYWRIGHT_TEST__ === true;
}

function buildSessionData(): SessionData {
    const user = getMockUser();

    if (!user) {
        return null;
    }

    const userRole = user.role === 'admin' ? 'admin' : 'user';
    const session = mockSessionDetails[userRole];

    return {
        user,
        session: {
            ...session,
            userId: user.id,
        },
    };
}

export function getMockSession(): MockSession {
    const session: MockSession = {
        data: buildSessionData(),
        isPending: false,
        isRefetching: false,
        error: null,
        refetch: async () => {
            session.isRefetching = true;
            // simulate async behavior; allow consumers to observe .isRefetching === true
            await Promise.resolve();
            session.data = buildSessionData();
            session.isRefetching = false;
        },
    };

    return session;
}
