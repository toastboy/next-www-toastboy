import AzureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';

import playerService from "services/Player";

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export async function GET(
    request: Request,
    { params }: { params: { idOrLogin: string } }) {
    const { idOrLogin } = params;
    const login = await playerService.getLogin(idOrLogin);

    if (!login) {
        return new Response(login + " not found", {
            status: 404,
        });
    }

    try {
        const azureCache = AzureCache.getInstance();
        const containerClient = await azureCache.getContainerClient("mugshots");
        let blobClient = containerClient.getBlobClient(login + ".jpg");

        if (!(await blobClient.exists())) {
            blobClient = containerClient.getBlobClient('manofmystery.jpg');
        }

        const downloadBlockBlobResponse = await blobClient.download(0);
        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new Error('Image body download failed.');
        }
        const imageBuffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

        return new Response(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/jpeg',
            },
        });
    } catch (error) {
        console.error('Error fetching mugshot image:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
