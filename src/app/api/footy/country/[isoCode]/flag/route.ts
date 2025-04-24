import { buildPngResponse, handleGET } from 'lib/api';
import azureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';
import { NextRequest } from 'next/server';

import countryService from 'services/Country';

/**
 * Generates static parameters for the route based on country ISO codes.
 *
 * This function retrieves a list of countries from the `countryService` and maps
 * each country to an object containing its ISO code as a string. The resulting
 * array of parameters can be used for static generation of routes.
 *
 * @returns A promise that resolves to an array of objects containing `isoCode` as a string,
 *          or `null` if no countries are available.
 */
export async function generateStaticParams() {
    const countries = await countryService.getAll();

    return countries ? countries.map((club) => ({
        isoCode: club.isoCode.toString(),
    })) : null;
}

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
    const containerClient = await azureCache.getContainerClient("countries");
    const blobClient = containerClient.getBlobClient(`${params.isoCode}.png`);

    if (!(await blobClient.exists())) {
        return null;
    }

    const downloadBlockBlobResponse = await blobClient.download(0);
    if (!downloadBlockBlobResponse.readableStreamBody) {
        throw new Error('Image body download failed.');
    }
    return await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
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
