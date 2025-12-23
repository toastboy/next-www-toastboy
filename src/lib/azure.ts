import 'server-only';

import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

import { getSecrets } from '@/lib/secrets';

type ContainerClientCache = Record<string, ContainerClient>;

class AzureCache {
    private static instance: AzureCache;
    private static tenantId = '';
    private static clientId = '';
    private static clientSecret = '';
    private static storageAccountName = '';
    private containerClients: ContainerClientCache = {};

    // This is a singleton class, so the constructor is private to prevent external instantiation.
    private constructor() { /* empty */ }

    public static getInstance(): AzureCache {
        if (!AzureCache.instance) {
            AzureCache.instance = new AzureCache();
            const secrets = getSecrets();

            if (!secrets.AZURE_TENANT_ID) throw new Error('AZURE_TENANT_ID undefined');
            AzureCache.tenantId = secrets.AZURE_TENANT_ID;

            if (!secrets.AZURE_CLIENT_ID) throw new Error('AZURE_CLIENT_ID undefined');
            AzureCache.clientId = secrets.AZURE_CLIENT_ID;

            if (!secrets.AZURE_CLIENT_SECRET) throw new Error('AZURE_CLIENT_SECRET undefined');
            AzureCache.clientSecret = secrets.AZURE_CLIENT_SECRET;

            if (!secrets.AZURE_STORAGE_ACCOUNT_NAME) throw new Error('AZURE_STORAGE_ACCOUNT_NAME undefined');
            AzureCache.storageAccountName = secrets.AZURE_STORAGE_ACCOUNT_NAME;
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

    public getContainerClient(containerName: string): ContainerClient {
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
