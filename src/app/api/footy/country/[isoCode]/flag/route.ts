import { NextRequest } from 'next/server';

import { buildPngResponse, handleGET } from '@/lib/api';
import azureCache from '@/lib/azure';
import { InternalError, normalizeUnknownError } from '@/lib/errors';
import { streamToBuffer } from '@/lib/utils';


/**
 * Retrieves the flag image of a country as a Buffer based on the provided ISO code.
 *
 * @param params - An object containing the route parameters, including the `isoCode` of the country.
 * @returns A promise that resolves to a Buffer containing the flag image if it exists, or `null` if the flag is not found.
 * @throws An error if the image body download fails.
 */
async function getCountryFlag(
    { params }: { params: Record<string, string> },
): Promise<Buffer | null> {
    try {
        const containerClient = azureCache.getContainerClient('countries');
        const blobClient = containerClient.getBlobClient(`${params.isoCode}.png`);

        if (!(await blobClient.exists())) {
            return null;
        }

        const downloadBlockBlobResponse = await blobClient.download(0);
        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new InternalError('Image body download failed.', {
                details: {
                    resource: 'country-flag',
                    isoCode: params.isoCode,
                },
            });
        }
        return await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    } catch (error) {
        throw normalizeUnknownError(error, {
            details: {
                resource: 'country-flag',
                isoCode: params.isoCode,
            },
        });
    }
}

/**
 * Handles the GET request for retrieving the flag of a country based on its ISO code.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including the `isoCode` of the country.
 * @returns A response containing the country's flag in PNG format.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(
        () => getCountryFlag({ params }),
        { params },
        { buildResponse: buildPngResponse },
    );
};
