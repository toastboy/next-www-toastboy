import {
    Box,
    Flex,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableTr,
} from '@mantine/core';
import type { TableName } from 'prisma/generated/browser';
import type { ArseType } from 'prisma/zod/schemas/models/Arse.schema';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { GameDayLink } from '@/components/GameDayLink/GameDayLink';
import { PlayerArse } from '@/components/PlayerArse/PlayerArse';
import { PlayerCard } from '@/components/PlayerCard/PlayerCard';
import { PlayerHeatmap } from '@/components/PlayerHeatmap/PlayerHeatmap';
import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { PlayerPositions } from '@/components/PlayerPositions/PlayerPositions';
import { PlayerResults } from '@/components/PlayerResults/PlayerResults';
import { TitleWithYearDropdown } from '@/components/TitleWithYearDropdown/TitleWithYearDropdown';
import { formatDate } from '@/lib/dates';
import { PlayerDisplayType } from '@/services/Player';
import { ClubSupporterDataType, CountrySupporterDataType, PlayerFormType } from '@/types';

export interface Props {
    player: PlayerDisplayType;
    introducedBy: PlayerDisplayType | null;
    year: number;
    history: PlayerFormType[];
    lastPlayed: PlayerFormType | null;
    lastWon: PlayerFormType | null;
    clubs: ClubSupporterDataType[];
    countries: CountrySupporterDataType[];
    arse: Partial<ArseType> | null;
    activeYears: number[];
    record: PlayerRecordType | null;
    trophies: Map<TableName, PlayerRecordType[]>;
    prevPlayer: PlayerDisplayType | null;
    nextPlayer: PlayerDisplayType | null;
    isAuthenticated?: boolean;
    isAdmin?: boolean;
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
    arse,
    activeYears,
    record,
    trophies,
    prevPlayer,
    nextPlayer,
    isAuthenticated = false,
    isAdmin = false,
}: Props) => {
    // TODO: Look at how to make global quantities like these more consistent
    // across the app - e.g. using a context or CSS variable
    const navSlotWidth = '2rem';
    const valueCellWidth = '14rem';

    return (
        <Flex direction="column" gap="sm">
            <Flex direction="column" gap="sm">
                <Group justify="space-between" gap="xs">
                    <Box w={navSlotWidth} ta="center">
                        {prevPlayer ?
                            <PlayerLink player={prevPlayer} year={year} format="left-arrow" /> :
                            <Box data-testid="player-prev-placeholder" aria-hidden="true" w={navSlotWidth} />}
                    </Box>
                    <TitleWithYearDropdown order={1} title={player.name} year={year} validYears={activeYears} />
                    <Box w={navSlotWidth} ta="center">
                        {nextPlayer ?
                            <PlayerLink player={nextPlayer} year={year} format="right-arrow" /> :
                            <Box data-testid="player-next-placeholder" aria-hidden="true" w={navSlotWidth} />}
                    </Box>
                </Group>
                <SimpleGrid cols={{ base: 1, lg: 2, xl: 3 }} spacing="md">
                    <Paper shadow="xs" p="sm" withBorder>
                        <Stack gap="sm">
                            <PlayerCard
                                player={player}
                                clubs={clubs}
                                countries={countries}
                                trophies={trophies}
                            />
                            <Table
                                layout="fixed"
                                variant="vertical"
                            >
                                <TableTbody>
                                    {!!introducedBy && (
                                        <TableTr>
                                            <TableTh>Introduced by</TableTh>
                                            <TableTd w={valueCellWidth}><PlayerLink player={introducedBy} year={year} /></TableTd>
                                        </TableTr>
                                    )}
                                    <TableTr>
                                        <TableTh>Joined</TableTh>
                                        <TableTd w={valueCellWidth}>{player.joined ? formatDate(player.joined) : 'N/A'}</TableTd>
                                    </TableTr>
                                    {!!isAdmin && (
                                        <TableTr>
                                            <TableTh>Email</TableTh>
                                            <TableTd w={valueCellWidth}>{player.accountEmail}</TableTd>
                                        </TableTr>
                                    )}
                                    <TableTr>
                                        <TableTh>Last played</TableTh>
                                        <TableTd w={valueCellWidth}><GameDayLink gameDay={lastPlayed?.gameDay} /></TableTd>
                                    </TableTr>
                                    <TableTr>
                                        <TableTh>Last won</TableTh>
                                        <TableTd w={valueCellWidth}><GameDayLink gameDay={lastWon?.gameDay} /></TableTd>
                                    </TableTr>
                                    {!!isAuthenticated && (
                                        <TableTr>
                                            <TableTh>Born</TableTh>
                                            <TableTd w={valueCellWidth}>{player.born}</TableTd>
                                        </TableTr>
                                    )}
                                </TableTbody>
                            </Table>
                        </Stack>
                    </Paper>
                    <Stack gap="sm">
                        <SimpleGrid spacing="xs">
                            <PlayerResults player={player} year={year} record={record} />
                            <PlayerPositions player={player} year={year} record={record} />
                        </SimpleGrid>
                    </Stack>
                    <Stack gap="sm">
                        <PlayerArse arse={arse} />
                    </Stack>
                </SimpleGrid>
            </Flex>
            <Flex>
                <Paper shadow="xs" p="sm" w="auto" withBorder>
                    <PlayerHeatmap data={history} year={year} />
                </Paper>
            </Flex>
        </Flex>
    );
};
