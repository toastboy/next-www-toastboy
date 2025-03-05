import { Box, Container, Text, Title } from '@mantine/core';
import { Player } from '@prisma/client';
import PlayerArse from 'components/PlayerArse/PlayerArse';
import PlayerBorn from 'components/PlayerBorn/PlayerBorn';
import PlayerClubs from 'components/PlayerClubs/PlayerClubs';
import PlayerCountries from 'components/PlayerCountries/PlayerCountries';
import PlayerForm from 'components/PlayerForm/PlayerForm';
import PlayerHistory from 'components/PlayerHistory/PlayerHistory';
import PlayerLastPlayed from 'components/PlayerLastPlayed/PlayerLastPlayed';
import PlayerMugshot from 'components/PlayerMugshot/PlayerMugshot';
import PlayerTrophies from 'components/PlayerTrophies/PlayerTrophies';
import { Suspense } from 'react';
import classes from './PlayerProfile.module.css';

export interface Props {
    player: Player;
    year: number;
}

const PlayerProfile: React.FC<Props> = ({ player, year }) => {
    return (
        <Container>
            <Title order={1}>{player.name}</Title>
            <Box pos="relative" maw={"40em"} mah={"40em"}>
                <PlayerMugshot player={player} />
                <Box className={classes.badges} right={"0.5em"} bottom={"0.5em"}>
                    <PlayerClubs player={player} />
                </Box>
                <Box className={classes.badges} left={"0.5em"} bottom={"0.5em"}>
                    <PlayerCountries player={player} />
                </Box>
            </Box>
            <Suspense fallback={<Text>Loading...</Text>}>
                <PlayerLastPlayed player={player} />
            </Suspense>
            <PlayerArse player={player} />
            <PlayerForm player={player} gameDayId={0} games={5} />
            <PlayerHistory player={player} year={year} />
            <PlayerBorn player={player} />
            <PlayerTrophies player={player} year={year} />
        </Container>
    );
};

export default PlayerProfile;
