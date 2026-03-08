import { Container } from '@mantine/core';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { PlayerPositions } from '@/components/PlayerPositions/PlayerPositions';
import { PlayerResults } from '@/components/PlayerResults/PlayerResults';
import { YearSelector } from '@/components/YearSelector/YearSelector';
import { PlayerDisplayType } from '@/services/Player';

export interface Props {
    player: PlayerDisplayType;
    activeYears: number[];
    year: number;
    record: PlayerRecordType | null;
}

export const PlayerHistory = ({
    player,
    activeYears,
    year,
    record,
}: Props) => {
    return (
        <Container data-testid="player-history">
            <div data-testid="player-history-year-selector">
                <YearSelector activeYear={year} validYears={activeYears} />
            </div>
            <div data-testid="player-history-results">
                <PlayerResults player={player} year={year} record={record} />
            </div>
            <div data-testid="player-history-positions">
                <PlayerPositions player={player} year={year} record={record} />
            </div>
        </Container>
    );
};
