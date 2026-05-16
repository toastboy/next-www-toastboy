import { createPlayer } from '@/actions/createPlayer';
import { sendEmail } from '@/actions/sendEmail';
import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { NewPlayerForm } from '@/components/NewPlayerForm/NewPlayerForm';
import playerService from '@/services/Player';
import { FootyChannel } from '@/types/FootyChannel';

export const metadata = { title: 'New Player' };

const NewPlayerPage = async () => {
    const players = await playerService.getAll();

    return (
        <>
            <AutoRefresh channel={FootyChannel.Players} />
            <NewPlayerForm
                players={players}
                onCreatePlayer={createPlayer}
                onSendEmail={sendEmail}
            />
        </>
    );
};

export default NewPlayerPage;
