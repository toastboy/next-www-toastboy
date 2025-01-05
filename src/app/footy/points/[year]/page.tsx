import { permanentRedirect } from 'next/navigation';

interface PageProps {
    params: Promise<{ year: string }>,
}

const Page: React.FC<PageProps> = async props => {
    const { year } = await props.params;
    permanentRedirect(`/footy/table/points/${year}`);
};

export default Page;
