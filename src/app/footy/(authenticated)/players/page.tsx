import { notFound } from 'next/navigation';

import { sendEmail } from '@/actions/sendEmail';
import { PlayerList } from '@/components/PlayerList/PlayerList';
import gameDayService from '@/services/GameDay';
import playerService from '@/services/Player';

export const metadata = { title: 'Players' };

const PlayersPage = async () => {
    const [gameDay, players] = await Promise.all([
        gameDayService.getCurrent(),
        playerService.getAll(),
    ]);

    if (!gameDay) return notFound();

    return (
        <PlayerList
            players={players}
            gameDay={gameDay}
            sendEmail={sendEmail}
        />
    );
};

export default PlayersPage;
