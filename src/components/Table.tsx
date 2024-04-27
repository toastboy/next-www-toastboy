import playerRecordService, { EnumTable } from 'services/PlayerRecord';
import PlayerLink from './PlayerLink';
import TableScore from './TableScore';

export default async function Table({ table, year, qualified, take }: {
    table: EnumTable,
    year: number,
    qualified?: boolean,
    take?: number,
}) {
    // TODO: use API route
    const playerRecords = await playerRecordService.getTable(table, year, qualified, take);

    if (!playerRecords || playerRecords.length === 0) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {playerRecords.map((playerRecord, index) => (
                <div key={index}>
                    <PlayerLink idOrLogin={playerRecord.playerId.toString()} /> : <TableScore table={table} playerRecord={playerRecord} />
                </div>
            ))}
        </div>
    );
}
