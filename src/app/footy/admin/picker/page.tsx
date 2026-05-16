import { Container } from '@mantine/core';
import { notFound } from 'next/navigation';

import { setGameEnabled } from '@/actions/setGameEnabled';
import { SubmitPicker } from '@/actions/submitPicker';
import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { PickerForm } from '@/components/PickerForm/PickerForm';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import { FootyChannel } from '@/types/FootyChannel';

export const metadata = { title: 'Picker' };

const PickerPage = async () => {
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
            <AutoRefresh channels={[FootyChannel.Games, FootyChannel.Responses]} />
            <PickerForm
                gameDay={currentGame}
                players={playersWithGames}
                submitPicker={SubmitPicker}
                setGameEnabled={setGameEnabled}
            />
        </Container>
    );
};

export default PickerPage;
