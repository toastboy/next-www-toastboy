import 'server-only';

import { randomUUID } from 'crypto';
import escapeHtml from 'escape-html';

import { sendEmail } from '@/actions/sendEmail';
import { getPublicBaseUrl } from '@/lib/urls';
import gameDayService from '@/services/GameDay';
import gameInvitationService from '@/services/GameInvitation';
import outcomeService from '@/services/Outcome';
import playerService from '@/services/Player';
import { GameInvitationResponseDetails } from '@/types/GameInvitationResponseDetails';

const buildInvitationToken = () => `{${randomUUID()}}`;

const normalizeEmail = (email?: string | null) => (email ?? '').trim().toLowerCase();

const buildInvitationEmail = ({
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

// TODO: Tests for sendGameInvitations
export async function sendGameInvitations({
    gameDayId,
    customMessage,
}: {
    gameDayId: number;
    customMessage?: string | null;
}) {
    const gameDay = await gameDayService.get(gameDayId);
    if (!gameDay) {
        throw new Error('Game day not found.');
    }

    const players = await playerService.getAll();
    const activePlayers = players.filter((player) => !player.finished);

    await gameInvitationService.deleteAll();

    const baseUrl = getPublicBaseUrl();
    const sendAt = new Date();

    const invitationTasks = activePlayers.map(async (player) => {
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
        await gameInvitationService.create({
            uuid: token,
            playerId: player.id,
            gameDayId,
        });

        const inviteLink = `${baseUrl}/footy/response?token=${encodeURIComponent(token)}`;
        // TODO: Tests for buildInvitationEmail
        const html = buildInvitationEmail({
            playerName: playerService.getName(player),
            inviteLink,
            gameDate: gameDay.date,
            customMessage,
        });

        await sendEmail(uniqueEmails.join(','), '', 'Toastboy FC invitation', html);
        return token;
    });

    await Promise.all(invitationTasks);
    await gameDayService.markMailSent(gameDayId, sendAt);
}

// TODO: Tests for getGameInvitationResponseDetails
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
