import { Container, Text } from '@mantine/core';
import { Player } from '@prisma/client';
import PlayerArse from 'components/PlayerArse/PlayerArse';
import PlayerClubs from 'components/PlayerClubs/PlayerClubs';
import PlayerCountries from 'components/PlayerCountries/PlayerCountries';
import PlayerForm from 'components/PlayerForm/PlayerForm';
import PlayerHistory from 'components/PlayerHistory/PlayerHistory';
import PlayerLastPlayed from 'components/PlayerLastPlayed/PlayerLastPlayed';
import PlayerMugshot from 'components/PlayerMugshot/PlayerMugshot';
import { Suspense } from 'react';

interface Props {
    player: Player;
}

const PlayerProfile: React.FC<Props> = ({ player }) => {
    // TODO: Dedicated component for this
    const born_string = player.born == null ? "Unknown" : player.born.toLocaleDateString('sv');

    return (
        <Container>
            <h1 className="text-6xl font-bold mb-4 text-center">{player.name}</h1>
            <PlayerMugshot player={player} />
            <Suspense fallback={<Text>Loading...</Text>}>
                <PlayerLastPlayed player={player} />
            </Suspense>
            <PlayerClubs idOrLogin={player.login} />
            <PlayerCountries idOrLogin={player.login} />
            <PlayerArse idOrLogin={player.login} />
            <PlayerForm player={player} gameDayId={0} games={5} />
            <PlayerHistory player={player} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{player.name}</div>
                <p className="text-gray-700 text-base">{player.email}</p>
                <p className="text-gray-900 text-xl">{player.login}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {born_string}
                </span>
            </div>
        </Container>
    );
};

export default PlayerProfile;
