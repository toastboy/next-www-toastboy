import 'server-only';

import { z } from 'zod';

import { sendEmailVerificationCore } from '@/lib/actions/verifyEmail';
import { AuthError } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import authService from '@/services/Auth';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';
import type { UpdatePlayerInput } from '@/types/actions/UpdatePlayer';

interface UpdatePlayerDeps {
    authService: Pick<typeof authService, 'getSessionUser' | 'changeCurrentUserEmail'>;
    playerService: Pick<typeof playerService, 'update'>;
    playerExtraEmailService: Pick<typeof playerExtraEmailService, 'create' | 'delete'>;
    clubSupporterService: Pick<typeof clubSupporterService, 'deleteExcept' | 'upsertAll'>;
    countrySupporterService: Pick<typeof countrySupporterService, 'deleteExcept' | 'upsertAll'>;
    sendEmailVerificationCore: typeof sendEmailVerificationCore;
}

const defaultDeps: UpdatePlayerDeps = {
    authService,
    playerService,
    playerExtraEmailService,
    clubSupporterService,
    countrySupporterService,
    sendEmailVerificationCore,
};

const accountEmailSchema = z.email().trim().toLowerCase();

/**
 * Updates a player's core information and related entities such as extra
 * emails, clubs, and countries.
 *
 * This function performs the following operations:
 * - Validates that the authenticated user is linked to the target player.
 * - Requests a Better Auth main-account email change if needed.
 * - Updates the player's basic information.
 * - Adds new extra emails and sends verification emails.
 * - Removes specified extra emails.
 * - Updates the player's club supporter associations.
 * - Updates the player's country supporter associations.
 *
 * @param playerId - The unique identifier of the player to update.
 * @param data - The input data containing updated player information, extra
 * emails, clubs, and countries.
 * @param deps - Optional dependencies for services used in the update process.
 * Defaults to `defaultDeps`.
 * @returns The updated player object.
 */
export async function updatePlayerCore(
    playerId: number,
    data: UpdatePlayerInput,
    deps: UpdatePlayerDeps = defaultDeps,
) {
    const { addedExtraEmails, removedExtraEmails, clubs, countries } = data;
    const sessionUser = await deps.authService.getSessionUser();

    if (!sessionUser?.id || !sessionUser.email) {
        throw new AuthError('Login account not found for profile update.');
    }

    if (!sessionUser.playerId || sessionUser.playerId !== playerId) {
        throw new AuthError('You are not authorized to edit this player profile.');
    }

    const sessionEmail = sessionUser.email.trim().toLowerCase();
    const requestedAccountEmail = accountEmailSchema.parse(data.accountEmail);

    if (requestedAccountEmail !== sessionEmail) {
        await deps.authService.changeCurrentUserEmail({
            newEmail: requestedAccountEmail,
            callbackURL: '/footy/profile',
        });
    }

    const refreshedSessionUser = requestedAccountEmail !== sessionEmail ?
        await deps.authService.getSessionUser() :
        sessionUser;
    const accountEmail = refreshedSessionUser?.email?.trim().toLowerCase() ?? sessionEmail;

    const player = await deps.playerService.update({
        id: playerId,
        accountEmail,
        anonymous: data.anonymous,
        goalie: data.goalie,
        name: data.name,
        born: data.born,
        comment: data.comment,
        finished: data.finished ?? null,
    });

    const addedEmailResults = await Promise.allSettled(
        addedExtraEmails.map(async (addedEmail) => {
            await deps.playerExtraEmailService.create({
                playerId,
                email: addedEmail,
            });
            await deps.sendEmailVerificationCore(addedEmail, player);
        }),
    );
    for (const [index, result] of addedEmailResults.entries()) {
        if (result.status === 'rejected') {
            const failedEmail = addedExtraEmails[index];
            captureUnexpectedError(result.reason, {
                layer: 'server-action',
                action: 'updatePlayerCore.sendVerificationEmail',
                extra: {
                    playerId,
                    email: failedEmail,
                },
            });
        }
    }

    const removedEmailResults = await Promise.allSettled(
        removedExtraEmails.map(async (removedEmail) => {
            await deps.playerExtraEmailService.delete(removedEmail);
        }),
    );
    for (const [index, result] of removedEmailResults.entries()) {
        if (result.status === 'rejected') {
            const failedEmail = removedExtraEmails[index];
            captureUnexpectedError(result.reason, {
                layer: 'server-action',
                action: 'updatePlayerCore.removeExtraEmail',
                extra: {
                    playerId,
                    email: failedEmail,
                },
            });
        }
    }

    await deps.clubSupporterService.deleteExcept(playerId, clubs);
    await deps.clubSupporterService.upsertAll(playerId, clubs);

    await deps.countrySupporterService.deleteExcept(playerId, countries);
    await deps.countrySupporterService.upsertAll(playerId, countries);

    return player;
}
