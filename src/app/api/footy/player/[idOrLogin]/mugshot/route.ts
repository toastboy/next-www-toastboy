import AzureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';
import playerService from "services/Player";
import { getPlayer } from '../../common';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export async function GET(
    request: Request,
    { params }: {
        params: {
            idOrLogin: string
        }
    },
) {
    try {
        const player = await getPlayer(params.idOrLogin);
        if (!player) {
            return new Response(`Player ${params.idOrLogin} not found`, {
                status: 404,
            });
        }

        const azureCache = AzureCache.getInstance();
        const containerClient = await azureCache.getContainerClient("mugshots");
        let blobClient = containerClient.getBlobClient(`${player.login}.jpg`);

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
    }
    catch (error) {
        console.error('Error fetching mugshot image:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
