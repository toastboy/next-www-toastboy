import TablePoints from 'components/TablePoints';

export default async function Page(): Promise<JSX.Element> {
    return (
        <div>
            <p className="text-2xl font-bold">Top 5 players</p>
            <TablePoints year={0} take={5} />
            <p className="text-2xl font-bold">All players</p>
            <TablePoints year={0} />
        </div>
    );
}
