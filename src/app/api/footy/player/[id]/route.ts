import { handleGET, sanitizePlayerData } from 'lib/api';
import { NextRequest, NextResponse } from 'next/server';
import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import playerService from 'services/Player';

/**
 * Handles the GET request for retrieving a player's information by their ID.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including `id`.
 * @returns A response containing partial player information.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    const playerId = Number(params.id);

    if (Number.isNaN(playerId)) {
        return new NextResponse('Not Found', { status: 404 });
    }

    return handleGET<PlayerType, Partial<PlayerType>>(
        () => playerService.getById(playerId),
        { params },
        { sanitize: sanitizePlayerData },
    );
};
