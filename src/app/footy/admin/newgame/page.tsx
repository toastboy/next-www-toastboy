import { triggerInvitations } from '@/actions/triggerInvitations';
import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { NewGameForm } from '@/components/NewGameForm/NewGameForm';
import { FootyChannel } from '@/types/FootyChannel';

export const metadata = { title: 'New Game' };

const NewGamePage = () => {
    return (
        <>
            <AutoRefresh channels={FootyChannel.Invitations} />
            <NewGameForm onTriggerInvitations={triggerInvitations} />
        </>
    );
};

export default NewGamePage;
