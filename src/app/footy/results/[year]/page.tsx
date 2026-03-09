import { permanentRedirect } from 'next/navigation';

interface PageProps {
    params: Promise<{
        year: string,
    }>,
}

async function ResultsForYearPage(props: PageProps) {
    const { year } = await props.params;

    permanentRedirect(`/footy/games?year=${year}`);
};

export default ResultsForYearPage;
