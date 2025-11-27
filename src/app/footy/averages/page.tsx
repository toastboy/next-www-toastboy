import { permanentRedirect } from 'next/navigation';

const Page: React.FC = () => {
    permanentRedirect(`/footy/table/averages`);
};

export default Page;
