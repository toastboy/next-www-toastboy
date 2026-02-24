import { NextRequest } from 'next/server';

import { buildPngResponse, handleGET } from '@/lib/api';
import azureCache from '@/lib/azure';
import { InternalError, normalizeUnknownError } from '@/lib/errors';
import { streamToBuffer } from '@/lib/utils';

/**
 * Retrieves the badge image for a specific club from Azure Blob Storage.
 *
 * @param {Object} params - The parameters object.
 * @param {Record<string, string>} params.params - A record containing the club ID as a string.
 * @returns {Promise<Buffer | null>} A promise that resolves to the badge image as a Buffer if it exists,
 * or `null` if the badge does not exist.
 * @throws {Error} Throws an error if there is an issue accessing the blob or downloading the image.
 */
async function getClubBadge(
    { params }: { params: Record<string, string> },
): Promise<Buffer | null> {
    try {
        const containerClient = azureCache.getContainerClient("clubs");
        const blobClient = containerClient.getBlobClient(`${params.id.toString()}.png`);

        if (!(await blobClient.exists())) {
            return null;
        }

        const downloadBlockBlobResponse = await blobClient.download(0);
        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new InternalError('Image body download failed.', {
                details: {
                    resource: 'club-badge',
                    clubId: params.id,
                },
            });
        }

        return await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    }
    catch (error) {
        throw normalizeUnknownError(error, {
            details: {
                resource: 'club-badge',
                clubId: params.id,
            },
        });
    }
}

/**
 * Handles the GET request for fetching a club badge.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including the `id` of the club.
 * @returns A response containing the club badge in PNG format.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(
        () => getClubBadge({ params }),
        { params },
        { buildResponse: buildPngResponse },
    );
};
