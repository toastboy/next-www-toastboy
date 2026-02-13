import { Container } from '@mantine/core';
import { notFound } from 'next/navigation';

import { setGameEnabled } from '@/actions/setGameEnabled';
import { SubmitPicker } from '@/actions/submitPicker';
import { PickerForm } from '@/components/PickerForm/PickerForm';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';

type PageProps = object;

const Page: React.FC<PageProps> = async () => {
    const currentGame = await gameDayService.getCurrent();
    if (!currentGame) return notFound();
    const players = await outcomeService.getAdminByGameDay(currentGame.id);
    const playersWithGames = await Promise.all(
        players.map(async (player) => ({
            ...player,
            gamesPlayed: await outcomeService.getGamesPlayedByPlayer(player.playerId, 0),
        })),
    );

    return (
        <Container size="lg" py="lg">
            <PickerForm
                gameDay={currentGame}
                players={playersWithGames}
                submitPicker={SubmitPicker}
                setGameEnabled={setGameEnabled}
            />
        </Container>
    );
};

export default Page;
