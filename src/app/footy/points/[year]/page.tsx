import { permanentRedirect } from 'next/navigation';

interface PageProps {
    params: Record<string, string>,
}

const Page: React.FC<PageProps> = async ({ params }) => {
    permanentRedirect(`/footy/table/points/${params.year}`);
};

export default Page;
