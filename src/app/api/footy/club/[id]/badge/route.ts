import { handleGET } from 'lib/api';
import azureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';
import { NextRequest } from 'next/server';
import clubService from 'services/Club';

export async function generateStaticParams() {
    const clubs = await clubService.getAll();

    return clubs ? clubs.map((club) => ({
        id: club.id.toString(),
    })) : null;
}

async function getClubBadge(
    { params }: { params: Record<string, string> },
): Promise<Buffer | null> {
    try {
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
    catch (error) {
        console.error(`Error in getClubBadge: ${error}`);
        throw error;
    }
}

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(() => getClubBadge({ params }), { params }, "png");
};
