import { permanentRedirect } from 'next/navigation';

type PageProps = object

const Page: React.FC<PageProps> = () => {
    permanentRedirect(`/footy/table/pub`);
};

export default Page;
