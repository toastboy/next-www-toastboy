import 'server-only';

import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

import { InternalError, normalizeUnknownError } from '@/lib/errors';
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

    private static requireSecret(secretName: string, value: string | undefined): string {
        if (!value) {
            throw new InternalError(`Missing required Azure secret: ${secretName}.`, {
                details: {
                    secretName,
                },
            });
        }

        return value;
    }

    public static getInstance(): AzureCache {
        if (!AzureCache.instance) {
            AzureCache.instance = new AzureCache();
            const secrets = getSecrets();

            AzureCache.tenantId = AzureCache.requireSecret('AZURE_TENANT_ID', secrets.AZURE_TENANT_ID);
            AzureCache.clientId = AzureCache.requireSecret('AZURE_CLIENT_ID', secrets.AZURE_CLIENT_ID);
            AzureCache.clientSecret = AzureCache.requireSecret('AZURE_CLIENT_SECRET', secrets.AZURE_CLIENT_SECRET);
            AzureCache.storageAccountName = AzureCache.requireSecret(
                'AZURE_STORAGE_ACCOUNT_NAME',
                secrets.AZURE_STORAGE_ACCOUNT_NAME,
            );
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
                throw normalizeUnknownError(error, {
                    message: `Failed to create Azure container client "${containerName}".`,
                    details: {
                        containerName,
                    },
                });
            }
        }

        return this.containerClients[containerName];
    }
}

export default AzureCache.getInstance();
