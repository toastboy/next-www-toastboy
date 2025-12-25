import { MustBeLoggedIn } from '@/components/MustBeLoggedIn/MustBeLoggedIn';
import { NYI } from '@/components/NYI/NYI';

type PageProps = object;

const Page: React.FC<PageProps> = () => {
    return (
        <MustBeLoggedIn admin={true}>
            <NYI />
        </MustBeLoggedIn>
    );
};

export default Page;
