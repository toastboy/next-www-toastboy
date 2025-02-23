import PlayerLink from 'components/PlayerLink/PlayerLink';
import TableScore from 'components/TableScore/TableScore';
import { TableName } from 'lib/types';
import playerRecordService from 'services/PlayerRecord';

export interface Props {
    table: TableName;
    year: number;
    qualified?: boolean;
    take?: number;
}

const TableQualified: React.FC<Props> = async ({ table, year, qualified, take }) => {
    const data = await playerRecordService.getTable(table, year, qualified, take);

    if (!data) return <></>;

    return (
        <div className="px-6 py-4">
            {data.map((record, index) => (
                <div key={index}>
                    <PlayerLink player={record.player} /> : <TableScore table={table} playerRecord={record} />
                </div>
            ))}
        </div>
    );
};

export default TableQualified;
