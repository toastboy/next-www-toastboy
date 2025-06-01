import { Grid, GridCol, Stack, Title } from "@mantine/core";
import WinnersTable from "components/WinnersTable/WinnersTable";
import YearSelector from "components/YearSelector/YearSelector";
import { getYearName } from "lib/utils";
import { TableNameSchema } from "prisma/generated/zod";
import playerRecordService from "services/PlayerRecord";

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

    return (
        <Stack align="stretch" justify="center" gap="md">
            <YearSelector activeYear={yearnum} validYears={allYears} />
            <Title w="100%" ta="center" order={1}>Winners</Title>
            <Grid>
                {
                    TableNameSchema.options.map((table, index) => {
                        return (
                            <GridCol span={{ base: 12, sm: 8, md: 6, lg: 4, xl: 3 }} key={index}>
                                <WinnersTable table={table} year={yearnum} />
                            </GridCol>
                        );
                    })
                }
            </Grid>
        </Stack>
    );
};

export default Page;
