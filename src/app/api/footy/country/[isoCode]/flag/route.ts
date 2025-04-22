import { buildPngResponse, handleGET } from 'lib/api';
import azureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';
import { NextRequest } from 'next/server';

import countryService from 'services/Country';

export async function generateStaticParams() {
    const countries = await countryService.getAll();

    return countries ? countries.map((club) => ({
        isoCode: club.isoCode.toString(),
    })) : null;
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

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(() => getCountryFlag({ params }), { params }, buildPngResponse);
};
