import { handleGETPNG } from 'lib/api';
import AzureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';
import clubService from 'services/Club';

export async function generateStaticParams() {
    const clubs = await clubService.getAll();

    return clubs ? clubs.map((club) => {
        return {
            params: {
                id: club.id,
            },
        };
    }) : null;
}

async function getClubBadge(
    { params }: { params: Record<string, string> },
): Promise<Buffer | null> {
    const azureCache = AzureCache.getInstance();
    const containerClient = await azureCache.getContainerClient("clubs");
    const blobClient = containerClient.getBlobClient(`${params.id.toString()}.png`);

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
    handleGETPNG(() => getClubBadge({ params }), { params });
