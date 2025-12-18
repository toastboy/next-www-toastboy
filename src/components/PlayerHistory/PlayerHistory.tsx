import { Container } from '@mantine/core';
import { PlayerPositions } from 'components/PlayerPositions/PlayerPositions';
import { PlayerResults } from 'components/PlayerResults/PlayerResults';
import { YearSelector } from 'components/YearSelector/YearSelector';
import { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

export interface Props {
    playerName: string;
    activeYears: number[];
    year: number;
    record: PlayerRecordType | null;
}

export const PlayerHistory: React.FC<Props> = ({ playerName, activeYears, year, record }) => {
    return (
        <Container>
            <YearSelector activeYear={year} validYears={activeYears} />
            <PlayerResults playerName={playerName} year={year} record={record} />
            <PlayerPositions playerName={playerName} year={year} record={record} />
        </Container>
    );
};
