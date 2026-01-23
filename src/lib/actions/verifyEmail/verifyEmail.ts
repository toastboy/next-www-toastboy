import 'server-only';

import type { PlayerType } from 'prisma/zod/schemas/models/Player.schema';

import { sendEmailCore } from '@/lib/actions/sendEmail';
import { getPublicBaseUrl } from '@/lib/urls';
import { createVerificationToken } from '@/lib/verificationToken';
import emailVerificationService from '@/services/EmailVerification';
import playerExtraEmailService from '@/services/PlayerExtraEmail';

interface VerifyEmailDeps {
    emailVerificationService: Pick<typeof emailVerificationService, 'create' | 'getByToken' | 'markUsed'>;
    playerExtraEmailService: Pick<typeof playerExtraEmailService, 'getByEmail' | 'upsert'>;
    sendEmailCore: typeof sendEmailCore;
}

const defaultDeps: VerifyEmailDeps = {
    emailVerificationService,
    playerExtraEmailService,
    sendEmailCore,
};

/**
 * Retrieves a valid email verification record by its token.
 *
 * Throws an error if:
 * - The token is missing.
 * - The verification record does not exist or is expired.
 * - The verification has already been used.
 * - The verification has expired.
 *
 * @param token - The email verification token to validate.
 * @param deps - The dependencies required for verification, including the email
 * verification service.
 * @returns The valid email verification record.
 * @throws {Error} If the token is missing, not found, expired, or already used.
 */
async function getValidVerification(token: string, deps: VerifyEmailDeps) {
    if (!token) {
        throw new Error('Missing verification token.');
    }

    const verification = await deps.emailVerificationService.getByToken(token);

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
 * Requests email verification for a player's email address.
 *
 * This function normalizes and validates the provided email address, checks if
 * it belongs to the specified player, and ensures it has not already been
 * verified. If validation passes, it creates a verification token and stores
 * the verification request using the provided dependencies. Returns a
 * verification link for the user to complete the email verification process.
 *
 * @param email - The email address to verify.
 * @param playerId - The ID of the player associated with the email address, or
 * undefined if not applicable.
 * @param deps - The dependencies required for email and player verification
 * services.
 * @throws {Error} If the email address is missing, does not belong to the
 * player, or is already verified.
 * @returns An object containing the verification link for the email address.
 */
async function requestPlayerEmailVerification(
    email: string,
    playerId: number | undefined,
    deps: VerifyEmailDeps,
) {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
        throw new Error('Email address is required.');
    }

    if (playerId !== undefined) {
        const existingEmail = await deps.playerExtraEmailService.getByEmail(normalizedEmail);
        if (existingEmail?.playerId !== playerId) {
            throw new Error('Email address does not belong to this player.');
        }

        if (existingEmail.verifiedAt) {
            throw new Error('Email address is already verified.');
        }
    }

    const { token, expiresAt } = createVerificationToken();
    await deps.emailVerificationService.create({
        playerId,
        email: normalizedEmail,
        token,
        expiresAt,
    });

    return {
        verificationLink: new URL(
            `/api/footy/auth/verify/extra-email/${token}?redirect=${encodeURIComponent('/footy/profile')}`,
            getPublicBaseUrl(),
        ).toString(),
    };
}

/**
 * Verifies an email address using a verification token.
 *
 * This function checks the validity of the provided token, ensures the email is
 * not already associated with another player, and marks the verification as
 * used. If successful, it associates the email with the player and returns
 * relevant information.
 *
 * @param token - The email verification token to validate.
 * @param deps - Optional dependencies required for verification. Defaults to
 * `defaultDeps`.
 * @returns An object containing the verified email, player ID, and verification
 * ID.
 * @throws If the verification is missing a player reference or if the email
 * address already belongs to another player.
 */
export async function verifyEmailCore(
    token: string,
    deps: VerifyEmailDeps = defaultDeps,
) {
    const verification = await getValidVerification(token, deps);

    if (!verification.playerId) {
        throw new Error('Verification is missing a player reference.');
    }

    const existingEmail = await deps.playerExtraEmailService.getByEmail(verification.email);
    if (existingEmail && existingEmail.playerId !== verification.playerId) {
        throw new Error('Email address already belongs to another player.');
    }

    await deps.playerExtraEmailService.upsert(verification.playerId, verification.email, true);
    await deps.emailVerificationService.markUsed(token);

    return {
        email: verification.email,
        playerId: verification.playerId?.toString(),
        verificationId: verification.id.toString(),
    };
}

/**
 * Sends an email verification message to the specified email address.
 *
 * This function normalizes the email, requests a verification link, and sends
 * an email containing the link to the user. If a player is provided, their name
 * is included in the greeting.
 *
 * @param email - The email address to send the verification to.
 * @param player - Optional player information to personalize the email.
 * @param deps - Optional dependencies for email sending and verification link
 *               generation. Defaults to `defaultDeps` if not provided.
 * @returns A promise that resolves when the email has been sent, or returns
 * early if the email is empty.
 */
export async function sendEmailVerificationCore(
    email: string,
    player?: PlayerType,
    deps: VerifyEmailDeps = defaultDeps,
) {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
        return;
    }

    const { verificationLink } = await requestPlayerEmailVerification(
        normalizedEmail,
        player?.id,
        deps,
    );

    const html = [
        `<p>Hello${player?.name ? ` ${player.name}` : ''},</p>`,
        '<p>Please verify your email address by clicking the link below:</p>',
        `<p><a href="${verificationLink}">Verify your email</a></p>`,
        '<p>If you did not request this, you can ignore this message.</p>',
    ].join('');

    await deps.sendEmailCore(normalizedEmail, '', 'Verify your email address', html);
}
