import {
    Box,
    Group,
    Paper,
    Stack,
} from '@mantine/core';
import type { TableName } from 'prisma/generated/browser';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { PlayerCard } from '@/components/PlayerCard/PlayerCard';
import { PlayerHeatmap } from '@/components/PlayerHeatmap/PlayerHeatmap';
import { PlayerInfo } from '@/components/PlayerInfo/PlayerInfo';
import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { PlayerPositions } from '@/components/PlayerPositions/PlayerPositions';
import { PlayerResults } from '@/components/PlayerResults/PlayerResults';
import { TitleWithYearDropdown } from '@/components/TitleWithYearDropdown/TitleWithYearDropdown';
import { PlayerDisplayType } from '@/services/Player';
import { ClubSupporterDataType, CountrySupporterDataType, PlayerDataEmailDisplayType, PlayerFormType } from '@/types';
import type { SendEmailProxy } from '@/types/actions/SendEmail';


export interface Props {
    player: PlayerDisplayType;
    introducedBy: PlayerDisplayType | null;
    year: number;
    history: PlayerFormType[];
    lastPlayed: PlayerFormType | null;
    lastWon: PlayerFormType | null;
    clubs: ClubSupporterDataType[];
    countries: CountrySupporterDataType[];
    activeYears: number[];
    record: PlayerRecordType | null;
    trophies: Map<TableName, PlayerRecordType[]>;
    prevPlayer: PlayerDisplayType | null;
    nextPlayer: PlayerDisplayType | null;
    isAuthenticated?: boolean;
    isAdmin?: boolean;
    playerData?: PlayerDataEmailDisplayType | null;
    onSendEmail?: SendEmailProxy;
}

export const PlayerProfile = ({
    player,
    year,
    introducedBy,
    history,
    lastPlayed,
    lastWon,
    clubs,
    countries,
    activeYears,
    record,
    trophies,
    prevPlayer,
    nextPlayer,
    isAuthenticated = false,
    isAdmin = false,
    playerData,
    onSendEmail,
}: Props) => {
    return (
        <Stack gap="sm" w="100%">
            {/* Equal 1fr side tracks always stay the same width as each other, so the
                title stays centred whether or not a nav link is present - no fixed
                width needed. */}
            <Box
                mb="lg"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
                    alignItems: 'center',
                    gap: 'var(--mantine-spacing-xs)',
                }}
            >
                <Box ta="center">
                    {prevPlayer ?
                        <PlayerLink player={prevPlayer} year={year} format="left-arrow" /> :
                        <Box data-testid="player-prev-placeholder" aria-hidden="true" />}
                </Box>
                <TitleWithYearDropdown order={1} title={player.name} year={year} validYears={activeYears} />
                <Box ta="center">
                    {nextPlayer ?
                        <PlayerLink player={nextPlayer} year={year} format="right-arrow" /> :
                        <Box data-testid="player-next-placeholder" aria-hidden="true" />}
                </Box>
            </Box>
            <Group align="stretch" gap="md" wrap="wrap">
                <Box style={{ flex: '1 1 0' }}>
                    <PlayerCard
                        player={player}
                        clubs={clubs}
                        countries={countries}
                        trophies={trophies}
                    />
                </Box>
                <Box style={{ flex: '1 1 0' }}>
                    <PlayerInfo
                        player={player}
                        year={year}
                        introducedBy={introducedBy}
                        lastPlayed={lastPlayed}
                        lastWon={lastWon}
                        isAuthenticated={isAuthenticated}
                        isAdmin={isAdmin}
                        playerData={playerData}
                        onSendEmail={onSendEmail}
                    />
                </Box>
                <Box style={{ flex: '1 1 0' }}>
                    <PlayerResults player={player} year={year} record={record} />
                </Box>
                <Box style={{ flex: '1 1 0' }}>
                    <PlayerPositions player={player} year={year} record={record} />
                </Box>
            </Group>
            <Group>
                <Paper shadow="xs" p="sm" w="auto" withBorder style={{ flex: '1' }}>
                    <PlayerHeatmap data={history} year={year} />
                </Paper>
            </Group>
        </Stack>
    );
};
