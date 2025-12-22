import { MustBeLoggedIn } from 'components/MustBeLoggedIn/MustBeLoggedIn';

import { NewPlayerForm } from '@/components/NewPlayerForm/NewPlayerForm';

type Props = object;

const Page: React.FC<Props> = () => {
    return (
        <MustBeLoggedIn admin={true}>
            <NewPlayerForm />
        </MustBeLoggedIn>
    );
};

export default Page;
