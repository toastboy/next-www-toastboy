import { Container, Text } from '@mantine/core';
import { Player } from '@prisma/client';
import PlayerArse from 'components/PlayerArse/PlayerArse';
import PlayerBorn from 'components/PlayerBorn/PlayerBorn';
import PlayerClubs from 'components/PlayerClubs/PlayerClubs';
import PlayerCountries from 'components/PlayerCountries/PlayerCountries';
import PlayerForm from 'components/PlayerForm/PlayerForm';
import PlayerHistory from 'components/PlayerHistory/PlayerHistory';
import PlayerLastPlayed from 'components/PlayerLastPlayed/PlayerLastPlayed';
import PlayerMugshot from 'components/PlayerMugshot/PlayerMugshot';
import { Suspense } from 'react';

export interface Props {
    player: Player;
    year: number;
}

const PlayerProfile: React.FC<Props> = ({ player, year }) => {
    return (
        <Container>
            <h1 className="text-6xl font-bold mb-4 text-center">{player.name}</h1>
            <PlayerMugshot player={player} />
            <Suspense fallback={<Text>Loading...</Text>}>
                <PlayerLastPlayed player={player} />
            </Suspense>
            <PlayerClubs player={player} />
            <PlayerCountries player={player} />
            <PlayerArse player={player} />
            <PlayerForm player={player} gameDayId={0} games={5} />
            <PlayerHistory player={player} year={year} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{player.name}</div>
                <p className="text-gray-700 text-base">{player.email}</p>
                <p className="text-gray-900 text-xl">{player.login}</p>
            </div>
            <PlayerBorn player={player} />
        </Container>
    );
};

export default PlayerProfile;
