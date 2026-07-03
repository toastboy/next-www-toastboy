import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
    getSecretsMock,
    clientSecretCredentialMock,
    blobServiceClientMock,
    getContainerClientMock,
} = vi.hoisted(() => ({
    getSecretsMock: vi.fn(),
    clientSecretCredentialMock: vi.fn(),
    blobServiceClientMock: vi.fn(),
    getContainerClientMock: vi.fn(),
}));

vi.mock('@/lib/secrets', () => ({
    getSecrets: getSecretsMock,
}));

vi.mock('@/lib/azureConfig', () => ({
    STORAGE_ACCOUNT_NAME: 'test-storage-account',
}));

vi.mock('@azure/identity', () => ({
    ClientSecretCredential: clientSecretCredentialMock,
}));

vi.mock('@azure/storage-blob', () => ({
    BlobServiceClient: blobServiceClientMock,
    ContainerClient: vi.fn(),
}));

/**
 * Shape of an `InternalError` thrown by the azure module. Asserted
 * structurally (name/code) rather than via `instanceof`, because these tests
 * reload the module graph with `vi.resetModules()` between cases, which
 * produces a distinct `InternalError` class per import that would never
 * match a class reference captured before the reset.
 */
interface ThrownInternalErrorLike {
    name: string;
    message: string;
    details?: unknown;
}

const baselineSecrets = {
    AZURE_TENANT_ID: 'tenant-id',
    STORAGE_CLIENT_ID: 'client-id',
    STORAGE_CLIENT_SECRET: 'client-secret',
};

beforeEach(() => {
    vi.resetModules();
    getSecretsMock.mockReset();
    clientSecretCredentialMock.mockReset();
    blobServiceClientMock.mockReset();
    getContainerClientMock.mockReset();

    getSecretsMock.mockReturnValue(baselineSecrets);
    (blobServiceClientMock as Mock).mockImplementation(function BlobServiceClientMock() {
        return { getContainerClient: getContainerClientMock };
    });
    getContainerClientMock.mockImplementation((containerName: string) => ({ containerName }));
});

afterEach(() => {
    vi.unstubAllEnvs();
});

describe('AzureCache', () => {
    it('builds the blob service client from validated secrets on first use', async () => {
        const { default: azureCache } = await import('@/lib/azure');

        azureCache.getContainerClient('mugshots');

        expect(clientSecretCredentialMock).toHaveBeenCalledWith('tenant-id', 'client-id', 'client-secret');
        expect(blobServiceClientMock).toHaveBeenCalledWith(
            'https://test-storage-account.blob.core.windows.net',
            expect.anything(),
        );
        expect(getContainerClientMock).toHaveBeenCalledWith('mugshots');
    });

    it('returns the already-initialized instance on a second getInstance() call', async () => {
        const { default: azureCache } = await import('@/lib/azure');

        const AzureCacheClass = azureCache.constructor as unknown as { getInstance: () => unknown };
        const second = AzureCacheClass.getInstance();

        expect(second).toBe(azureCache);
        expect(getSecretsMock).toHaveBeenCalledTimes(1);
    });

    it('caches the container client per container name', async () => {
        const { default: azureCache } = await import('@/lib/azure');

        const first = azureCache.getContainerClient('mugshots');
        const second = azureCache.getContainerClient('mugshots');

        expect(second).toBe(first);
        expect(blobServiceClientMock).toHaveBeenCalledTimes(1);
        expect(getContainerClientMock).toHaveBeenCalledTimes(1);
    });

    it('creates a distinct client for a different container name', async () => {
        const { default: azureCache } = await import('@/lib/azure');

        azureCache.getContainerClient('mugshots');
        azureCache.getContainerClient('clubs');

        expect(blobServiceClientMock).toHaveBeenCalledTimes(2);
        expect(getContainerClientMock).toHaveBeenNthCalledWith(1, 'mugshots');
        expect(getContainerClientMock).toHaveBeenNthCalledWith(2, 'clubs');
    });

    it('throws when AZURE_TENANT_ID is missing', async () => {
        getSecretsMock.mockReturnValue({ ...baselineSecrets, AZURE_TENANT_ID: undefined });

        let thrown: unknown;
        try {
            await import('@/lib/azure');
        } catch (error) {
            thrown = error;
        }

        expect((thrown as ThrownInternalErrorLike).name).toBe('InternalError');
        expect((thrown as ThrownInternalErrorLike).message).toBe('Missing required Azure secret: AZURE_TENANT_ID.');
    });

    it('throws when STORAGE_CLIENT_ID is missing', async () => {
        getSecretsMock.mockReturnValue({ ...baselineSecrets, STORAGE_CLIENT_ID: undefined });

        let thrown: unknown;
        try {
            await import('@/lib/azure');
        } catch (error) {
            thrown = error;
        }

        expect((thrown as ThrownInternalErrorLike).name).toBe('InternalError');
        expect((thrown as ThrownInternalErrorLike).message).toBe('Missing required Azure secret: STORAGE_CLIENT_ID.');
    });

    it('throws when STORAGE_CLIENT_SECRET is missing', async () => {
        getSecretsMock.mockReturnValue({ ...baselineSecrets, STORAGE_CLIENT_SECRET: undefined });

        let thrown: unknown;
        try {
            await import('@/lib/azure');
        } catch (error) {
            thrown = error;
        }

        expect((thrown as ThrownInternalErrorLike).name).toBe('InternalError');
        expect((thrown as ThrownInternalErrorLike).message).toBe('Missing required Azure secret: STORAGE_CLIENT_SECRET.');
    });

    it('wraps and rethrows unexpected errors from client construction', async () => {
        (blobServiceClientMock as Mock).mockImplementation(function BlobServiceClientMock() {
            throw new Error('network unreachable');
        });

        const { default: azureCache } = await import('@/lib/azure');

        let thrown: unknown;
        try {
            azureCache.getContainerClient('mugshots');
        } catch (error) {
            thrown = error;
        }

        expect((thrown as ThrownInternalErrorLike).name).toBe('InternalError');
        expect((thrown as ThrownInternalErrorLike).message).toBe('Failed to create Azure container client "mugshots".');
        expect((thrown as ThrownInternalErrorLike).details).toEqual({ containerName: 'mugshots' });
    });
});
