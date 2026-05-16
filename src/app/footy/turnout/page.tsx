import { Paper } from '@mantine/core';

import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { Turnout } from '@/components/Turnout/Turnout';
import outcomeService from '@/services/Outcome';
import { FootyChannel } from '@/types/FootyChannel';

export const metadata = { title: 'Turnout' };

const TurnoutPage = async () => {
    const turnout = await outcomeService.getTurnoutByYear();

    return (
        <Paper shadow="xl" p="xl">
            <AutoRefresh channels={[FootyChannel.Games, FootyChannel.Results]} />
            <Turnout turnout={turnout} />
        </Paper>
    );
};

export default TurnoutPage;
