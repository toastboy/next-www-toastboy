import { permanentRedirect } from 'next/navigation';

interface PageProps { }

const Page: React.FC<PageProps> = async () => {
    permanentRedirect(`/footy/table/points`);
};

export default Page;
