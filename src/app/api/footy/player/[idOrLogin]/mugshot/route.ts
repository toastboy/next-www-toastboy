import AzureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';
import playerService from "services/Player";
import { handleGETPNG } from 'app/api/footy/common';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

async function getPlayerMugshot(
    { params }: { params: Record<string, string> },
): Promise<Buffer | null> {
    const player = await playerService.getByIdOrLogin(params.idOrLogin);
    if (!player) return null;

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
    return await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGETPNG(() => getPlayerMugshot({ params }), { params });
