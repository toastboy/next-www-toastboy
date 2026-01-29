import 'server-only';

import { getPublicBaseUrl } from '@/lib/urls';
import { createVerificationToken } from '@/lib/verificationToken';
import emailVerificationService from '@/services/EmailVerification';
import playerService from '@/services/Player';
import type { CreatePlayerInput } from '@/types/actions/CreatePlayer';

interface CreatePlayerDeps {
    playerService: Pick<typeof playerService, 'create'>;
    emailVerificationService: Pick<typeof emailVerificationService, 'create'>;
}

const defaultDeps: CreatePlayerDeps = {
    playerService,
    emailVerificationService,
};

/**
 * Generates a player invite verification token, optionally sends a verification
 * email, and returns a URL for the player to claim their invite.
 *
 * @param playerId - The unique identifier of the player to invite.
 * @param email - Optional email address to send the verification invite to.
 * @param deps - Optional dependencies for creating the player invite, defaults
 * to `defaultDeps`.
 * @returns A URL string for the player to verify and claim their invite.
 */
export async function addPlayerInviteCore(
    playerId: number,
    email?: string,
    deps: CreatePlayerDeps = defaultDeps,
) {
    const { token, expiresAt } = createVerificationToken();

    if (email && email.length > 0) {
        await deps.emailVerificationService.create({
            playerId,
            email,
            token,
            expiresAt,
        });
    }

    return new URL(
        `/api/footy/auth/verify/player-invite/${token}?redirect=/footy/auth/claim`,
        getPublicBaseUrl(),
    ).toString();
}

/**
 * Creates a new player using the provided input data and dependencies.
 *
 * This function trims and validates the input fields, converts the introducer
 * to a number if present, and normalizes the email address. It then creates a
 * player record via the injected player service, and generates an invite link
 * for the newly created player.
 *
 * @param data - The input data required to create a player.
 * @param deps - Optional dependencies for player creation. Defaults to
 * `defaultDeps`.
 * @returns An object containing the created player and an invite link.
 * @throws Error if the introducer is provided but is not a valid number.
 */
export async function createPlayerCore(
    data: CreatePlayerInput,
    deps: CreatePlayerDeps = defaultDeps,
) {
    const name = data.name.trim();
    const introducedBy = data.introducedBy.trim();
    const introducedById = introducedBy ? Number(introducedBy) : null;
    const accountEmail = data.email?.trim() ? data.email.trim().toLowerCase() : null;

    if (introducedBy && Number.isNaN(introducedById)) {
        throw new Error('Introducer must be a number.');
    }

    const player = await deps.playerService.create({
        name,
        introducedBy: introducedById,
        joined: new Date(),
        accountEmail,
    });

    return {
        player,
        inviteLink: await addPlayerInviteCore(player.id, data.email, deps),
    };
}
