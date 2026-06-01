import { Box } from '@mantine/core';
import type { TableName } from 'prisma/generated/browser';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { PlayerClubs } from '@/components/PlayerClubs/PlayerClubs';
import { PlayerCountries } from '@/components/PlayerCountries/PlayerCountries';
import { PlayerMugshot } from '@/components/PlayerMugshot/PlayerMugshot';
import { PlayerTrophies } from '@/components/PlayerTrophies/PlayerTrophies';
import { PlayerDisplayType } from '@/services/Player';
import { ClubSupporterDataType, CountrySupporterDataType } from '@/types';

import classes from './PlayerCard.module.css';

export interface Props {
    player: PlayerDisplayType;
    clubs: ClubSupporterDataType[];
    countries: CountrySupporterDataType[];
    trophies: Map<TableName, PlayerRecordType[]>;
}

export const PlayerCard = ({ player, clubs, countries, trophies }: Props) => {
    return (
        <Box w="100%" pos="relative">
            <PlayerMugshot player={player} />
            <Box className={classes.trophies} left="0.5em" top="0.5em">
                <PlayerTrophies trophies={trophies} />
            </Box>
            <Box className={classes.badges} right="0.5em" bottom="0.5em">
                <PlayerClubs clubs={clubs} />
            </Box>
            <Box className={classes.badges} left="0.5em" bottom="0.5em">
                <PlayerCountries countries={countries} />
            </Box>
        </Box>
    );
};
