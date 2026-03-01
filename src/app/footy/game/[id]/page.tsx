export const dynamic = 'force-dynamic';

import { Anchor, Flex } from '@mantine/core';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Activity } from 'react';
import z from 'zod';

import { setGameResult } from '@/actions/setGameResult';
import { GameDaySummary } from '@/components/GameDaySummary/GameDaySummary';
import { GameResultForm } from '@/components/GameResultForm/GameResultForm';
import { getUserRole } from '@/lib/auth.server';
import { getGameWinnersFromTeams } from '@/lib/gameResult';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getGameDay(id: string) {
    try {
        const gameDayId = z.coerce.number().int().min(1).parse(id);
        return await gameDayService.get(gameDayId);
    } catch {
        return null;
    }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const gameDay = await getGameDay((await props.params).id);
    if (!gameDay) return {};

    return {
        title: `Game ${gameDay.id}: ${gameDay.date.toDateString()}`,
    };
}

const Page: React.FC<PageProps> = async (props: PageProps) => {
    const [gameDay, role] = await Promise.all([
        getGameDay((await props.params).id),
        getUserRole(),
    ]);
    if (!gameDay) return notFound();

    const [prevGameDay, nextGameDay, teamA, teamB] = await Promise.all([
        gameDayService.getPrevious(gameDay.id),
        gameDayService.getNext(gameDay.id),
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
