import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import playerRecordService from 'services/PlayerRecord';

import { TableNameSchema } from '@/generated/zod/schemas';

/**
 * Handles a GET request to retrieve a player record table based on the provided parameters.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including:
 *   - `table` (string): The name of the table to retrieve.
 *   - `year` (string): The year for which the table data is requested.
 *   - `qualified` (string): A boolean string ('true' or 'false') indicating whether to filter by qualified players.
 *   - `take` (string): The number of records to retrieve.
 *
 * @returns A Promise resolving to the result of the `handleGET` function, which fetches the requested table data.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(
        () => playerRecordService.getTable(
            TableNameSchema.parse(params.table),
            parseInt(params.year),
            params.qualified === 'true',
            parseInt(params.take),
        ),
        { params },
    );
};
