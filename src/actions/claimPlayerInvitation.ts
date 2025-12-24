'use server';

import { hashPlayerInvitationToken } from '@/lib/playerInvitation';
import playerService from '@/services/Player';

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

    await playerService.markPlayerInvitationUsed(invitation.id, now);
    await playerService.upsertVerifiedPlayerEmail(invitation.playerId, invitation.email, now);

    return {
        playerId: invitation.playerId,
        email: invitation.email,
    };
}
