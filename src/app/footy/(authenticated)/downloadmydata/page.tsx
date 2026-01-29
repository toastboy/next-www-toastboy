import { Notification } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import type { DownloadMyDataPayload } from '@/components/DownloadMyData/DownloadMyData';
import DownloadMyData from '@/components/DownloadMyData/DownloadMyData';
import { getCurrentUser } from '@/lib/auth.server';
import { config } from '@/lib/config';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import outcomeService from '@/services/Outcome';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';

const Page = async () => {
    const user = await getCurrentUser();
    const playerId = user?.playerId ?? 0;

    if (!playerId) {
        return (
            <Notification icon={<IconX size={config.notificationIconSize} />} color="red">
                This account is not linked to a player profile yet.
            </Notification>
        );
    }

    const [player, extraEmails, countries, clubs, outcomes] = await Promise.all([
        playerService.getById(playerId),
        playerExtraEmailService.getAll(playerId),
        countrySupporterService.getByPlayer(playerId),
        clubSupporterService.getByPlayer(playerId),
        outcomeService.getByPlayer(playerId),
    ]);

    if (!player) {
        return (
            <Notification icon={<IconX size={config.notificationIconSize} />} color="red">
                Failed to load player data.
            </Notification>
        );
    }

    const gamesResponded = outcomes.filter((outcome) => outcome.response !== null);
    const gamesPlayed = outcomes.filter((outcome) => outcome.points !== null);
    const respondedGameDays = gamesResponded.map((outcome) => outcome.gameDayId);
    const playedGameDays = gamesPlayed.map((outcome) => outcome.gameDayId);
    const accountEmail = (player as { accountEmail?: string | null }).accountEmail ?? null;

    const totals = {
        accountEmail,
        firstResponded: respondedGameDays.length > 0 ? Math.min(...respondedGameDays) : null,
        lastResponded: respondedGameDays.length > 0 ? Math.max(...respondedGameDays) : null,
        firstPlayed: playedGameDays.length > 0 ? Math.min(...playedGameDays) : null,
        lastPlayed: playedGameDays.length > 0 ? Math.max(...playedGameDays) : null,
        gamesPlayed: gamesPlayed.length,
        gamesWon: gamesPlayed.filter((outcome) => outcome.points === 3).length,
        gamesDrawn: gamesPlayed.filter((outcome) => outcome.points === 1).length,
        gamesLost: gamesPlayed.filter((outcome) => outcome.points === 0).length,
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

    const serialisedPayload = JSON.parse(JSON.stringify(payload)) as DownloadMyDataPayload;

    return (
        <DownloadMyData data={serialisedPayload} />
    );
};

export default Page;
