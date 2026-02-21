import { Anchor, Container, Group } from '@mantine/core';
import { notFound } from 'next/navigation';

import { setDrinkers } from '@/actions/setDrinkers';
import { DrinkersForm } from '@/components/DrinkersForm/DrinkersForm';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';

interface PageProps {
    params: Promise<{
        gameDayId: string,
    }>,
}

const Page: React.FC<PageProps> = async (props) => {
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
        <Container size="lg" py="lg">
            <Group justify="space-between" mb="md">
                {
                    previousGame ?
                        <Anchor href={`/footy/admin/drinkers/${previousGame.id}`}>Previous</Anchor> :
                        <span />
                }
                {
                    nextGame ?
                        <Anchor href={`/footy/admin/drinkers/${nextGame.id}`}>Next</Anchor> :
                        <span />
                }
            </Group>
            <DrinkersForm
                gameId={gameDay.id}
                gameDate={gameDay.date.toISOString().split('T')[0]}
                players={players}
                setDrinkers={setDrinkers}
            />
        </Container>
    );
};

export default Page;
