import YearSelector from 'components/YearSelector/YearSelector';
import YearTable from 'components/YearTable/YearTable';
import { TableName } from 'lib/types';
import { notFound } from 'next/navigation';
import playerRecordService from 'services/PlayerRecord';

interface Props {
    params: Promise<{
        year: [string],
        table: TableName,
    }>,
}

const Page: React.FC<Props> = async (props) => {
    const { year, table } = await props.params;
    const yearnum = year ? parseInt(year[0]) : 0; // Zero or undefined means all-time
    const allYears = await playerRecordService.getAllYears();

    if (!(table in TableName)) return notFound();
    if (!allYears.includes(yearnum)) return notFound();

    return (
        <>
            <YearSelector activeYear={yearnum} validYears={allYears} />
            <YearTable table={table} year={yearnum} />
        </>
    );
};

export default Page;
