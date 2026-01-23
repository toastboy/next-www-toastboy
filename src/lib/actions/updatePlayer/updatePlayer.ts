import 'server-only';

import { sendEmailVerificationCore } from '@/lib/actions/verifyEmail';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';
import type { UpdatePlayerInput } from '@/types/UpdatePlayerInput';

interface UpdatePlayerDeps {
    playerService: Pick<typeof playerService, 'update'>;
    playerExtraEmailService: Pick<typeof playerExtraEmailService, 'create' | 'delete'>;
    clubSupporterService: Pick<typeof clubSupporterService, 'deleteExcept' | 'upsertAll'>;
    countrySupporterService: Pick<typeof countrySupporterService, 'deleteExcept' | 'upsertAll'>;
    sendEmailVerificationCore: typeof sendEmailVerificationCore;
}

const defaultDeps: UpdatePlayerDeps = {
    playerService,
    playerExtraEmailService,
    clubSupporterService,
    countrySupporterService,
    sendEmailVerificationCore,
};

/**
 * Updates a player's core information and related entities such as extra
 * emails, clubs, and countries.
 *
 * This function performs the following operations:
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
    const player = await deps.playerService.update({
        id: playerId,
        anonymous: data.anonymous,
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
            console.error('Error sending verification email to:', failedEmail, result.reason);
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
            console.error('Error removing player extra email:', failedEmail, result.reason);
        }
    }

    await deps.clubSupporterService.deleteExcept(playerId, clubs);
    await deps.clubSupporterService.upsertAll(playerId, clubs);

    await deps.countrySupporterService.deleteExcept(playerId, countries);
    await deps.countrySupporterService.upsertAll(playerId, countries);

    return player;
}
