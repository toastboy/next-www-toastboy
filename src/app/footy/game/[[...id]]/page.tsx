export const dynamic = 'force-dynamic';

import { Anchor, Flex } from '@mantine/core';
import { notFound, redirect } from 'next/navigation';
import { Activity } from 'react';

import { setGameResult } from '@/actions/setGameResult';
import { GameDaySummary } from '@/components/GameDaySummary/GameDaySummary';
import { GameResultForm } from '@/components/GameResultForm/GameResultForm';
import { getUserRole } from '@/lib/auth.server';
import { getGameWinnersFromTeams } from '@/lib/gameResult';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';

interface PageProps {
    params: Promise<{
        id: string,
    }>,
}

const Page: React.FC<PageProps> = async (props) => {
    const { id } = await props.params;
    if (!id) {
        const currentGame = await gameDayService.getCurrent();
        if (!currentGame) return notFound();
        redirect(`/footy/game/${currentGame.id}`);
    }
    const gameDayId = parseInt(id);

    if (isNaN(gameDayId)) return notFound();

    const [gameDay, role] = await Promise.all([
        gameDayService.get(gameDayId),
        getUserRole(),
    ]);

    if (!gameDay) return <></>;

    const [prevGameDay, nextGameDay, teamA, teamB] = await Promise.all([
        gameDayService.getPrevious(gameDayId),
        gameDayService.getNext(gameDayId),
        outcomeService.getTeamPlayersByGameDay(gameDay.id, 'A', 10),
        outcomeService.getTeamPlayersByGameDay(gameDay.id, 'B', 10),
    ]);
    const winners = getGameWinnersFromTeams(teamA, teamB);

    return (
        <Flex w="100%" direction="column" gap="md">
            <Activity mode={prevGameDay ? 'visible' : 'hidden'}>
                <Anchor
                    href={`/footy/game/${prevGameDay?.id ?? 0}`}
                    ta="left"
                >
                    Previous
                </Anchor>
            </Activity>
            <Activity mode={nextGameDay ? 'visible' : 'hidden'}>
                <Anchor
                    href={`/footy/game/${nextGameDay?.id ?? 0}`}
                    ta="right"
                >
                    Next
                </Anchor>
            </Activity>
            <Activity mode={role === 'admin' ? 'visible' : 'hidden'}>
                <GameResultForm
                    gameDayId={gameDay.id}
                    bibs={gameDay.bibs ?? null}
                    winners={winners}
                    setGameResult={setGameResult}
                />
            </Activity>
            <GameDaySummary
                gameDay={gameDay}
                teamA={teamA}
                teamB={teamB}
            />
        </Flex>
    );
};

export default Page;
