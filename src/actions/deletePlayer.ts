'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { getCurrentUser } from '@/lib/authServer';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import emailVerificationService from '@/services/EmailVerification';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';
import { AuthUserSummary } from '@/types/AuthUser';

/**
 * Perform pre-deletion cleanup for a player-associated authenticated user.
 *
 * This function:
 * 1. Marks the player's account as finished.
 * 2. Deletes dependent records (extra emails, email verifications, club
 *    supporters, country supporters) in parallel.
 * 3. Anonymises the player record so that DB operations can complete before the
 *    auth user is deleted.
 *
 * The ordering ensures dependent records are removed and the player is
 * anonymised while the auth user remains valid for any remaining DB operations.
 *
 * @param user - Summary of the authenticated user; must include playerId.
 * @returns A Promise that resolves when all cleanup and anonymisation steps
 * complete.
 * @throws Propagates errors thrown by any underlying service calls.
 */
export async function beforeDeletePlayer(user: AuthUserSummary) {
    await playerService.setFinished(user.playerId);

    await Promise.all([
        playerExtraEmailService.deleteAll(user.playerId),
        emailVerificationService.deleteAll(user.playerId),
        clubSupporterService.deleteAll(user.playerId),
        countrySupporterService.deleteAll(user.playerId),
    ]);

    await playerService.anonymise(user.playerId);
}

/**
 * Deletes the currently authenticated user account.
 *
 * Calls the authentication API to remove the current user and provides a
 * callback URL to redirect to '/footy/auth/accountdeleted'. Includes request
 * headers obtained via the local `headers()` helper.
 *
 * @returns A promise that resolves when the delete request completes.
 * @throws {Error} If there is no authenticated user.
 * @throws {Error} Propagates errors thrown by the auth API or header retrieval.
 * @remarks TODO: Delete the user's mugshot from storage if present.
 */
export async function deletePlayer() {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('No authenticated user to delete');
    }

    await auth.api.deleteUser({
        body: { callbackURL: '/footy/auth/accountdeleted' },
        headers: await headers(),
    });
}
