import { permanentRedirect } from 'next/navigation';

interface PageProps {
    params: Promise<{
        table: string,
        year: string,
    }>,
}

/**
 * Server-side page component that redirects table requests to a canonical URL
 * format.
 *
 * Converts URL parameters from `/footy/table/[table]/[year]` to a query string
 * format `/footy/table/[table]?year=[year]`.
 *
 * @param props - The page props containing dynamic route parameters
 * @param props.params - The route parameters
 * @param props.params.table - The table identifier
 * @param props.params.year - The year parameter to redirect as a query string
 *
 * @returns Never returns; always issues a permanent redirect
 *
 * @throws {RedirectError} Triggers a permanent redirect via Next.js
 */
async function Page(props: PageProps) {
    const { table, year } = await props.params;

    permanentRedirect(`/footy/table/${table}?year=${year}`);
};

export default Page;
