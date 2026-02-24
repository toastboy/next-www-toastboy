import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  captureUnexpectedErrorMock,
  blobServiceClientCtorMock,
  clientSecretCredentialCtorMock,
  getBlockBlobClientMock,
  getContainerClientMock,
  getSecretsMock,
  uploadMock,
} = vi.hoisted(() => ({
  captureUnexpectedErrorMock: vi.fn(),
  blobServiceClientCtorMock: vi.fn(),
  clientSecretCredentialCtorMock: vi.fn(),
  getContainerClientMock: vi.fn(),
  getBlockBlobClientMock: vi.fn(),
  uploadMock: vi.fn(),
  getSecretsMock: vi.fn(),
}));

vi.mock('@azure/identity', () => ({
  ClientSecretCredential: vi.fn(function (...args: unknown[]) {
    clientSecretCredentialCtorMock(...args);
    return { type: 'mock-credential' };
  }),
}));

vi.mock('@azure/storage-blob', () => ({
  BlobServiceClient: vi.fn(function (...args: unknown[]) {
    blobServiceClientCtorMock(...args);
    return {
      getContainerClient: getContainerClientMock,
    };
  }),
}));

vi.mock('@/lib/secrets', () => ({
  getSecrets: getSecretsMock,
}));

vi.mock('@/lib/observability/sentry', () => ({
  captureUnexpectedError: captureUnexpectedErrorMock,
}));

import { authExportCore } from '@/lib/actions/authExport';

describe('authExportCore', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getSecretsMock.mockReturnValue({
      AZURE_TENANT_ID: 'tenant-id',
      AZURE_CLIENT_ID: 'client-id',
      AZURE_CLIENT_SECRET: 'client-secret',
      AZURE_STORAGE_ACCOUNT_NAME: 'storage-account',
      AZURE_CONTAINER_NAME: 'auth-exports',
    });

    uploadMock.mockResolvedValue(undefined);
    getBlockBlobClientMock.mockReturnValue({
      upload: uploadMock,
    });
    getContainerClientMock.mockReturnValue({
      getBlockBlobClient: getBlockBlobClientMock,
    });
  });

  it('exports auth tables to blob storage', async () => {
    const accountFindMany = vi.fn().mockResolvedValue([{ id: 'a1', userId: 'u1' }]);
    const userFindMany = vi.fn().mockResolvedValue([{ id: 'u1', email: 'user@example.com' }]);
    const verificationFindMany = vi
      .fn()
      .mockResolvedValue([{ id: 'v1', identifier: 'user@example.com' }]);

    const depsCandidate = {
      prisma: {
        account: {
          findMany: accountFindMany,
        },
        user: {
          findMany: userFindMany,
        },
        verification: {
          findMany: verificationFindMany,
        },
      },
    };
    const deps = depsCandidate as unknown as Parameters<typeof authExportCore>[0];

    await authExportCore(deps);

    expect(clientSecretCredentialCtorMock).toHaveBeenCalledWith(
      'tenant-id',
      'client-id',
      'client-secret',
    );
    expect(blobServiceClientCtorMock).toHaveBeenCalledWith(
      'https://storage-account.blob.core.windows.net',
      expect.objectContaining({ type: 'mock-credential' }),
    );
    expect(getContainerClientMock).toHaveBeenCalledWith('auth-exports');
    expect(getBlockBlobClientMock).toHaveBeenCalledWith('account.json');
    expect(getBlockBlobClientMock).toHaveBeenCalledWith('user.json');
    expect(getBlockBlobClientMock).toHaveBeenCalledWith('verification.json');
    expect(uploadMock).toHaveBeenCalledTimes(3);
    expect(uploadMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('"id": "a1"'),
      expect.any(Number),
    );
    expect(uploadMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('"email": "user@example.com"'),
      expect.any(Number),
    );
    expect(uploadMock).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('"identifier": "user@example.com"'),
      expect.any(Number),
    );
  });

  it('rethrows when a table export fails', async () => {
    const accountFindMany = vi.fn().mockRejectedValue(new Error('db unavailable'));
    const userFindMany = vi.fn();
    const verificationFindMany = vi.fn();
    const depsCandidate = {
      prisma: {
        account: {
          findMany: accountFindMany,
        },
        user: {
          findMany: userFindMany,
        },
        verification: {
          findMany: verificationFindMany,
        },
      },
    };
    const deps = depsCandidate as unknown as Parameters<typeof authExportCore>[0];

    await expect(authExportCore(deps)).rejects.toThrow('db unavailable');
    expect(accountFindMany).toHaveBeenCalledTimes(1);
    expect(userFindMany).not.toHaveBeenCalled();
    expect(verificationFindMany).not.toHaveBeenCalled();
    expect(getBlockBlobClientMock).not.toHaveBeenCalled();
    expect(uploadMock).not.toHaveBeenCalled();
    expect(captureUnexpectedErrorMock).toHaveBeenCalledTimes(1);
    expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        action: 'authExportCore',
        layer: 'server-action',
      }),
    );
  });
});
