import { Container } from '@mantine/core';
import PlayerPositions from 'components/PlayerPositions/PlayerPositions';
import PlayerResults from 'components/PlayerResults/PlayerResults';
import YearSelector from 'components/YearSelector/YearSelector';
import playerService from 'services/Player';

export interface Props {
    playerId: number;
    year: number;
}

const PlayerHistory: React.FC<Props> = async ({ playerId, year }) => {
    const activeYears = await playerService.getYearsActive(playerId);

    return (
        <Container>
            <YearSelector activeYear={year} validYears={activeYears} />
            <PlayerResults playerId={playerId} year={year} />
            <PlayerPositions playerId={playerId} year={year} />
        </Container>
    );
};

export default PlayerHistory;
