import { permanentRedirect } from 'next/navigation';

const Page: React.FC = () => {
    permanentRedirect(`/footy/players`);
};

export default Page;
