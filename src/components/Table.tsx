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
                    <PlayerLink idOrLogin={playerRecord.playerId.toString()} /> : {(() => {
                        switch (table) {
                            case EnumTable.averages:
                                return `${playerRecord.averages?.toFixed(3)}`;
                            case EnumTable.speedy:
                                if (playerRecord.speedy) {
                                    const date = new Date(0);
                                    date.setSeconds(playerRecord.speedy);
                                    return date.toISOString().substring(11, 19);
                                }
                                else {
                                    return null;
                                }
                            default:
                                return playerRecord[table];
                        }
                    })()}
                </div>
            ))}
        </div>
    );
}
