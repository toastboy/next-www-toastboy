export const dynamic = 'force-dynamic';

import { Flex, Text } from "@mantine/core";
import { fetchData } from "lib/fetch";

type PageProps = object

const Page: React.FC<PageProps> = async () => {
    const gamesPlayed = await fetchData<number>('/api/footy/gamesplayed/0');
    const gamesRemaining = await fetchData<number>('/api/footy/gamesremaining/0');

    return (
        <Flex direction="column" align="center" gap="lg">
            <Text>{gamesPlayed} games played to date.</Text>
            <Text>{gamesRemaining} future games confirmed.</Text>
        </Flex>
    );
};

export default Page;
