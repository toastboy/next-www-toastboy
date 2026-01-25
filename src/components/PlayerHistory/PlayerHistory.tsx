import { Container } from '@mantine/core';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { PlayerPositions } from '@/components/PlayerPositions/PlayerPositions';
import { PlayerResults } from '@/components/PlayerResults/PlayerResults';
import { YearSelector } from '@/components/YearSelector/YearSelector';

export interface Props {
    playerName: string;
    activeYears: number[];
    year: number;
    record: PlayerRecordType | null;
}

export const PlayerHistory: React.FC<Props> = ({ playerName, activeYears, year, record }) => {
    return (
        <Container data-testid="player-history">
            <div data-testid="player-history-year-selector">
                <YearSelector activeYear={year} validYears={activeYears} />
            </div>
            <div data-testid="player-history-results">
                <PlayerResults playerName={playerName} year={year} record={record} />
            </div>
            <div data-testid="player-history-positions">
                <PlayerPositions playerName={playerName} year={year} record={record} />
            </div>
        </Container>
    );
};
