import Table from 'components/Table';
import { notFound } from 'next/navigation';
import gameDayService from 'services/GameDay';
import { EnumTable } from 'services/PlayerRecord';

export default async function Page({
    params,
}: {
    params: { params: string[] },
}): Promise<JSX.Element> {
    let year = 0;
    let table = EnumTable.points;

    switch (params.params.length) {
        case 2:
            year = params.params[1] ? parseInt(params.params[1]) : 0;
            if (isNaN(year)) {
                return notFound();
            }
            else {
                const distinctYears = await gameDayService.getAllYears();
                if (!distinctYears || !distinctYears.includes(year)) {
                    return notFound();
                }
            }
        // falls through
        case 1:
            table = EnumTable[params.params[0] as keyof typeof EnumTable];
            if (!table) {
                return notFound();
            }
            break;
        default:
            return notFound();
    }

    return (
        <div>
            <p className="text-2xl font-bold">Top 5 players</p>
            <Table table={table} year={year} take={5} />
            <p className="text-2xl font-bold">All players</p>
            <Table table={table} year={year} />
        </div>
    );
}
