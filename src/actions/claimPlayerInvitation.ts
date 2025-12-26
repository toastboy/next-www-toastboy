'use server';

import { hashPlayerInvitationToken } from '@/lib/playerInvitation';
import playerService from '@/services/Player';

/**
 * Claims a player invitation using a plaintext token.
 *
 * Validates the token, resolves the invitation from its hashed token, checks
 * usage and expiration, enforces email ownership rules, then marks the
 * invitation as used and records the verified email for the player.
 *
 * @param token - The raw invitation token provided to the player.
 * @returns A promise that resolves with the invitation claim result:
 *          { player, email }.
 *
 * @throws Error If:
 * - Missing invitation token.
 * - Invitation not found or expired (no invitation matching the token hash).
 * - Invitation has already been used.
 * - Invitation has expired.
 * - Email address already belongs to another player.
 *
 * @remarks
 * - The token is hashed via `hashPlayerInvitationToken` before lookup.
 * - The invitation is retrieved with `playerService.getPlayerInvitationByTokenHash`.
 * - Email uniqueness is checked via `playerService.getPlayerEmailByEmail`; if an
 *   existing email belongs to a different player, the claim is rejected.
 * - On success, the invitation is marked used and a verified player email is
 *   upserted with the current timestamp.
 */
export async function claimPlayerInvitation(token: string) {
    if (!token) {
        throw new Error('Missing invitation token.');
    }

    const tokenHash = hashPlayerInvitationToken(token);
    const invitation = await playerService.getPlayerInvitationByTokenHash(tokenHash);

    if (!invitation) {
        throw new Error('Invitation not found or expired.');
    }

    const now = new Date();
    if (invitation.usedAt) {
        throw new Error('Invitation has already been used.');
    }
    if (invitation.expiresAt <= now) {
        throw new Error('Invitation has expired.');
    }

    const existingEmail = await playerService.getPlayerEmailByEmail(invitation.email);
    if (existingEmail && existingEmail.playerId !== invitation.playerId) {
        throw new Error('Email address already belongs to another player.');
    }

    // TODO: Only mark as used and verify email within a transaction (check what this means!)
    // TODO: Only mark the invitation as used once the login account has been successfully created
    await playerService.markPlayerInvitationUsed(invitation.id, now);
    await playerService.upsertVerifiedPlayerEmail(invitation.playerId, invitation.email, now);

    const player = await playerService.getById(invitation.playerId);

    if (!player) {
        throw new Error('Player not found.');
    }

    return {
        player: player,
        email: invitation.email,
    };
}
