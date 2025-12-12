'use client';

import { Flex } from '@mantine/core';
import { PieChart } from 'components/PieChart/PieChart';
import { YearSelector } from 'components/YearSelector/YearSelector';
import { useBibs, useTableYears } from 'lib/swr';
import { use } from 'react';

interface Props {
    params: Promise<{
        year: string,
    }>,
}

const Page: React.FC<Props> = (props) => {
    const { year } = use(props.params);
    const yearnum = parseInt(year) || 0;
    const bibsData = useBibs(parseInt(year));
    const allYears = useTableYears();

    if (!bibsData || !allYears) return null;

    const pieData: { label: string; value: number; }[] = Object.keys(bibsData).map((key) => ({
        label: key,
        value: bibsData[key as keyof typeof bibsData],
    }));

    return (
        <Flex direction="column" w="100%" align="center">
            <YearSelector activeYear={yearnum} validYears={allYears} />
            <PieChart data={pieData} />
        </Flex>
    );
};

export default Page;
