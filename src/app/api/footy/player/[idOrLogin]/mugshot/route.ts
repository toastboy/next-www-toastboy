import { handleGET } from 'lib/api';
import azureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';
import playerService from "services/Player";

async function getPlayerMugshot(
    { params }: { params: Record<string, string> },
): Promise<Buffer | null> {
    const player = await playerService.getByIdOrLogin(params.idOrLogin);
    if (!player) return null;

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
    handleGET(() => getPlayerMugshot({ params }), { params }, "png");
