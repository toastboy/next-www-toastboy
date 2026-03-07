import { permanentRedirect } from 'next/navigation';

interface PageProps {
    params: Promise<{
        id: string,
        year: string,
    }>,
}

/**
 * Server component that handles player page routing with year parameter.
 *
 * Redirects from the parameterized URL structure to a query parameter structure.
 * For example: `/footy/player/[id]/[year]` → `/footy/player/[id]?year=[year]`
 *
 * @param props - The page props containing params
 * @param props.params - Promise containing route parameters
 * @param props.params.id - The player ID from the URL
 * @param props.params.year - The year parameter from the URL
 *
 * @throws Will perform a permanent redirect and does not return
 */
async function Page(props: PageProps) {
    const { id, year } = await props.params;

    permanentRedirect(`/footy/player/${id}?year=${year}`);
};

export default Page;
