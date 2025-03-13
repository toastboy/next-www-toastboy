'use client';

import { Alert, Flex, Loader } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import PieChart from 'components/PieChart/PieChart';
import YearSelector from 'components/YearSelector/YearSelector';
import { useBibs } from 'lib/swr';
import { use } from 'react';

interface Props {
    params: Promise<{
        year: string,
    }>,
}

const Page: React.FC<Props> = (props) => {
    const { year } = use(props.params);
    const { data: bibsData, error, isLoading } = useBibs(parseInt(year));

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !bibsData) {
        return <Alert title="Error" icon={<IconAlertTriangle />}>{error?.message || 'An unknown error occurred'}</Alert>;
    }

    const pieData: { label: string; value: number; }[] = Object.keys(bibsData).map((key) => ({
        label: key,
        value: bibsData[key as keyof typeof bibsData],
    }));

    return (
        <Flex direction="column" w="100%" align="center">
            <YearSelector activeYear={0} validYears={[]} />
            <PieChart data={pieData} />
        </Flex>
    );
};

export default Page;
