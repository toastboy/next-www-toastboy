import { permanentRedirect } from 'next/navigation';

type PageProps = object

const Page: React.FC<PageProps> = async () => {
    permanentRedirect(`/footy/table/stalwart`);
};

export default Page;
