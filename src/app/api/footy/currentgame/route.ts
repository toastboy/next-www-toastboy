import { NextRequest, NextResponse } from 'next/server';

import { buildJsonErrorResponse, buildJsonResponse } from '@/lib/api';
import gameDayService from '@/services/GameDay';

/**
 * Handles the GET request for retrieving the current game information.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing additional properties for the request.
 * @param props.params - A promise resolving to a record of route parameters.
 * @returns A promise resolving to a JSON response containing the current game data,
 *          or `null` when no current game is available.
 */
export const GET = async (_request: NextRequest, _props: { params: Promise<Record<string, string>> }) => {
    try {
        const currentGame = await gameDayService.getCurrent();

        if (!currentGame) {
            return NextResponse.json(null, { status: 200 });
        }

        return buildJsonResponse(currentGame);
    } catch (error) {
        return buildJsonErrorResponse(error, 'Failed to load current game.');
    }
};
