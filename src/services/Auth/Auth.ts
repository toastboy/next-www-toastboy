import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { normalizeUnknownError } from '@/lib/errors';


export interface AuthSessionUser {
    id?: string | null;
    email?: string | null;
    playerId?: number | null;
}

/**
 * Payload for changing the authenticated user's email address.
 */
export interface ChangeCurrentUserEmailInput {
    newEmail: string;
    callbackURL?: string;
}

class AuthService {
    /**
     * Retrieves the current session user.
     * @returns A promise that resolves to the current session user or null.
     */
    async getSessionUser() {
        try {
            const session = await auth.api.getSession({
                headers: await headers(),
            }) as { user?: AuthSessionUser | null } | null;

            return session?.user ?? null;
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Updates the current session user with the provided data.
     * @param data The user fields to update via Better Auth.
     * @returns The update response from Better Auth.
     */
    async updateCurrentUser(data: Record<string, unknown>) {
        try {
            return await auth.api.updateUser({
                headers: await headers(),
                body: data,
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Initiates an email change for the current authenticated user.
     *
     * Better Auth may complete the change immediately or require a
     * verification/confirmation step depending on the configured policy.
     *
     * @param input - The target email and optional callback URL.
     * @returns The change-email response from Better Auth.
     */
    async changeCurrentUserEmail(input: ChangeCurrentUserEmailInput) {
        try {
            return await auth.api.changeEmail({
                headers: await headers(),
                body: {
                    newEmail: input.newEmail,
                    callbackURL: input.callbackURL,
                },
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }
}

const authService = new AuthService();
export default authService;
