import { Stack } from '@mantine/core';

import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { Turnout } from '@/components/Turnout/Turnout';
import outcomeService from '@/services/Outcome';
import { FootyChannel } from '@/types/FootyChannel';

export const metadata = { title: 'Turnout' };

const TurnoutPage = async () => {
    const turnout = await outcomeService.getTurnoutByYear();

    return (
        <Stack w="100%" p="xl" align="center">
            <AutoRefresh channels={[FootyChannel.Games, FootyChannel.Results]} />
            <Turnout turnout={turnout} />
        </Stack>
    );
};

export default TurnoutPage;
