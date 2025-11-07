import { Box, Container, Text, Title } from '@mantine/core';
import PlayerArse from 'components/PlayerArse/PlayerArse';
import PlayerBorn from 'components/PlayerBorn/PlayerBorn';
import PlayerClubs from 'components/PlayerClubs/PlayerClubs';
import PlayerCountries from 'components/PlayerCountries/PlayerCountries';
import PlayerForm from 'components/PlayerForm/PlayerForm';
import PlayerHistory from 'components/PlayerHistory/PlayerHistory';
import PlayerLastPlayed from 'components/PlayerLastPlayed/PlayerLastPlayed';
import PlayerMugshot from 'components/PlayerMugshot/PlayerMugshot';
import PlayerTrophies from 'components/PlayerTrophies/PlayerTrophies';
import { PlayerType } from 'prisma/generated/schemas/models/Player.schema';
import { Suspense } from 'react';
import classes from './PlayerProfile.module.css';

export interface Props {
    player: PlayerType;
    year: number;
}

const PlayerProfile: React.FC<Props> = ({ player, year }) => {
    return (
        <Container>
            <Title order={1}>{player.name}</Title>
            <Box pos="relative" maw={"40em"} mah={"40em"}>
                <PlayerMugshot playerId={player.id} />
                <Box className={classes.badges} right={"0.5em"} bottom={"0.5em"}>
                    <PlayerClubs playerId={player.id} />
                </Box>
                <Box className={classes.badges} left={"0.5em"} bottom={"0.5em"}>
                    <PlayerCountries playerId={player.id} />
                </Box>
            </Box>
            <Suspense fallback={<Text>Loading...</Text>}>
                <PlayerLastPlayed playerId={player.id} />
            </Suspense>
            <PlayerArse playerId={player.id} />
            <PlayerForm playerId={player.id} gameDayId={0} games={5} />
            <PlayerHistory playerId={player.id} year={year} />
            <PlayerBorn playerId={player.id} />
            <PlayerTrophies playerId={player.id} year={year} />
        </Container>
    );
};

export default PlayerProfile;
