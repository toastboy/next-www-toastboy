import { handleGET } from 'lib/api';
import { parseBoolean } from 'lib/utils';
import { NextRequest } from 'next/server';
import { TeamNameSchema } from 'prisma/generated/zod';
import gameDayService from 'services/GameDay';

/**
 * Handles the GET request for the gameday API route.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters.
 * @returns A Promise resolving to the response of the `handleGET` function, which retrieves
 *          gameday data based on the provided query parameters.
 *
 * Query Parameters:
 * - `bibs` (optional): A string representing the bibs filter.
 * - `game` (optional): A boolean indicating whether to filter by game status.
 * - `mailSent` (optional): A boolean indicating whether to filter by mail sent status.
 * - `year` (optional): A number representing the year to filter by.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    const searchParams = request.nextUrl.searchParams;

    return handleGET(
        () => gameDayService.getAll({
            bibs: TeamNameSchema.safeParse(searchParams.get('bibs')).data || undefined,
            game: parseBoolean(searchParams.get('game')),
            mailSent: parseBoolean(searchParams.get('mailSent')),
            year: parseInt(searchParams.get('year') || '') || undefined,
        }),
        { params },
    );
};
