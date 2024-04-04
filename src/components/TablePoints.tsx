import playerRecordService from 'services/PlayerRecord';
import playerService from 'services/Player';
import { EnumTable } from 'services/PlayerRecord';

export default async function TablePoints({ year, take }: { year: number, take?: number }) {
    const playerRecords = await playerRecordService.getTable(EnumTable.points, year, take);

    if (!playerRecords || playerRecords.length === 0) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {playerRecords.map((playerRecord, index) => (
                <p key={index} className="text-gray-700 text-base">{playerService.getName(playerRecord.player)} : {playerRecord.points}</p>
            ))}
        </div>
    );
}
