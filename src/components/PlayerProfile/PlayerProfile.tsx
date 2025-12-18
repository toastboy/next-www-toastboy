import { Box, Container, Title } from '@mantine/core';
import { PlayerArse } from 'components/PlayerArse/PlayerArse';
import { PlayerBorn } from 'components/PlayerBorn/PlayerBorn';
import { PlayerClubs } from 'components/PlayerClubs/PlayerClubs';
import { PlayerCountries } from 'components/PlayerCountries/PlayerCountries';
import { PlayerForm } from 'components/PlayerForm/PlayerForm';
import { PlayerHistory } from 'components/PlayerHistory/PlayerHistory';
import { PlayerLastPlayed } from 'components/PlayerLastPlayed/PlayerLastPlayed';
import { PlayerMugshot } from 'components/PlayerMugshot/PlayerMugshot';
import { PlayerTrophies } from 'components/PlayerTrophies/PlayerTrophies';
import { TableName } from 'prisma/generated/enums';
import { ArseType } from 'prisma/zod/schemas/models/Arse.schema';
import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';
import { Activity } from 'react';

import { ClubSupporterDataType, CountrySupporterDataType, PlayerFormType } from '@/types';

import classes from './PlayerProfile.module.css';

export interface Props {
    playerName: string;
    player: PlayerType;
    year: number;
    form: PlayerFormType[];
    lastPlayed: PlayerFormType | null;
    clubs: ClubSupporterDataType[];
    countries: CountrySupporterDataType[];
    arse: Partial<ArseType> | null;
    activeYears: number[];
    record: PlayerRecordType | null;
    trophies: Map<TableName, PlayerRecordType[]>;
}

export const PlayerProfile: React.FC<Props> = ({
    playerName,
    player,
    year,
    form,
    lastPlayed,
    clubs,
    countries,
    arse,
    activeYears,
    record,
    trophies,
}) => {
    return (
        <Container>
            <Title order={1}>{player.name}</Title>
            <Box pos="relative" maw={"40em"} mah={"40em"}>
                <PlayerMugshot player={player} />
                <Box className={classes.badges} right={"0.5em"} bottom={"0.5em"}>
                    <PlayerClubs clubs={clubs} />
                </Box>
                <Box className={classes.badges} left={"0.5em"} bottom={"0.5em"}>
                    <PlayerCountries countries={countries} />
                </Box>
            </Box>
            <PlayerLastPlayed lastPlayed={lastPlayed} />
            <Activity mode={arse ? 'visible' : 'hidden'}>
                <PlayerArse arse={arse} />
            </Activity>
            <PlayerForm form={form} />
            <PlayerHistory
                playerName={playerName}
                activeYears={activeYears}
                year={year}
                record={record}
            />
            <PlayerBorn player={player} />
            <PlayerTrophies trophies={trophies} />
        </Container>
    );
};
