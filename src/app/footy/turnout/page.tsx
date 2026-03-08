export const dynamic = 'force-dynamic';

import { Paper } from '@mantine/core';

import { Turnout } from '@/components/Turnout/Turnout';
import outcomeService from '@/services/Outcome';

export const metadata = { title: 'Turnout' };

const TurnoutPage = async () => {
    const turnout = await outcomeService.getTurnoutByYear();

    return (
        <Paper shadow="xl" p="xl">
            <Turnout turnout={turnout} />
        </Paper>
    );
};

export default TurnoutPage;
