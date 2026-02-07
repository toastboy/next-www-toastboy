import { Container } from '@mantine/core';
import { notFound } from 'next/navigation';

import { cancelGame } from '@/actions/cancelGame';
import { sendEmail } from '@/actions/sendEmail';
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
                gameId={currentGame.id}
                gameDate={currentGame.date.toISOString().split('T')[0]}
                players={playersWithGames}
                submitPicker={SubmitPicker}
                cancelGame={cancelGame}
                sendEmail={sendEmail}
            />
        </Container>
    );
};

export default Page;
