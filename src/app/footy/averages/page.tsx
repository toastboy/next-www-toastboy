import { permanentRedirect } from 'next/navigation';

const Page: React.FC = async () => {
    permanentRedirect(`/footy/table/averages`);
};

export default Page;
