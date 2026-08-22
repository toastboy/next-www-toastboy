import { IconX } from '@tabler/icons-react';

import type { DownloadMyDataPayload } from '@/components/DownloadMyData/DownloadMyData';
import { DownloadMyData } from '@/components/DownloadMyData/DownloadMyData';
import { StatusNotification } from '@/components/StatusNotification/StatusNotification';
import { getCurrentUser } from '@/lib/auth.server';
import { config } from '@/lib/config';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import outcomeService from '@/services/Outcome';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';
import playerRecordService from '@/services/PlayerRecord';

export const metadata = { title: 'Download My Data' };

const Page = async () => {
    const user = await getCurrentUser();
    const playerId = user?.playerId ?? 0;

    if (!playerId) {
        return (
            <StatusNotification
                icon={<IconX size={config.notificationIconSize} />}
                color="red"
                message="This account is not linked to a player profile yet."
            />
        );
    }

    const [player, extraEmails, countries, clubs, outcomes, playerRecords] =
        await Promise.all([
            playerService.getById(playerId),
            playerExtraEmailService.getAll(playerId),
            countrySupporterService.getByPlayer(playerId),
            clubSupporterService.getByPlayer(playerId),
            outcomeService.getByPlayer(playerId),
            playerRecordService.getByPlayer(playerId, 0),
        ]);

    if (!player) {
        return (
            <StatusNotification
                icon={<IconX size={config.notificationIconSize} />}
                color="red"
                message="Failed to load player data."
            />
        );
    }

    const gamesResponded = outcomes.filter(
        (outcome) => outcome.response !== null,
    );
    const respondedGameDays = gamesResponded.map(
        (outcome) => outcome.gameDayId,
    );
    const gamesPlayed = playerRecords.filter(
        (record) => record.points !== null,
    );
    const playedGameDays = gamesPlayed.map((record) => record.gameDayId);
    const accountEmail =
        (player as { accountEmail?: string | null }).accountEmail ?? null;

    const totals = {
        accountEmail,
        firstResponded:
            respondedGameDays.length > 0
                ? Math.min(...respondedGameDays)
                : null,
        lastResponded:
            respondedGameDays.length > 0
                ? Math.max(...respondedGameDays)
                : null,
        firstPlayed:
            playedGameDays.length > 0 ? Math.min(...playedGameDays) : null,
        lastPlayed:
            playedGameDays.length > 0 ? Math.max(...playedGameDays) : null,
        gamesPlayed: gamesPlayed.length,
        gamesWon: gamesPlayed.filter((record) => record.points === 3).length,
        gamesDrawn: gamesPlayed.filter((record) => record.points === 1).length,
        gamesLost: gamesPlayed.filter((record) => record.points === 0).length,
    };

    const payload: DownloadMyDataPayload = {
        meta: {
            exportedAt: new Date().toISOString(),
            playerId: playerId,
            userEmail: user?.email ?? null,
        },
        profile: player,
        extraEmails,
        countries,
        clubs,
        totals,
        outcomes,
    };

    const serialisedPayload = JSON.parse(
        JSON.stringify(payload),
    ) as DownloadMyDataPayload;

    return <DownloadMyData data={serialisedPayload} />;
};

export default Page;
