import { Paper } from "@mantine/core";
import Turnout from "components/Turnout/Turnout";
import { fetchData } from "lib/fetch";
import { TurnoutByYear } from "lib/types";

type Props = object

const Page: React.FC<Props> = async () => {
    const turnout = await fetchData<TurnoutByYear[]>('/api/footy/turnout/byyear');

    return (
        <Paper shadow="xl" p="xl">
            <Turnout turnout={turnout} />
        </Paper>
    );
};

export default Page;
