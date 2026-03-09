import { permanentRedirect } from 'next/navigation';

interface PageProps {
    params: Promise<{
        year: string,
    }>,
}

async function FixturesForYearPage(props: PageProps) {
    const { year } = await props.params;

    permanentRedirect(`/footy/games?year=${year}`);
};

export default FixturesForYearPage;
