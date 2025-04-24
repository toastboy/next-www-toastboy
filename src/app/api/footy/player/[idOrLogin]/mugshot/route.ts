import { buildPngResponse, handleGET } from 'lib/api';
import azureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';
import { NextRequest } from 'next/server';
import playerService from "services/Player";

/**
 * Retrieves the mugshot image of a player based on their ID or login.
 *
 * @param {Object} params - The parameters object.
 * @param {Record<string, string>} params.params - A record containing the player's ID or login.
 * @returns {Promise<Buffer | null>} A promise that resolves to a Buffer containing the player's mugshot image,
 * or `null` if the player is not found.
 *
 * @throws {Error} Throws an error if the image body download fails.
 */
async function getPlayerMugshot(
    { params }: { params: Record<string, string> },
): Promise<Buffer | null> {
    const player = await playerService.getByIdOrLogin(params.idOrLogin);
    if (!player) return null;

    const containerClient = await azureCache.getContainerClient("mugshots");
    let blobClient = containerClient.getBlobClient(`${player.login}.jpg`);

    if (!(await blobClient.exists())) {
        blobClient = containerClient.getBlobClient('manofmystery.jpg');
    }

    const downloadBlockBlobResponse = await blobClient.download(0);
    if (!downloadBlockBlobResponse.readableStreamBody) {
        throw new Error('Image body download failed.');
    }
    return await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
}

/**
 * Handles the GET request for retrieving a player's mugshot.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including `idOrLogin`.
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
