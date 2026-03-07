import { permanentRedirect } from 'next/navigation';

interface PageProps {
    params: Promise<{
        year: string,
    }>,
}

/**
 * Server-side page component that redirects winners requests to a canonical URL
 * format.
 *
 * Converts URL parameters from `/footy/winners/[year]` to a query string format
 * `/footy/winners?year=[year]`.
 *
 * @param props - The page props containing dynamic route parameters
 * @param props.params - The route parameters
 * @param props.params.year - The year parameter to redirect as a query string
 *
 * @returns Never returns; always issues a permanent redirect
 *
 * @throws {RedirectError} Triggers a permanent redirect via Next.js
 */
async function Page(props: PageProps) {
    const { year } = await props.params;

    permanentRedirect(`/footy/winners?year=${year}`);
};

export default Page;
