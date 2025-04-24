import { handleGET } from 'lib/api';
import { TableName } from 'lib/types';
import { NextRequest } from 'next/server';
import playerRecordService from 'services/PlayerRecord';

/**
 * Handles the GET request for retrieving a player record table.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including:
 *   - `table`: The name of the table to retrieve (must be a valid `TableName`).
 *   - `year`: The year for which the table data is requested (parsed as an integer).
 *   - `qualified`: A string indicating whether to filter by qualification status ('true' or 'false').
 *
 * @returns A Promise resolving to the result of the `handleGET` function, which fetches the table data.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(
        () => playerRecordService.getTable(
            params.table as TableName,
            parseInt(params.year),
            params.qualified === 'true',
        ),
        { params },
    );
};
