import { NextRequest } from 'next/server';

import { handleGET } from '@/lib/api';
import gameDayService from '@/services/GameDay';

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    /**
     * Represents the parameters passed to the API route.
     * This object is typically used to extract dynamic route segments
     * or query parameters for processing within the handler.
     *
     * @type {any} The type of `params` can vary depending on the route configuration.
     */
    const params = await props.params;
    return handleGET(
        () => gameDayService.getAllYears(),
        { params },
    );
};
