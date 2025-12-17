import { Grid, GridCol, Stack, Title } from "@mantine/core";
import { WinnersTable } from "components/WinnersTable/WinnersTable";
import { YearSelector } from "components/YearSelector/YearSelector";
import { getYearName } from "lib/utils";
import playerRecordService from "services/PlayerRecord";

import { TableName, TableNameSchema } from '@/generated/zod/schemas';
import { PlayerRecordDataType } from "@/types";

interface Props {
    params: Promise<{
        year: [string],
    }>,
}

export async function generateMetadata(page: Props) {
    const { year } = await page.params;
    const yearnum = year ? parseInt(year[0]) : 0;
    return { title: `${getYearName(yearnum)} Winners` };
}

const Page: React.FC<Props> = async props => {
    const { year } = await props.params;
    const yearnum = year ? parseInt(year[0]) : 0; // Zero or undefined means all-time
    const allYears = await playerRecordService.getAllYears();
    const winners = new Map<TableName, PlayerRecordDataType[]>();

    await Promise.all(TableNameSchema.options.map(async (table) => {
        const record = await playerRecordService.getWinners(table, yearnum > 0 ? yearnum : undefined);
        winners.set(table, record);
    }));

    return (
        <Stack align="stretch" justify="center" gap="md">
            <YearSelector activeYear={yearnum} validYears={allYears} />
            <Title w="100%" ta="center" order={1}>Winners</Title>
            <Grid>
                {
                    Array.from(winners.entries()).map(([table, records]) => {
                        return (
                            <GridCol span={{ base: 12, sm: 8, md: 6, lg: 4, xl: 3 }} key={table}>
                                <WinnersTable table={table} records={records} />
                            </GridCol>
                        );
                    })
                }
            </Grid>
        </Stack>
    );
};

export default Page;
