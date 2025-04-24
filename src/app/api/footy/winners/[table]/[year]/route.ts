import { handleGET, sanitizePlayerRecordWithPlayerArrayData } from 'lib/api';
import { PlayerRecordWithPlayer, TableName } from 'lib/types';
import { NextRequest } from 'next/server';
import playerRecordService from 'services/PlayerRecord';

/**
 * Handles the GET request for fetching player records of winners based on the specified table and year.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including:
 *   - `table`: The name of the table (e.g., league or competition).
 *   - `year`: The year for which the winners' data is requested (optional).
 *
 * @returns A promise resolving to a response containing an array of sanitized player records with player data.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET<Partial<PlayerRecordWithPlayer>[]>(
        () => playerRecordService.getWinners(
            params.table as TableName,
            params.year != undefined ? parseInt(params.year) : undefined,
        ),
        { params },
        { sanitize: sanitizePlayerRecordWithPlayerArrayData },
    );
};
