import YearSelector from 'components/YearSelector/YearSelector';
import YearTable, { QualifiedTableName } from 'components/YearTable/YearTable';
import { notFound } from 'next/navigation';
import { TableNameType } from 'prisma/generated/zod';
import playerRecordService from 'services/PlayerRecord';

interface Props {
    params: Promise<{
        year: [string],
        table: TableNameType,
    }>,
}

export async function generateMetadata(page: Props) {
    const { table, year } = await page.params;
    const yearnum = year ? parseInt(year[0]) : 0; // Zero or undefined means all-time
    return { title: QualifiedTableName(table, yearnum) };
}

const Page: React.FC<Props> = async (props) => {
    const { year, table } = await props.params;
    const yearnum = year ? parseInt(year[0]) : 0; // Zero or undefined means all-time
    const allYears = await playerRecordService.getAllYears();

    if (!allYears.includes(yearnum)) return notFound();

    return (
        <>
            <YearSelector activeYear={yearnum} validYears={allYears} />
            <YearTable table={table} year={yearnum} />
        </>
    );
};

export default Page;
