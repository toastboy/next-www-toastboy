import AzureCache from 'lib/azure';
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

export async function GET(
    request: Request,
    { params }: { params: { isoCode: string } }) {
    const { isoCode } = params;

    try {
        const azureCache = AzureCache.getInstance();
        const containerClient = await azureCache.getContainerClient("countries");
        const blobClient = containerClient.getBlobClient(isoCode + ".png");

        if (!(await blobClient.exists())) {
            return new Response(isoCode + ".png not found", {
                status: 404,
            });
        }

        const downloadBlockBlobResponse = await blobClient.download(0);
        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new Error('Image body download failed.');
        }
        const imageBuffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

        return new Response(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
            },
        });
    } catch (error) {
        console.error('Error fetching flag image:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
