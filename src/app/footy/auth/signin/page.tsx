import { SignIn } from 'components/SignIn/SignIn';

type Props = object

const Page: React.FC<Props> = () => {
    return (
        <SignIn redirect='/footy/info' />
    );
};

export default Page;
