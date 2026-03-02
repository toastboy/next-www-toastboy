import { createPlayer } from '@/actions/createPlayer';
import { sendEmail } from '@/actions/sendEmail';
import { NewPlayerForm } from '@/components/NewPlayerForm/NewPlayerForm';
import playerService from '@/services/Player';

type PageProps = object;

export const metadata = { title: 'New Player' };

const Page: React.FC<PageProps> = async () => {
    const players = await playerService.getAll();

    return (
        <NewPlayerForm
            players={players}
            onCreatePlayer={createPlayer}
            onSendEmail={sendEmail}
        />
    );
};

export default Page;
