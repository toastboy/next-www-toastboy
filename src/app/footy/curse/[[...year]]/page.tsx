import { Flex } from '@mantine/core';
import { notFound } from 'next/navigation';

import { CurseOfTheBibs } from '@/components/CurseOfTheBibs/CurseOfTheBibs';
import { YearSelector } from '@/components/YearSelector/YearSelector';
import outcomeService from '@/services/Outcome';
import playerRecordService from '@/services/PlayerRecord';

interface PageProps {
    params: Promise<{
        year: string,
    }>,
}

export const metadata = { title: 'Curse of the Bibs' };

const Page: React.FC<PageProps> = async (props) => {
    const { year } = await props.params;
    const activeYear = year ? parseInt(year[0]) : 0;
    const allYears = await playerRecordService.getAllYears();

    if (!allYears.includes(activeYear)) return notFound();

    const bibsData = await outcomeService.getByBibs({ year: activeYear });

    return (
        <Flex direction="column" w="100%" align="center">
            <YearSelector activeYear={activeYear} validYears={allYears} />
            <CurseOfTheBibs bibsData={bibsData} />
        </Flex>
    );
};

export default Page;
