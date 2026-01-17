import 'server-only';

import gameDayService from '@/services/GameDay';

export type InvitationDecision = {
    status: 'ready' | 'skipped';
    reason: 'ready' | 'no-upcoming-game' | 'already-sent' | 'too-early';
    gameDayId?: number;
    gameDate?: Date;
    mailDate?: Date;
    overrideTimeCheck: boolean;
    customMessage?: string | null;
};

const isWorkingDay = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
};

const getMailDate = (gameDate: Date) => {
    const mailDate = new Date(gameDate);
    mailDate.setHours(9, 0, 0, 0);
    mailDate.setDate(mailDate.getDate() - 1);

    while (!isWorkingDay(mailDate)) {
        mailDate.setDate(mailDate.getDate() - 1);
    }

    return mailDate;
};

export async function getInvitationDecision({
    overrideTimeCheck,
    customMessage,
}: {
    overrideTimeCheck: boolean;
    customMessage?: string | null;
}): Promise<InvitationDecision> {
    const upcomingGame = await gameDayService.getUpcoming();

    if (!upcomingGame) {
        return {
            status: 'skipped',
            reason: 'no-upcoming-game',
            overrideTimeCheck,
            customMessage,
        };
    }

    if (upcomingGame.mailSent) {
        return {
            status: 'skipped',
            reason: 'already-sent',
            gameDayId: upcomingGame.id,
            gameDate: upcomingGame.date,
            overrideTimeCheck,
            customMessage,
        };
    }

    const mailDate = getMailDate(upcomingGame.date);
    const shouldSend = overrideTimeCheck || new Date() >= mailDate;

    return {
        status: shouldSend ? 'ready' : 'skipped',
        reason: shouldSend ? 'ready' : 'too-early',
        gameDayId: upcomingGame.id,
        gameDate: upcomingGame.date,
        mailDate,
        overrideTimeCheck,
        customMessage,
    };
}
