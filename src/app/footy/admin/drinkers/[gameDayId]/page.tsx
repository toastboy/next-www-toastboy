import { notFound } from 'next/navigation';

import { setDrinkers } from '@/actions/setDrinkers';
import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { DrinkersForm } from '@/components/DrinkersForm/DrinkersForm';
import { formatDate } from '@/lib/dates';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import { FootyChannel } from '@/types/FootyChannel';

interface PageProps {
    params: Promise<{
        gameDayId: string;
    }>;
}

export const metadata = { title: 'Drinkers' };

const DrinkersPage = async (props: PageProps) => {
    const { gameDayId } = await props.params;
    const gameId = Number.parseInt(gameDayId, 10);

    if (Number.isNaN(gameId) || gameId < 1) return notFound();

    const gameDay = await gameDayService.get(gameId);
    if (!gameDay) return notFound();

    const [players, previousGame, nextGame] = await Promise.all([
        outcomeService.getAdminByGameDay(gameId),
        gameDayService.getPrevious(gameId),
        gameDayService.getNext(gameId),
    ]);

    return (
        <>
            <AutoRefresh channels={FootyChannel.Games} />
            <DrinkersForm
                gameId={gameDay.id}
                gameDate={formatDate(gameDay.date)}
                players={players}
                setDrinkers={setDrinkers}
                previousGameId={previousGame?.id}
                nextGameId={nextGame?.id}
            />
        </>
    );
};

export default DrinkersPage;
