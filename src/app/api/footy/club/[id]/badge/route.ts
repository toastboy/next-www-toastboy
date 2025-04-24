import { buildPngResponse, handleGET } from 'lib/api';
import azureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';
import { NextRequest } from 'next/server';
import clubService from 'services/Club';

/**
 * Generates static parameters for the route by fetching all club data.
 * This function retrieves a list of clubs and maps their IDs into a format
 * suitable for static generation.
 *
 * @returns A promise that resolves to an array of objects containing the `id`
 *          of each club as a string, or `null` if no clubs are available.
 */
export async function generateStaticParams() {
    const clubs = await clubService.getAll();

    return clubs ? clubs.map((club) => ({
        id: club.id.toString(),
    })) : null;
}

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
        const containerClient = await azureCache.getContainerClient("clubs");
        const blobClient = containerClient.getBlobClient(`${params.id.toString()}.png`);

        if (!(await blobClient.exists())) {
            return null;
        }

        const downloadBlockBlobResponse = await blobClient.download(0);
        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new Error('Image body download failed.');
        }

        return await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    }
    catch (error) {
        console.error(`Error in getClubBadge: ${error}`);
        throw error;
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
