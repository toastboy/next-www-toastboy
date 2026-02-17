import { Stack, Title } from '@mantine/core';

import { GameDayList } from '@/components/GameDayList/GameDayList';
import { YearSelector } from '@/components/YearSelector/YearSelector';
import gameDayService from '@/services/GameDay';

interface PageProps {
    params: Promise<{
        year: [string],
    }>,
}

const Page: React.FC<PageProps> = async props => {
    const { year } = await props.params;
    const selectedYear = year ? parseInt(year[0]) : 0; // Zero or undefined means all-time
    const [allYears, currentGameDay] = await Promise.all([
        gameDayService.getAllYears(),
        gameDayService.getCurrent(),
    ]);
    const gameDays = await gameDayService.getAll({
        year: selectedYear,
        mailSent: false,
        onOrAfter: currentGameDay?.id ?? undefined,
    });

    return (
        <Stack align="stretch" justify="center" gap="md">
            <YearSelector activeYear={selectedYear} validYears={allYears} />
            <Title w="100%" ta="center" order={1}>Fixtures</Title>
            <GameDayList gameDays={gameDays} />
        </Stack>
    );
};

export default Page;
