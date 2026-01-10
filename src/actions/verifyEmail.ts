'use server';

import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';

import { sendEmail } from '@/actions/sendEmail';
import { getPublicBaseUrl } from '@/lib/urls';
import { createVerificationToken, hashVerificationToken } from '@/lib/verificationToken';
import emailVerificationService from '@/services/EmailVerification';
import playerExtraEmailService from '@/services/PlayerExtraEmail';

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

        const existingEmail = await playerExtraEmailService.getByEmail(verification.email);
        if (existingEmail && existingEmail.playerId !== verification.playerId) {
            throw new Error('Email address already belongs to another player.');
        }

        await playerExtraEmailService.upsert(verification.playerId, verification.email, true);
    }

    await emailVerificationService.markUsed(verification.id);

    return {
        purpose: verification.purpose,
        email: verification.email,
        playerId: verification.playerId,
    };
}

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
async function requestPlayerEmailVerification(email: string, playerId?: number) {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
        throw new Error('Email address is required.');
    }

    if (playerId !== undefined) {
        const existingEmail = await playerExtraEmailService.getByEmail(normalizedEmail);
        if (existingEmail?.playerId !== playerId) {
            throw new Error('Email address does not belong to this player.');
        }

        if (existingEmail.verifiedAt) {
            throw new Error('Email address is already verified.');
        }
    }

    const { token, tokenHash, expiresAt } = createVerificationToken();
    await emailVerificationService.create({
        playerId,
        email: normalizedEmail,
        tokenHash,
        expiresAt,
        purpose: playerId !== undefined ? 'player_email' : 'contact_form',
    });

    return {
        verificationLink: new URL(`/api/footy/auth/verify?token=${token}`, getPublicBaseUrl()).toString(),
    };
}

/**
 * Sends an email verification message to the specified address.
 *
 * @param email - The email address to verify. Leading and trailing whitespace
 * will be trimmed.
 * @param player - Optional player context used to personalize the message and
 * include the player ID for verification.
 * @remarks
 * The function returns early if the normalized email is empty. It first
 * requests a verification link for the normalized email (and player if
 * provided), then constructs a simple HTML message and sends it via
 * `sendEmail`.
 */
export async function sendEmailVerification(email: string, player?: PlayerType) {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
        return;
    }

    const { verificationLink } = await requestPlayerEmailVerification(
        normalizedEmail,
        player?.id,
    );

    const html = [
        `<p>Hello${player?.name ? ` ${player.name}` : ''},</p>`,
        '<p>Please verify your email address by clicking the link below:</p>',
        `<p><a href="${verificationLink}">Verify your email</a></p>`,
        '<p>If you did not request this, you can ignore this message.</p>',
    ].join('');

    await sendEmail(normalizedEmail, '', 'Verify your email address', html);
};
