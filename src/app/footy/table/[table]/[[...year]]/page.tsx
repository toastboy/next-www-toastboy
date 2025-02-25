import Table from 'components/Table/Table';
import YearSelector from 'components/YearSelector/YearSelector';
import { fetchData } from 'lib/fetch';
import { TableName } from 'lib/types';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{
        year: [string],
        table: TableName,
    }>,
}

const Page: React.FC<Props> = async (props) => {
    const { year, table } = await props.params;
    const yearnum = year ? parseInt(year[0]) : 0; // Zero or undefined means all-time
    const allYears = await fetchData<number[]>('/api/footy/tableyear');

    if (!(table in TableName)) return notFound();
    if (!allYears.includes(yearnum)) return notFound();

    return (
        <>
            <YearSelector activeYear={yearnum} validYears={allYears} />
            <Table table={table} year={yearnum} />
        </>
    );
};

export default Page;
