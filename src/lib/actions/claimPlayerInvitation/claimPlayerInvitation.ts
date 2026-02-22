import 'server-only';

import { sendEmailVerificationCore } from '@/lib/actions/verifyEmail';
import {
    AuthError,
    ConflictError,
    NotFoundError,
    ValidationError,
} from '@/lib/errors';
import authService from '@/services/Auth';
import emailVerificationService from '@/services/EmailVerification';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';

interface ClaimPlayerInvitationDeps {
    authService: Pick<typeof authService, 'getSessionUser' | 'updateCurrentUser'>;
    emailVerificationService: Pick<typeof emailVerificationService, 'getByToken' | 'markUsed'>;
    playerService: Pick<typeof playerService, 'getById' | 'update'>;
    playerExtraEmailService: Pick<typeof playerExtraEmailService, 'getAll' | 'getByEmail'>;
    sendEmailVerificationCore: typeof sendEmailVerificationCore;
}

const defaultDeps: ClaimPlayerInvitationDeps = {
    authService,
    emailVerificationService,
    playerService,
    playerExtraEmailService,
    sendEmailVerificationCore,
};

/**
 * Retrieves and validates an invitation by its token.
 *
 * @param token - The invitation token to validate.
 * @param deps - The dependencies providing access to invitation and player
 * email services.
 * @returns The valid invitation object associated with the provided token.
 * @throws If the token is missing, the invitation is not found, expired,
 * already used, lacks a player reference, or the email is already associated
 * with a different player.
 */
async function getValidInvitation(token: string, deps: ClaimPlayerInvitationDeps) {
    if (!token) {
        throw new ValidationError('Missing invitation token.');
    }

    const invitation = await deps.emailVerificationService.getByToken(token);

    if (!invitation) {
        throw new NotFoundError('Invitation not found or expired.');
    }

    if (invitation.usedAt) {
        throw new ConflictError('Invitation has already been used.');
    }
    if (invitation.expiresAt <= new Date()) {
        throw new ConflictError('Invitation has expired.');
    }

    if (!invitation.playerId) {
        throw new ValidationError('Invitation is missing a player reference.');
    }

    const existingExtraEmail = await deps.playerExtraEmailService.getByEmail(invitation.email);
    if (existingExtraEmail && existingExtraEmail.playerId !== invitation.playerId) {
        throw new ConflictError('Email address already belongs to another player.');
    }

    return invitation;
}

/**
 * Claims a player invitation using the provided token and returns essential
 * player information.
 *
 * Validates the invitation token, ensures the invitation includes a `playerId`,
 * retrieves the corresponding player, and returns a summary payload containing
 * the player's name, the invitation email, and the original token.
 *
 * @param token - The invitation token to validate and claim.
 * @param deps - Optional dependencies required for validation and data
 * retrieval. Defaults to `defaultDeps`.
 * @returns An object containing:
 * - `name`: The player's display name.
 * - `email`: The email address associated with the invitation.
 * - `token`: The original invitation token passed in.
 *
 * @throws {Error} If the invitation is missing a `playerId`.
 * @throws {Error} If no player exists for the given `playerId`.
 * @throws {Error} Propagates errors from invitation validation (e.g., invalid
 * or expired token).
 */
export async function claimPlayerInvitationCore(
    token: string,
    deps: ClaimPlayerInvitationDeps = defaultDeps,
) {
    const invitation = await getValidInvitation(token, deps);

    if (!invitation.playerId) {
        throw new ValidationError('Player ID is missing from invitation.');
    }

    const player = await deps.playerService.getById(invitation.playerId);

    if (!player) {
        throw new NotFoundError('Player not found.');
    }

    return {
        name: player.name,
        email: invitation.email,
        token,
    };
}

/**
 * Finalizes the claim of a player invitation by linking the current user's
 * account to the player.
 *
 * This function performs the following operations:
 * 1. Validates the invitation token
 * 2. Verifies the session user exists and their email matches the invitation
 * 3. Ensures the user account is not already linked to a different player
 * 4. Links the current user to the player
 * 5. Updates the player with the account email
 * 6. Marks the invitation token as used
 * 7. Sends verification emails for any unverified extra emails associated with
 *    the player
 *
 * @param token - The invitation token to validate and process
 * @param deps - Optional dependencies object containing services for auth,
 * player management, email verification, and email sending. Uses default
 * dependencies if not provided.
 *
 * @throws {Error} If the invitation is invalid or the player ID is missing
 * @throws {Error} If no session user is found or the user email/ID is missing
 * @throws {Error} If the session user's email does not match the invitation
 * email
 * @throws {Error} If the session user account is already linked to a different
 * player
 *
 * @returns A promise that resolves when the invitation claim process is
 * complete
 */
export async function finalizePlayerInvitationClaimCore(
    token: string,
    deps: ClaimPlayerInvitationDeps = defaultDeps,
) {
    const invitation = await getValidInvitation(token, deps);

    if (!invitation.playerId) {
        throw new ValidationError('Player ID is missing from invitation.');
    }

    const sessionUser = await deps.authService.getSessionUser();

    if (!sessionUser?.id || !sessionUser.email) {
        throw new AuthError('Login account not found for invitation.');
    }

    if (sessionUser.email.toLowerCase() !== invitation.email.toLowerCase()) {
        throw new AuthError('Login account email does not match invitation.');
    }

    if (sessionUser.playerId && sessionUser.playerId !== invitation.playerId) {
        throw new ConflictError('Login account is already linked to another player.');
    }

    await deps.authService.updateCurrentUser({ playerId: invitation.playerId });
    await deps.playerService.update({
        id: invitation.playerId,
        accountEmail: invitation.email,
    });
    await deps.emailVerificationService.markUsed(token);

    const extraEmails = await deps.playerExtraEmailService.getAll(invitation.playerId);
    const unverifiedExtraEmails = extraEmails.filter((extraEmail) => !extraEmail.verifiedAt);
    const player = await deps.playerService.getById(invitation.playerId);

    await Promise.all(
        unverifiedExtraEmails.map((extraEmail) =>
            deps.sendEmailVerificationCore(extraEmail.email, player ?? undefined),
        ),
    );
}
