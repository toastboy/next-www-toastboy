import { createPlayer } from '@/actions/createPlayer';
import { sendEmail } from '@/actions/sendEmail';
import { NewPlayerForm } from '@/components/NewPlayerForm/NewPlayerForm';
import playerService from '@/services/Player';

export const metadata = { title: 'New Player' };

const NewPlayerPage = async () => {
    const players = await playerService.getAll();

    return (
        <NewPlayerForm
            players={players}
            onCreatePlayer={createPlayer}
            onSendEmail={sendEmail}
        />
    );
};

export default NewPlayerPage;
