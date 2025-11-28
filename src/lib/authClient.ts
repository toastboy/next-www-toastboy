'use client';

import * as Sentry from '@sentry/react';
import { UserWithRole } from 'better-auth/plugins';
import { authClient as betterAuthClient } from 'lib/auth-client';
import { getMockSession, getMockUser, isUsingMockAuth } from 'lib/authMocks';

export interface User {
    name: string;
    email: string;
    playerId: number;
}

type SessionResponse = Awaited<ReturnType<typeof betterAuthClient.getSession>>;
type SessionData = (typeof betterAuthClient.$Infer.Session) | null;

// `getSession` returns a BetterFetchResponse; retype its `data` to our inferred session payload
// so downstream consumers see user fields (role, playerId, etc.) without guessing.
export type Session = Omit<SessionResponse, 'data'> & { data: SessionData };

export const authClient = {
    useSession: () => {
        if (isUsingMockAuth()) {
            return getMockSession();
        }
        return betterAuthClient.useSession();
    },

    signOut: async (): Promise<void> => {
        if (isUsingMockAuth()) {
            // In mock mode, just clear the mock state
            if (typeof window !== 'undefined') {
                (window as unknown as Record<string, unknown>).__MOCK_AUTH_STATE__ = 'none';
            }
            return;
        }
        await betterAuthClient.signOut();
    },

    setAdmin: async (userId: string, isAdmin: boolean): Promise<void> => {
        if (isUsingMockAuth()) {
            // In mock mode, just simulate the operation
            return;
        }
        await betterAuthClient.admin.setRole({
            userId: userId,
            role: isAdmin ? 'admin' : 'user',
        });
    },

    isLoggedIn: (session: Session): boolean => {
        return session?.data?.user != null;
    },

    isAdmin: (session: Session): boolean => {
        return session?.data?.user.role === "admin";
    },

    signInWithEmail: async (email: string, password: string): Promise<void> => {
        if (isUsingMockAuth()) {
            // In mock mode, determine auth state based on credentials
            let newState: 'none' | 'user' | 'admin' = 'none';

            // Simulate the test credentials from your existing tests
            if (email === 'testuser@example.com' || password === 'testpassword') {
                newState = 'user';
            } else if (email === 'testadmin@example.com' || password === 'correcthorse') {
                newState = 'admin';
            } else if (password === 'schmassword') {
                // Invalid credentials
                throw new Error('Invalid credentials');
            }

            if (typeof window !== 'undefined') {
                (window as unknown as Record<string, unknown>).__MOCK_AUTH_STATE__ = newState;
            }
            return;
        }

        const result = await betterAuthClient.signIn.email({
            email: email,
            password: password,
        }, {
            onRequest: () => {
                // TODO: Show loading
            },
            onSuccess: () => {
                // TODO: Hide loading
            },
            onError: (ctx) => {
                Sentry.captureException(JSON.stringify(ctx.error, null, 2));
                alert("Error " + ctx.error.message);
            },
        });

        Sentry.captureMessage(`Sign in result: ${JSON.stringify(result, null, 2)}`, 'info');
    },

    getUser: (): User | null => {
        if (isUsingMockAuth()) {
            const mockUser = getMockUser();
            if (mockUser) {
                return {
                    name: mockUser.name,
                    email: mockUser.email,
                    playerId: mockUser.playerId,
                };
            }
            return null;
        }

        const { data: session, isPending, error } = betterAuthClient.useSession();
        if (isPending) {
            return null;
        }
        if (error) {
            Sentry.captureException(error);
            return null;
        }
        if (session?.user) {
            return {
                name: session.user.name,
                email: session.user.email,
                playerId: session.user.playerId,
            };
        }
        return null;
    },

    listUsers: async (email?: string): Promise<UserWithRole[]> => {
        if (isUsingMockAuth()) {
            // Return mock users for testing
            const mockUsers: UserWithRole[] = [
                {
                    id: 'test-user-id',
                    name: 'Test User',
                    email: 'testuser@example.com',
                    role: 'user',
                    createdAt: new Date('2023-01-01'),
                    updatedAt: new Date('2023-01-01'),
                    emailVerified: false,
                    image: null,
                    banned: false,
                },
                {
                    id: 'test-admin-id',
                    name: 'Test Admin',
                    email: 'testadmin@example.com',
                    role: 'admin',
                    createdAt: new Date('2023-01-01'),
                    updatedAt: new Date('2023-01-01'),
                    emailVerified: false,
                    image: null,
                    banned: false,
                },
            ];

            if (email) {
                const decodedEmail = decodeURIComponent(email);
                return mockUsers.filter(user =>
                    user.email.toLowerCase().includes(decodedEmail.toLowerCase()),
                );
            }

            return mockUsers;
        }

        const response = await betterAuthClient.admin.listUsers({
            query: email ? {
                searchField: "email",
                searchOperator: "contains",
                searchValue: decodeURIComponent(email),
            } : {
                limit: 10,
            },
        });

        if (response.error) {
            Sentry.captureException(response.error);
            throw new Error(response.error.message);
        }

        return response.data?.users || [];
    },
};
