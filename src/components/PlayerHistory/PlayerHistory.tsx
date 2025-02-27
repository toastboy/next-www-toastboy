import { Container } from '@mantine/core';
import PlayerPositions from 'components/PlayerPositions/PlayerPositions';
import PlayerResults from 'components/PlayerResults/PlayerResults';
import YearSelector from 'components/YearSelector/YearSelector';
import { fetchData } from 'lib/fetch';
import { Player } from 'lib/types';

interface Props {
    player: Player;
    year: number;
}

const PlayerHistory: React.FC<Props> = async ({ player, year }) => {
    const activeYears = await fetchData<number[]>(`/api/footy/player/${player.id}/yearsactive`);

    if (activeYears.length === 0) return null; // TODO: Probably want to show empty UX rather than nothing

    return (
        <Container>
            <YearSelector activeYear={year} validYears={activeYears} />
            <PlayerResults player={player} year={year} />
            <PlayerPositions player={player} year={year} />
        </Container>
    );
};

export default PlayerHistory;
