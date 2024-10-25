import { handleGET } from 'lib/api';
import azureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';

import countryService from 'services/Country';

export async function generateStaticParams() {
    const countries = await countryService.getAll();

    return countries ? countries.map((country) => {
        return {
            params: {
                isoCode: country.isoCode,
            },
        };
    }) : null;
}

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

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => getCountryFlag({ params }), { params }, "png");
