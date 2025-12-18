import { authClient } from 'lib/auth-client';
import { headers } from 'next/headers';

/**
 * Retrieves the role of the currently authenticated user.
 *
 * @returns A promise that resolves to one of the following roles:
 * - `'none'`: If there is no active session or the session data is null.
 * - `'user'`: If the user is authenticated but does not have an admin role.
 * - `'admin'`: If the user is authenticated and has an admin role.
 *
 * The function uses the `authClient` to fetch the current session and determines
 * the user's role based on the session data.
 */
export async function getUserRole(): Promise<'none' | 'user' | 'admin'> {
    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers(),
        },
    });

    switch (session?.user?.role) {
        case 'user':
            return 'user';
        case 'admin':
            return 'admin';
        default:
            return 'none';
    }
}
