import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { normalizeUnknownError } from '@/lib/errors';


export interface AuthSessionUser {
    id?: string | null;
    email?: string | null;
    playerId?: number | null;
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
}

const authService = new AuthService();
export default authService;
