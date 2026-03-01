export const dynamic = 'force-dynamic';

import { Flex, Text } from '@mantine/core';

import gameDayService from '@/services/GameDay';

type PageProps = object

export const metadata = { title: 'Games' };

const Page: React.FC<PageProps> = async () => {
    const gamesPlayed = await gameDayService.getGamesPlayed(0);
    const gamesRemaining = await gameDayService.getGamesRemaining(0);

    return (
        <Flex direction="column" align="center" gap="lg">
            <Text>{gamesPlayed} games played to date.</Text>
            <Text>{gamesRemaining} future games confirmed.</Text>
        </Flex>
    );
};

export default Page;
