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

export async function GET(
    request: Request,
    { params }: { params: { id: number } }) {

    try {
        const azureCache = AzureCache.getInstance();
        const containerClient = await azureCache.getContainerClient("clubs");
        const blobClient = containerClient.getBlobClient(params.id.toString() + ".png");

        if (!(await blobClient.exists())) {
            return new Response(params.id.toString() + ".png not found", {
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
    }
    catch (error) {
        console.error('Error fetching badge image:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
