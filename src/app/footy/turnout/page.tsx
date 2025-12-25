export const dynamic = 'force-dynamic';

import { Paper } from '@mantine/core';

import { Turnout } from '@/components/Turnout/Turnout';
import outcomeService from '@/services/Outcome';

type PageProps = object

export function generateMetadata() {
    return { title: "Turnout" };
}

const Page: React.FC<PageProps> = async () => {
    const turnout = await outcomeService.getTurnoutByYear();

    return (
        <Paper shadow="xl" p="xl">
            <Turnout turnout={turnout} />
        </Paper>
    );
};

export default Page;
