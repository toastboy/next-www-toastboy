import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import playerRecordService from 'services/PlayerRecord';

/**
 * Handles the GET request for retrieving all player records.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise that resolves to a record of route parameters.
 * @returns A response containing the result of the `playerRecordService.getAll()` call.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(
        () => playerRecordService.getAll(),
        { params },
    );
};
