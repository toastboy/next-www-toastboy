import Table from 'components/Table';
import { EnumTable } from 'services/PlayerRecord';

export default async function Page(): Promise<JSX.Element> {
    return (
        <div>
            <p className="text-2xl font-bold">Top 5 players</p>
            <Table table={EnumTable.averages} year={0} take={5} />
            <p className="text-2xl font-bold">All players</p>
            <Table table={EnumTable.averages} year={0} />
        </div>
    );
}
