import { buildPngResponse, handleGET } from 'lib/api';
import azureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';
import { NextRequest } from 'next/server';
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

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(() => getPlayerMugshot({ params }), { params }, buildPngResponse);
};
