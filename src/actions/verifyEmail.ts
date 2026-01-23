'use server';

import type { PlayerType } from 'prisma/zod/schemas/models/Player.schema';

import { sendEmailVerificationCore, verifyEmailCore } from '@/lib/actions/verifyEmail';

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
    return await verifyEmailCore(token);
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
    await sendEmailVerificationCore(email, player);
}
