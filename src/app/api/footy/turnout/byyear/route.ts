import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import outcomeService from 'services/Outcome';

/**
 * Handles a GET request to retrieve turnout data by year.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters.
 * @returns A Promise resolving to the response of the `handleGET` function,
 *          which fetches turnout data by year using the `outcomeService`.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(
        () => outcomeService.getTurnoutByYear(),
        { params },
    );
};
