import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import { TableNameSchema } from 'prisma/generated/zod';
import playerRecordService from 'services/PlayerRecord';

/**
 * Handles the GET request for retrieving winners from a specific table and year.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including:
 *   - `table`: The name of the table (e.g., standings or statistics).
 *   - `year`: The year for which winners are being retrieved (optional).
 *
 * @returns A response generated by the `handleGET` function, which fetches the winners
 *          from the `playerRecordService` based on the provided table and year.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(
        () => playerRecordService.getWinners(
            TableNameSchema.parse(params.table),
            params.year != undefined ? parseInt(params.year) : undefined,
        ),
        { params },
    );
};
