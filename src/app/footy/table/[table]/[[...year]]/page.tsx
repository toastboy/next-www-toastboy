import { YearSelector } from 'components/YearSelector/YearSelector';
import { QualifiedTableName, YearTable } from 'components/YearTable/YearTable';
import { notFound } from 'next/navigation';
import playerRecordService from 'services/PlayerRecord';

import { TableName } from '@/generated/zod/schemas';

interface Props {
    params: Promise<{
        year: [string],
        table: TableName,
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

    const tableQualified = await playerRecordService.getTable(table, yearnum, true);
    const tableUnqualified = await playerRecordService.getTable(table, yearnum, false);

    return (
        <>
            <YearSelector activeYear={yearnum} validYears={allYears} />
            <YearTable
                table={table}
                year={yearnum}
                qualified={tableQualified}
                unqualified={tableUnqualified}
            />
        </>
    );
};

export default Page;
