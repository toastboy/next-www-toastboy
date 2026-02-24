import 'server-only';

import crypto from 'crypto';
import escapeHtml from 'escape-html';

import { sendEmail } from '@/actions/sendEmail';
import { NotFoundError } from '@/lib/errors';
import { getPublicBaseUrl } from '@/lib/urls';
import gameDayService from '@/services/GameDay';
import gameInvitationService from '@/services/GameInvitation';
import outcomeService from '@/services/Outcome';
import playerService from '@/services/Player';
import { GameInvitationResponseDetails } from '@/types/GameInvitationResponseDetails';

const buildInvitationToken = () => crypto.randomUUID();

const normalizeEmail = (email?: string | null) => (email ?? '').trim().toLowerCase();

/**
 * Builds an HTML email invitation for a game.
 *
 * @param params - The invitation parameters
 * @param params.playerName - The name of the player being invited
 * @param params.inviteLink - The URL link for the player to respond to the
 * invitation
 * @param params.gameDate - The date of the game
 * @param params.customMessage - Optional custom message to include in the email
 * @returns An HTML string containing the formatted email invitation
 *
 * @remarks
 * The function escapes all HTML content to prevent injection attacks. The
 * returned HTML includes inline styles for better email client compatibility.
 */
export const buildInvitationEmail = ({
    playerName,
    inviteLink,
    gameDate,
    customMessage,
}: {
    playerName: string;
    inviteLink: string;
    gameDate: Date;
    customMessage?: string | null;
}) => {
    const safeName = escapeHtml(playerName);
    const safeMessage = customMessage ? escapeHtml(customMessage) : '';
    const safeLink = escapeHtml(inviteLink);
    const safeDate = escapeHtml(gameDate.toDateString());

    return [
        '<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;">',
        `<p>Hello ${safeName},</p>`,
        `<p>The next Toastboy FC game is on ${safeDate}.</p>`,
        safeMessage ? `<p>${safeMessage}</p>` : '',
        `<p>Please respond here: <a href="${safeLink}">submit your response</a></p>`,
        '<p>You can change it later if you need to, even if the teams have been picked - either by clicking ',
        'on the link in the email you received, or by logging in to the site at the game page.</p>',
        '<p>Cheers,<br />Jon</p>',
        '</div>',
    ].filter(Boolean).join('');
};

/**
 * Sends game invitations to all active players for a specific game day.
 *
 * This function retrieves the game day details, filters active players, clears existing invitations,
 * and sends email invitations to each player with a unique token. Each player receives an invitation
 * at all their registered email addresses (account email and extra emails).
 *
 * @param params - The parameters for sending invitations
 * @param params.gameDayId - The ID of the game day for which invitations are being sent
 * @param params.customMessage - Optional custom message to include in the invitation email
 *
 * @throws {Error} If the game day with the specified ID is not found
 *
 * @returns A promise that resolves when all invitations have been sent and the game day is marked as mail sent
 *
 * @remarks
 * - This function deletes all existing game invitations before creating new ones
 * - Players with no valid email addresses are skipped
 * - Duplicate email addresses for the same player are automatically removed
 * - All emails are normalized before sending
 * - A unique invitation token is generated for each player to track responses
 */
export async function sendGameInvitations(
    gameDayId: number,
    customMessage?: string,
) {
    const gameDay = await gameDayService.get(gameDayId);
    if (!gameDay) {
        throw new NotFoundError('Game day not found.', {
            details: { gameDayId },
            publicMessage: 'Game day not found.',
        });
    }

    const players = await playerService.getAll();
    const activePlayers = players.filter((player) => !player.finished);

    await gameInvitationService.deleteAll();

    const baseUrl = getPublicBaseUrl();
    const sendAt = new Date();

    const invitations: { uuid: string; playerId: number; gameDayId: number }[] = [];
    const emailTasks = activePlayers.map(async (player) => {
        const emails = [
            player.accountEmail,
            ...player.extraEmails.map((extraEmail) => extraEmail.email),
        ]
            .map(normalizeEmail)
            .filter((email) => email.length > 0);

        const uniqueEmails = Array.from(new Set(emails));
        if (uniqueEmails.length === 0) {
            return null;
        }

        const token = buildInvitationToken();
        invitations.push({
            uuid: token,
            playerId: player.id,
            gameDayId,
        });

        const inviteLink = `${baseUrl}/api/footy/response/${encodeURIComponent(token)}`;
        const html = buildInvitationEmail({
            playerName: playerService.getName(player),
            inviteLink,
            gameDate: gameDay.date,
            customMessage,
        });

        await sendEmail({
            to: uniqueEmails.join(','),
            subject: 'Toastboy FC invitation',
            html,
        });
        return token;
    });

    if (invitations.length > 0) {
        await gameInvitationService.createMany(invitations);
    }
    await Promise.all(emailTasks);
    await gameDayService.markMailSent(gameDayId, sendAt);
}

export async function getGameInvitationResponseDetails(token: string): Promise<GameInvitationResponseDetails | null> {
    if (!token) return null;

    const invitation = await gameInvitationService.get(token);
    if (!invitation) return null;

    const player = await playerService.getById(invitation.playerId);
    if (!player) return null;

    const playerLogin = await playerService.getLogin(player.id.toString());
    const outcome = await outcomeService.get(invitation.gameDayId, invitation.playerId);

    return {
        token,
        playerId: player.id,
        playerName: playerService.getName(player),
        playerLogin,
        gameDayId: invitation.gameDayId,
        response: outcome?.response ?? null,
        goalie: outcome?.goalie ?? false,
        comment: outcome?.comment ?? null,
    };
}
