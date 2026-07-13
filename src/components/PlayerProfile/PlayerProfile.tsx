import {
    Box,
    Center,
    Grid,
    GridCol,
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
    const playerCardsGridColSpan = { base: 12, sm: 6, lg: 3 };

    return (
        <Stack gap="sm" w="100%">
            <Grid
                type="container"
                mb="lg"
                gap="xs"
                align="center"
            >
                <GridCol span="content" align="center">
                    {prevPlayer ?
                        <PlayerLink player={prevPlayer} year={year} format="left-arrow" /> :
                        <Box data-testid="player-prev-placeholder" aria-hidden="true" />}
                </GridCol>
                <GridCol span="auto" align="center">
                    <Center>
                        <TitleWithYearDropdown
                            order={1}
                            title={player.name}
                            year={year}
                            validYears={activeYears}
                        />
                    </Center>
                </GridCol>
                <GridCol span="content" align="center">
                    {nextPlayer ?
                        <PlayerLink player={nextPlayer} year={year} format="right-arrow" /> :
                        <Box data-testid="player-next-placeholder" aria-hidden="true" />}
                </GridCol>
            </Grid>
            <Grid
                type="container"
                breakpoints={{ xs: '24em', sm: '36em', md: '54em', lg: '74em', xl: '88em' }}
            >
                <GridCol span={playerCardsGridColSpan}>
                    <PlayerCard
                        player={player}
                        clubs={clubs}
                        countries={countries}
                        trophies={trophies}
                    />
                </GridCol>
                <GridCol span={playerCardsGridColSpan}>
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
                </GridCol>
                <GridCol span={playerCardsGridColSpan}>
                    <PlayerResults player={player} year={year} record={record} />
                </GridCol>
                <GridCol span={playerCardsGridColSpan}>
                    <PlayerPositions player={player} year={year} record={record} />
                </GridCol>
            </Grid>
            <Group>
                <Paper shadow="xs" p="sm" w="auto" withBorder style={{ flex: '1' }}>
                    <PlayerHeatmap data={history} year={year} />
                </Paper>
            </Group>
        </Stack>
    );
};
