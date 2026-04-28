import { Container } from '@mantine/core';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { PlayerPositions } from '@/components/PlayerPositions/PlayerPositions';
import { PlayerResults } from '@/components/PlayerResults/PlayerResults';
import { PlayerDisplayType } from '@/services/Player';

import { TitleWithYearDropdown } from '../TitleWithYearDropdown/TitleWithYearDropdown';

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
            <TitleWithYearDropdown order={2} title={`History: `} year={year} validYears={activeYears} />
            <PlayerResults player={player} year={year} record={record} />
            <PlayerPositions player={player} year={year} record={record} />
        </Container>
    );
};
