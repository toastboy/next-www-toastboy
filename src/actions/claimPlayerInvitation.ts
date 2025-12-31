'use server';

import { hashVerificationToken } from '@/lib/verificationToken';
import authService from '@/services/Auth';
import emailVerificationService from '@/services/EmailVerification';
import playerService from '@/services/Player';
import playerEmailService from '@/services/PlayerEmail';

/**
 * Retrieves and validates a player invitation associated with the provided
 * token.
 *
 * @param token - The invitation token to validate.
 * @returns The verified invitation record.
 * @throws Error if the token is missing, invalid, expired, already used, lacks
 * a player reference, or the associated email belongs to another player.
 */
async function getValidInvitation(token: string) {
    if (!token) {
        throw new Error('Missing invitation token.');
    }

    const tokenHash = hashVerificationToken(token);
    const invitation = await emailVerificationService.getByTokenHash(tokenHash);

    if (!invitation) {
        throw new Error('Invitation not found or expired.');
    }

    if (invitation.purpose !== 'player_invite') {
        throw new Error('Invalid invitation token.');
    }

    if (invitation.usedAt) {
        throw new Error('Invitation has already been used.');
    }
    if (invitation.expiresAt <= new Date()) {
        throw new Error('Invitation has expired.');
    }

    if (!invitation.playerId) {
        throw new Error('Invitation is missing a player reference.');
    }

    const existingEmail = await playerEmailService.getByEmail(invitation.email);
    if (existingEmail && existingEmail.playerId !== invitation.playerId) {
        throw new Error('Email address already belongs to another player.');
    }

    return invitation;
}

/**
 * Claims a player invitation using the provided token.
 *
 * @param token - The invitation token to validate and process.
 * @returns An object containing the invited player and the associated email
 * address.
 * @throws Will throw an error if the invitation is invalid, missing a player
 * ID, or if the player cannot be found.
 */
export async function claimPlayerInvitation(token: string) {
    const invitation = await getValidInvitation(token);

    if (!invitation.playerId) {
        throw new Error('Player ID is missing from invitation.');
    }

    const player = await playerService.getById(invitation.playerId);

    if (!player) {
        throw new Error('Player not found.');
    }

    return {
        player: player,
        email: invitation.email,
    };
}

/**
 * Finalizes the claim of a player invitation by validating the invitation,
 * ensuring the associated login account exists, and updating the player's email
 * and invitation status accordingly.
 *
 * @param token - The invitation token used to fetch and validate the invitation.
 * @throws Error if the invitation lacks a player ID or if the login account cannot be found.
 */
export async function finalizePlayerInvitationClaim(token: string) {
    const invitation = await getValidInvitation(token);

    if (!invitation.playerId) {
        throw new Error('Player ID is missing from invitation.');
    }

    const loginAccount = await authService.getUserByEmail(invitation.email);

    if (!loginAccount) {
        throw new Error('Login account not found for invitation.');
    }

    await playerEmailService.upsert(invitation.playerId, invitation.email, true);
    await emailVerificationService.markUsed(invitation.id);
}
