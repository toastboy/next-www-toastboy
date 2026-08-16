import { notFound } from 'next/navigation';
import { TableNameSchema } from 'prisma/zod/schemas';

import { HomeContent } from '@/components/HomeContent/HomeContent';
import gameDayService from '@/services/GameDay';
import playerRecordService from '@/services/PlayerRecord';

const HomePage = async () => {
    const tables = [
        TableNameSchema.enum.points,
        TableNameSchema.enum.averages,
        TableNameSchema.enum.stalwart,
    ] as const;
    const year = await gameDayService.getCurrentYear();
    if (!year) return notFound();

    const tableRecords = await Promise.all(
        tables.map((table) =>
            playerRecordService.getTable(table, year, true, 3),
        ),
    );

    return (
        <HomeContent
            year={year}
            tables={tables}
            tableRecords={tableRecords}
        />
    );
};

export default HomePage;
