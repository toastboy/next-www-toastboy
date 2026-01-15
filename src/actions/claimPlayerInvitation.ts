'use server';

import { sendEmailVerification } from '@/actions/verifyEmail';
import authService from '@/services/Auth';
import emailVerificationService from '@/services/EmailVerification';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';

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

    const invitation = await emailVerificationService.getByToken(token);

    if (!invitation) {
        throw new Error('Invitation not found or expired.');
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

    const existingExtraEmail = await playerExtraEmailService.getByEmail(invitation.email);
    if (existingExtraEmail && existingExtraEmail.playerId !== invitation.playerId) {
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
        name: player.name,
        email: invitation.email,
        token,
    };
}

/**
 * Finalizes the claim of a player invitation by validating the invitation,
 * ensuring the associated login account exists, and linking it to the player
 * before marking the invitation used.
 *
 * @param token - The invitation token used to fetch and validate the invitation.
 * @throws Error if the invitation lacks a player ID or if the login account cannot be found.
 */
export async function finalizePlayerInvitationClaim(token: string) {
    const invitation = await getValidInvitation(token);

    if (!invitation.playerId) {
        throw new Error('Player ID is missing from invitation.');
    }

    const sessionUser = await authService.getSessionUser();

    if (!sessionUser?.id || !sessionUser.email) {
        throw new Error('Login account not found for invitation.');
    }

    if (sessionUser.email.toLowerCase() !== invitation.email.toLowerCase()) {
        throw new Error('Login account email does not match invitation.');
    }

    if (sessionUser.playerId && sessionUser.playerId !== invitation.playerId) {
        throw new Error('Login account is already linked to another player.');
    }

    await authService.updateCurrentUser({ playerId: invitation.playerId });
    await playerService.update({
        id: invitation.playerId,
        accountEmail: invitation.email,
    });
    await emailVerificationService.markUsed(token);

    // For players coming from the original site, if they have unverified extra
    // emails, send verification emails for those as well.
    const extraEmails = await playerExtraEmailService.getAll(invitation.playerId);
    const unverifiedExtraEmails = extraEmails.filter((extraEmail) => !extraEmail.verifiedAt);
    const player = await playerService.getById(invitation.playerId);
    await Promise.all(
        unverifiedExtraEmails.map((extraEmail) => sendEmailVerification(extraEmail.email, player ?? undefined)),
    );
}
