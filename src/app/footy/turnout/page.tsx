import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { Turnout } from '@/components/Turnout/Turnout';
import outcomeService from '@/services/Outcome';
import { FootyChannel } from '@/types/FootyChannel';

export const metadata = { title: 'Turnout' };

const TurnoutPage = async () => {
    const turnout = await outcomeService.getTurnoutByYear();

    return (
        <>
            <AutoRefresh
                channels={[FootyChannel.Games, FootyChannel.Results]}
            />
            <Turnout turnout={turnout} />
        </>
    );
};

export default TurnoutPage;
