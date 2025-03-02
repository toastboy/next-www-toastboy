import { Paper } from "@mantine/core";
import Turnout from "components/Turnout/Turnout";

type Props = object

const Page: React.FC<Props> = () => {
    return (
        <Paper shadow="xl" p="xl">
            <Turnout />
        </Paper>
    );
};

export default Page;
