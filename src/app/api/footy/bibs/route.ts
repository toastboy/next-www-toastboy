import { handleGET } from "lib/api";
import { NextRequest } from "next/server";
import outcomeService from "services/Outcome";

/**
 * Handles the GET request for fetching outcomes by bibs.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing additional properties.
 * @param props.params - A promise resolving to a record of route parameters.
 * @returns A Promise resolving to the result of the `handleGET` function, which fetches outcomes by bibs.
 *
 * The function extracts the `year` query parameter from the request's URL search parameters
 * and passes it to the `outcomeService.getByBibs` method. If the `year` parameter is not provided
 * or is invalid, it defaults to `undefined`.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    const searchParams = request.nextUrl.searchParams; // TODO: Should I be using searchParams?
    return handleGET(
        () => outcomeService.getByBibs({ year: parseInt(searchParams.get('year') ?? '') || undefined }),
        { params },
    );
};
