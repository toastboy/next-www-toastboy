import debug from 'debug';
import prisma from 'prisma/prisma';

const log = debug('footy:auth');

class AuthService {
    /**
     * Retrieves an auth user by email.
     * @param email The user email to look up
     * @returns A promise that resolves to the user or null if not found
     */
    async getUserByEmail(email: string) {
        try {
            return await prisma.user.findUnique({
                where: {
                    email,
                },
            });
        } catch (error) {
            log(`Error fetching auth user: ${String(error)}`);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;
