export const dynamic = 'force-dynamic';

import { Anchor, Flex } from '@mantine/core';
import { GameDaySummary } from 'components/GameDaySummary/GameDaySummary';
import { notFound, redirect } from 'next/navigation';
import { Activity } from 'react';
import gameDayService from 'services/GameDay';

import outcomeService from '@/services/Outcome';

interface Props {
    params: Promise<{
        id: string,
    }>,
}

const Page: React.FC<Props> = async (props) => {
    const { id } = await props.params;
    if (!id) {
        const currentGame = await gameDayService.getCurrent();
        if (!currentGame) return notFound();
        redirect(`/footy/game/${currentGame.id}`);
    }
    const gameDayId = parseInt(id);

    if (isNaN(gameDayId)) return notFound();

    const gameDay = await gameDayService.get(gameDayId);

    if (!gameDay) return <></>;

    const prevGameDay = await gameDayService.getPrevious(gameDayId);
    const nextGameDay = await gameDayService.getNext(gameDayId);

    const teamA = await outcomeService.getTeamPlayersByGameDay(gameDay.id, 'A', 10);
    const teamB = await outcomeService.getTeamPlayersByGameDay(gameDay.id, 'B', 10);

    return (
        <Flex w="100%" direction="column">
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
            <GameDaySummary
                gameDay={gameDay}
                teamA={teamA}
                teamB={teamB}
            />
        </Flex>
    );
};

export default Page;
