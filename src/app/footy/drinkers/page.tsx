import MustBeLoggedIn from 'components/MustBeLoggedIn/MustBeLoggedIn';
import NYI from 'components/NYI/NYI';

type Props = object;

const Page: React.FC<Props> = () => {
    return (
        <MustBeLoggedIn admin={true}>
            <NYI />
        </MustBeLoggedIn>
    );
};

export default Page;
