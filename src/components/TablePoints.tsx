import playerRecordService from 'services/PlayerRecord';
import playerService from 'services/Player';
import { EnumTable } from 'services/PlayerRecord';
import Link from 'next/link';

export default async function TablePoints({ year, take }: { year: number, take?: number }) {
    const playerRecords = await playerRecordService.getTable(EnumTable.points, year, take);

    if (!playerRecords || playerRecords.length === 0) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {playerRecords.map((playerRecord, index) => (
                <div key={index}>
                    <Link className="text-gray-700 text-base" href={'/footy/player/' + playerRecord.playerId.toString()} >
                        {playerService.getName(playerRecord.player)} : {playerRecord.points}
                    </Link>
                </div>
            ))}
        </div>
    );
}
