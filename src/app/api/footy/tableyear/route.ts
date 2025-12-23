import { NextRequest } from 'next/server';

import { handleGET } from '@/lib/api';
import playerRecordService from '@/services/PlayerRecord';

/**
 * Handles the GET request for retrieving all available years of player records.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters.
 * @returns A Promise resolving to the result of the `handleGET` function,
 *          which fetches all years of player records.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(
        () => playerRecordService.getAllYears(),
        { params },
    );
};
