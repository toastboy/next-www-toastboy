import { BlobServiceClient } from "@azure/storage-blob";
import { ClientSecretCredential } from '@azure/identity';

type ContainerClientCache = {
    [containerName: string]: ReturnType<BlobServiceClient["getContainerClient"]>;
};

class AzureCache {
    private static instance: AzureCache;
    private static tenantId: string = '';
    private static clientId: string = '';
    private static clientSecret: string = '';
    private static storageAccountName: string = '';
    private containerClients: ContainerClientCache = {};

    // This is a singleton class, so the constructor is private to prevent external instantiation.
    private constructor() { }

    public static getInstance(): AzureCache {
        if (!AzureCache.instance) {
            AzureCache.instance = new AzureCache();

            if (!process.env.AZURE_TENANT_ID) {
                throw new Error('AZURE_TENANT_ID undefined');
            }
            AzureCache.tenantId = process.env.AZURE_TENANT_ID;

            if (!process.env.AZURE_CLIENT_ID) {
                throw new Error('AZURE_CLIENT_ID undefined');
            }
            AzureCache.clientId = process.env.AZURE_CLIENT_ID;

            if (!process.env.AZURE_CLIENT_SECRET) {
                throw new Error('AZURE_CLIENT_SECRET undefined');
            }
            AzureCache.clientSecret = process.env.AZURE_CLIENT_SECRET;

            if (!process.env.AZURE_STORAGE_ACCOUNT_NAME) {
                throw new Error('AZURE_STORAGE_ACCOUNT_NAME undefined');
            }
            AzureCache.storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        }
        return AzureCache.instance;
    }

    private getBlobServiceClient(): BlobServiceClient {
        const credentials = new ClientSecretCredential(AzureCache.tenantId, AzureCache.clientId, AzureCache.clientSecret);
        return new BlobServiceClient(
            `https://${AzureCache.storageAccountName}.blob.core.windows.net`,
            credentials,
        );
    }

    public async getContainerClient(containerName: string): Promise<ReturnType<BlobServiceClient["getContainerClient"]>> {
        if (!this.containerClients[containerName]) {
            try {
                const blobServiceClient = this.getBlobServiceClient();
                const containerClient = blobServiceClient.getContainerClient(containerName);
                this.containerClients[containerName] = containerClient;
            } catch (error) {
                console.error(`Error while getting container client for ${containerName}:`, error);
                throw error;
            }
        }

        return this.containerClients[containerName];
    }
}

export default AzureCache.getInstance();
