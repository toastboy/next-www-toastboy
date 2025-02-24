import Table from 'components/Table/Table';
import TableYears from 'components/TableYears/TableYears';
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
    let allYears: number[] = [];

    try {
        const response = await fetch(`http://localhost:3000/api/footy/tableyear`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        allYears = await response.json();
    } catch (error) {
        console.error('Failed to fetch TableYears:', error);
    }

    if (!(table in TableName)) return notFound();
    if (!allYears.includes(yearnum)) return notFound();

    return (
        <>
            <TableYears activeYear={yearnum} tableYears={allYears} />
            <Table table={table} year={yearnum} />
        </>
    );
};

export default Page;
