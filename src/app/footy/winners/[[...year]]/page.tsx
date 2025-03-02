import { Grid, GridCol, Stack, Title } from "@mantine/core";
import WinnersTable from "components/WinnersTable/WinnersTable";
import YearSelector from "components/YearSelector/YearSelector";
import { fetchData } from "lib/fetch";
import { TableName } from 'lib/types';

interface Props {
    params: Promise<{
        year: [string],
    }>,
}

const Page: React.FC<Props> = async props => {
    const { year } = await props.params;
    const yearnum = year ? parseInt(year[0]) : 0; // Zero or undefined means all-time
    const allYears = await fetchData<number[]>('/api/footy/tableyear');

    return (
        <Stack align="stretch" justify="center" gap="md">
            <YearSelector activeYear={yearnum} validYears={allYears} />
            <Title w="100%" ta="center" order={1}>Winners</Title>
            <Grid>
                {
                    Object.keys(TableName).map((table, index) => {
                        return (
                            <GridCol key={index}>
                                <WinnersTable table={table as TableName} year={yearnum} />
                            </GridCol>
                        );
                    })
                }
            </Grid>
        </Stack>
    );
};

export default Page;
