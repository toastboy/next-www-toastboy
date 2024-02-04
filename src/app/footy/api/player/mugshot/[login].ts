import { NextApiRequest, NextApiResponse } from 'next';
import { BlobServiceClient } from '@azure/storage-blob';
import { ClientSecretCredential } from '@azure/identity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { login } = req.query;

        const tenantId = process.env.AZURE_TENANT_ID;
        if (!tenantId) {
            throw new Error('AZURE_TENANT_ID undefined');
        }

        const clientId = process.env.AZURE_CLIENT_ID;
        if (!clientId) {
            throw new Error('AZURE_CLIENT_ID undefined');
        }

        const clientSecret = process.env.AZURE_CLIENT_SECRET;
        if (!clientSecret) {
            throw new Error('AZURE_CLIENT_SECRET undefined');
        }

        const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        if (!storageAccountName) {
            throw new Error('AZURE_STORAGE_ACCOUNT_NAME undefined');
        }

        const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
        const blobServiceClient = new BlobServiceClient(
            `https://${storageAccountName}.blob.core.windows.net`,
            credentials
        );

        const containerClient = blobServiceClient.getContainerClient("mugshots");
        const blobClient = containerClient.getBlobClient(login + ".jpg");

        // Check if the blob exists
        if (await blobClient.exists()) {
            const downloadBlockBlobResponse = await blobClient.download(0);
            if (!downloadBlockBlobResponse.readableStreamBody) {
                throw new Error('Image body download failed.');
            }
            const imageBuffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

            res.setHeader('Content-Type', 'image/jpeg');
            res.send(imageBuffer);
        } else {
            // Serve placeholder image if the specific image does not exist
            const placeholderBlobClient = containerClient.getBlobClient('manofmystery.jpg');
            const downloadPlaceholderResponse = await placeholderBlobClient.download(0);
            if (!downloadPlaceholderResponse.readableStreamBody) {
                throw new Error('Placeholder image body download failed.');
            }
            const placeholderBuffer = await streamToBuffer(downloadPlaceholderResponse.readableStreamBody);

            res.setHeader('Content-Type', 'image/jpeg');
            res.send(placeholderBuffer);
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Helper function to convert stream to buffer
async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        readableStream.on('data', (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}
