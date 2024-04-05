import playerRecordService, { EnumTable } from 'services/PlayerRecord';
import PlayerLink from './PlayerLink';

export default async function Table({ table, year, take }: { table: EnumTable, year: number, take?: number }) {
    const playerRecords = await playerRecordService.getTable(table, year, take);

    if (!playerRecords || playerRecords.length === 0) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {playerRecords.map((playerRecord, index) => (
                <div key={index}>
                    <PlayerLink idOrLogin={playerRecord.playerId.toString()} /> : {playerRecord[table]}
                </div>
            ))}
        </div>
    );
}
