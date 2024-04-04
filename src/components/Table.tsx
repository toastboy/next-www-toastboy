import Link from 'next/link';
import playerService from 'services/Player';
import playerRecordService, { EnumTable } from 'services/PlayerRecord';

export default async function Table({ table, year, take }: { table: EnumTable, year: number, take?: number }) {
    const playerRecords = await playerRecordService.getTable(table, year, take);

    if (!playerRecords || playerRecords.length === 0) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {playerRecords.map((playerRecord, index) => (
                <div key={index}>
                    <Link className="text-gray-700 text-base" href={'/footy/player/' + playerRecord.playerId.toString()} >
                        {playerService.getName(playerRecord.player)} : {playerRecord[table]}
                    </Link>
                </div>
            ))}
        </div>
    );
}
