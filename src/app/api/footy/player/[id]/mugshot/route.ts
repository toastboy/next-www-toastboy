import { NextRequest } from 'next/server';

import { buildPngResponse, handleGET } from '@/lib/api';
import azureCache from '@/lib/azure';
import { InternalError, normalizeUnknownError } from '@/lib/errors';
import { streamToBuffer } from '@/lib/utils';
import playerService from '@/services/Player';

/**
 * Retrieves the mugshot image of a player based on their ID.
 *
 * @param {Object} params - The parameters object.
 * @param {Record<string, string>} params.params - A record containing the player's ID.
 * @returns {Promise<Buffer | null>} A promise that resolves to a Buffer containing the player's mugshot image,
 * or `null` if the player is not found.
 *
 * @throws {Error} Throws an error if the image body download fails.
 */
async function getPlayerMugshot(
    { params }: { params: Record<string, string> },
): Promise<Buffer | null> {
    try {
        const playerId = Number(params.id);
        if (Number.isNaN(playerId)) return null;

        const player = await playerService.getById(playerId);
        if (!player) return null;
        const containerClient = azureCache.getContainerClient("mugshots");
        const playerLogin = await playerService.getLogin(params.id);
        let blobClient = containerClient.getBlobClient(playerLogin ? `${playerLogin}.jpg` : 'manofmystery.jpg');

        if (player.anonymous ||
            (playerLogin && !(await blobClient.exists()))) {
            blobClient = containerClient.getBlobClient('manofmystery.jpg');
        }

        const downloadBlockBlobResponse = await blobClient.download(0);
        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new InternalError('Image body download failed.', {
                details: {
                    resource: 'player-mugshot',
                    playerId,
                },
            });
        }
        return await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    }
    catch (error) {
        throw normalizeUnknownError(error, {
            details: {
                resource: 'player-mugshot',
                playerId: params.id,
            },
        });
    }
}

/**
 * Handles the GET request for retrieving a player's mugshot.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including `id`.
 * @returns A response containing the player's mugshot in PNG format.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(
        () => getPlayerMugshot({ params }),
        { params },
        { buildResponse: buildPngResponse },
    );
};
