import { Stack } from '@mantine/core';

import { GameDayList } from '@/components/GameDayList/GameDayList';
import { YearSelector } from '@/components/YearSelector/YearSelector';
import gameDayService from '@/services/GameDay';

interface PageProps {
    params: Promise<{
        year: [string],
    }>,
}

export const metadata = { title: 'Results' };

const ResultsPage = async (props: PageProps) => {
    const { year } = await props.params;
    const selectedYear = year ? parseInt(year[0]) : 0; // Zero or undefined means all-time
    const [allYears, currentGameDay] = await Promise.all([
        gameDayService.getAllYears(),
        gameDayService.getCurrent(),
    ]);
    const gameDays = await gameDayService.getAll({
        year: selectedYear,
        mailSent: true,
        before: currentGameDay?.id ?? undefined,
    });

    return (
        <Stack align="stretch" justify="center" gap="md">
            <YearSelector activeYear={selectedYear} validYears={allYears} />
            <GameDayList title="results" gameDays={gameDays} />
        </Stack>
    );
};

export default ResultsPage;
