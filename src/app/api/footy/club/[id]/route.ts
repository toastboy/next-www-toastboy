import { NextRequest } from 'next/server';

import { handleGET } from '@/lib/api';
import clubService from '@/services/Club';

/**
 * Handles the GET request for retrieving club information by ID.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including the `id` of the club.
 * @returns A response object containing the result of the `clubService.get` method.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(
        () => clubService.get(parseInt(params.id)),
        { params },
    );
};
