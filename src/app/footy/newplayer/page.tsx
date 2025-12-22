import { MustBeLoggedIn } from 'components/MustBeLoggedIn/MustBeLoggedIn';

import { NewPlayerForm } from '@/components/NewPlayerForm/NewPlayerForm';
import playerService from '@/services/Player';

type Props = object;

const Page: React.FC<Props> = async () => {
    const players = await playerService.getAll();

    return (
        <MustBeLoggedIn admin={true}>
            <NewPlayerForm players={players} />
        </MustBeLoggedIn>
    );
};

export default Page;
