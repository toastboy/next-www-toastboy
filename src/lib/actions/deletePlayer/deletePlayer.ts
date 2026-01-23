import 'server-only';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { getCurrentUser } from '@/lib/authServer';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import emailVerificationService from '@/services/EmailVerification';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';
import type { AuthUserSummary } from '@/types/AuthUser';

interface DeletePlayerDeps {
    auth: typeof auth;
    headers: typeof headers;
    getCurrentUser: typeof getCurrentUser;
    playerService: Pick<typeof playerService, 'anonymise' | 'setFinished'>;
    playerExtraEmailService: Pick<typeof playerExtraEmailService, 'deleteAll'>;
    emailVerificationService: Pick<typeof emailVerificationService, 'deleteAll'>;
    clubSupporterService: Pick<typeof clubSupporterService, 'deleteAll'>;
    countrySupporterService: Pick<typeof countrySupporterService, 'deleteAll'>;
}

const defaultDeps: DeletePlayerDeps = {
    auth,
    headers,
    getCurrentUser,
    playerService,
    playerExtraEmailService,
    emailVerificationService,
    clubSupporterService,
    countrySupporterService,
};

/**
 * Performs pre-deletion operations for a player, including marking the player
 * as finished, deleting related email and supporter records, and anonymising
 * the player's data.
 *
 * @param user - The authenticated user summary containing the player's ID.
 * @param deps - Optional dependencies required for player deletion. Defaults to
 * `defaultDeps`.
 * @returns A promise that resolves when all pre-deletion operations are
 * complete.
 */
export async function beforeDeletePlayerCore(
    user: AuthUserSummary,
    deps: DeletePlayerDeps = defaultDeps,
) {
    await deps.playerService.setFinished(user.playerId);

    await Promise.all([
        deps.playerExtraEmailService.deleteAll(user.playerId),
        deps.emailVerificationService.deleteAll(user.playerId),
        deps.clubSupporterService.deleteAll(user.playerId),
        deps.countrySupporterService.deleteAll(user.playerId),
    ]);

    await deps.playerService.anonymise(user.playerId);
}

/**
 * Deletes the currently authenticated user by invoking the authentication API.
 *
 * @param deps - Dependencies required for deleting the user. If not provided,
 * defaults are used.
 * @throws {Error} If there is no authenticated user to delete.
 * @returns {Promise<void>} Resolves when the user has been deleted.
 */
export async function deletePlayerCore(deps: DeletePlayerDeps = defaultDeps) {
    const user = await deps.getCurrentUser();

    if (!user) {
        throw new Error('No authenticated user to delete');
    }

    await deps.auth.api.deleteUser({
        body: { callbackURL: '/footy/auth/accountdeleted' },
        headers: await deps.headers(),
    });
}
