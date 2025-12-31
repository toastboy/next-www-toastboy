'use server';

import { getSecrets } from '@/lib/secrets';
import { createVerificationToken } from '@/lib/verificationToken';
import emailVerificationService from '@/services/EmailVerification';
import playerEmailService from '@/services/PlayerEmail';

/**
 * Initiates the email verification process for a player.
 *
 * @param playerId - The identifier of the player whose email is being verified.
 * @param email - The email address to verify; it will be trimmed before
 * validation.
 * @throws Error if the normalized email is empty, does not belong to the
 * player, or is already verified.
 * @returns An object containing the verification link ready to be sent to the
 * player.
 */
export async function requestPlayerEmailVerification(playerId: number, email: string) {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
        throw new Error('Email address is required.');
    }

    const existingEmail = await playerEmailService.getByEmail(normalizedEmail);
    if (existingEmail?.playerId !== playerId) {
        throw new Error('Email address does not belong to this player.');
    }

    if (existingEmail.verifiedAt) {
        throw new Error('Email address is already verified.');
    }

    const { token, tokenHash, expiresAt } = createVerificationToken();
    await emailVerificationService.create({
        playerId,
        email: normalizedEmail,
        tokenHash,
        expiresAt,
        purpose: 'player_email',
    });

    const secrets = getSecrets();

    return {
        verificationLink: `${secrets.BETTER_AUTH_URL}/footy/auth/verify?token=${token}`,
    };
}
