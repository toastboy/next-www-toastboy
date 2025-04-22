'use client';

import * as Sentry from '@sentry/react';
import { UserWithRole } from 'better-auth/plugins';
import { authClient as betterAuthClient } from 'lib/auth-client';

export interface User {
    name: string;
    email: string;
    playerId: number;
}

export type Session = Awaited<ReturnType<typeof betterAuthClient.getSession>>;

export const authClient = {
    useSession: () => {
        return betterAuthClient.useSession();
    },

    signOut: async (): Promise<void> => {
        await betterAuthClient.signOut();
    },

    setAdmin: async (userId: string, isAdmin: boolean): Promise<void> => {
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