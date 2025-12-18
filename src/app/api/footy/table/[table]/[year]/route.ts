import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import { TableNameSchema } from 'prisma/zod/schemas';
import playerRecordService from 'services/PlayerRecord';

/**
 * Handles the GET request for retrieving a specific table and year of player records.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including:
 *   - `table`: The name of the table to retrieve (must be a valid `TableName`).
 *   - `year`: The year for which the table data is requested (must be a valid integer).
 *
 * @returns A Promise resolving to the result of the `handleGET` function, which fetches
 * the requested table data using the `playerRecordService`.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(
        () => playerRecordService.getTable(
            TableNameSchema.parse(params.table),
            parseInt(params.year),
        ),
        { params },
    );
};
