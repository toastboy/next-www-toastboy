'use client';

import { Flex } from '@mantine/core';
import PieChart from 'components/PieChart/PieChart';

type PageProps = object

const Page: React.FC<PageProps> = () => {
    return (
        <Flex direction="column" w="100%" align="center">
            <PieChart data={[{ label: "one", value: 50 }, { label: "two", value: 40 }, { label: "three", value: 10 }]} />
        </Flex>
    );
};

export default Page;
