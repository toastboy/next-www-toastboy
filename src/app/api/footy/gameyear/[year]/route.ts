import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import gameDayService from 'services/GameDay';

/**
 * Handles the GET request for retrieving game year data.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including the `year`.
 * @returns A Promise resolving to the result of the `handleGET` function, which processes the game year data.
 *
 * The function checks if the provided `year` parameter is valid and retrieves the corresponding game year data
 * using the `gameDayService`. If the `year` is 0, it resolves to `true`. Otherwise, it validates the retrieved
 * year against the input and resolves to `true` if they match, or `null` otherwise.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(
        async () => {
            if (parseInt(params.year) === 0) return Promise.resolve(true);
            const year_1 = await gameDayService.getYear(
                parseInt(params.year));
            return await Promise.resolve(year_1 == parseInt(params.year) ? true : null);
        },
        { params },
    );
};
