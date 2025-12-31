'use server';

import { hashVerificationToken } from '@/lib/verificationToken';
import emailVerificationService from '@/services/EmailVerification';
import playerEmailService from '@/services/PlayerEmail';

/**
 * Validates a verification token by ensuring it exists, has not been used, and
 * has not expired.
 *
 * @param token - The raw verification token provided by the user.
 * @returns The verification record associated with the provided token.
 *
 * @throws {Error} If the token is missing, verification is not found or
 * expired, already used, or expired.
 */
async function getValidVerification(token: string) {
    if (!token) {
        throw new Error('Missing verification token.');
    }

    const tokenHash = hashVerificationToken(token);
    const verification = await emailVerificationService.getByTokenHash(tokenHash);

    if (!verification) {
        throw new Error('Verification not found or expired.');
    }

    if (verification.usedAt) {
        throw new Error('Verification has already been used.');
    }
    if (verification.expiresAt <= new Date()) {
        throw new Error('Verification has expired.');
    }

    return verification;
}

/**
 * Verifies an email token by ensuring the verification record is valid and
 * handling any associated player email updates.
 *
 * @param token - The verification token to validate.
 * @returns An object containing the verification purpose, email, and associated
 * player ID.
 * @throws Error if the token is for the player invite flow, if the verification
 * is missing a player reference, or if the email already belongs to another
 * player.
 */
export async function verifyEmail(token: string) {
    const verification = await getValidVerification(token);

    if (verification.purpose === 'player_invite') {
        throw new Error('Use the invitation flow to claim this token.');
    }

    if (verification.purpose === 'player_email') {
        if (!verification.playerId) {
            throw new Error('Verification is missing a player reference.');
        }

        const existingEmail = await playerEmailService.getByEmail(verification.email);
        if (existingEmail && existingEmail.playerId !== verification.playerId) {
            throw new Error('Email address already belongs to another player.');
        }

        await playerEmailService.upsert(verification.playerId, verification.email, true);
    }

    await emailVerificationService.markUsed(verification.id);

    return {
        purpose: verification.purpose,
        email: verification.email,
        playerId: verification.playerId,
    };
}
