import { Flex, Group, SimpleGrid, Stack } from '@mantine/core';
import type { TableName } from 'prisma/generated//browser';
import type { ArseType } from 'prisma/zod/schemas/models/Arse.schema';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { PlayerArse } from '@/components/PlayerArse/PlayerArse';
import { PlayerBorn } from '@/components/PlayerBorn/PlayerBorn';
import { PlayerCard } from '@/components/PlayerCard/PlayerCard';
import { PlayerHeatmap } from '@/components/PlayerHeatmap/PlayerHeatmap';
import { PlayerLastPlayed } from '@/components/PlayerLastPlayed/PlayerLastPlayed';
import { PlayerPositions } from '@/components/PlayerPositions/PlayerPositions';
import { PlayerResults } from '@/components/PlayerResults/PlayerResults';
import { TitleWithYearDropdown } from '@/components/TitleWithYearDropdown/TitleWithYearDropdown';
import { PlayerDisplayType } from '@/services/Player';
import { ClubSupporterDataType, CountrySupporterDataType, PlayerFormType } from '@/types';

export interface Props {
    player: PlayerDisplayType;
    year: number;
    history: PlayerFormType[];
    lastPlayed: PlayerFormType | null;
    clubs: ClubSupporterDataType[];
    countries: CountrySupporterDataType[];
    arse: Partial<ArseType> | null;
    activeYears: number[];
    record: PlayerRecordType | null;
    trophies: Map<TableName, PlayerRecordType[]>;
}

export const PlayerProfile = ({
    player,
    year,
    history,
    lastPlayed,
    clubs,
    countries,
    arse,
    activeYears,
    record,
    trophies,
}: Props) => {
    return (
        <Flex direction="column" gap="sm">
            <Group justify="center" gap="xs">
                <TitleWithYearDropdown order={1} title={player.name} year={year} validYears={activeYears} />
            </Group>
            <SimpleGrid cols={{ base: 1, lg: 2, xl: 3 }} spacing="md">
                <Stack gap="sm">
                    <PlayerCard
                        player={player}
                        clubs={clubs}
                        countries={countries}
                        trophies={trophies}
                    />
                    <PlayerLastPlayed lastPlayed={lastPlayed} />
                    <PlayerBorn player={player} />
                </Stack>
                <Stack gap="sm">
                    <SimpleGrid spacing="xs">
                        <PlayerResults player={player} year={year} record={record} />
                        <PlayerPositions player={player} year={year} record={record} />
                    </SimpleGrid>
                </Stack>
                <Stack gap="sm">
                    <PlayerArse arse={arse} />
                    <PlayerHeatmap data={history} year={year} />
                </Stack>
            </SimpleGrid>
        </Flex>
    );
};
