import { permanentRedirect } from 'next/navigation';

const Page: React.FC = async () => {
    permanentRedirect(`/footy/players`);
};

export default Page;
