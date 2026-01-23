'use server';

import { claimPlayerInvitationCore, finalizePlayerInvitationClaimCore } from '@/lib/actions/claimPlayerInvitation';

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
    return await claimPlayerInvitationCore(token);
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
    await finalizePlayerInvitationClaimCore(token);
}
