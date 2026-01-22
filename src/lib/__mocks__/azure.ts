import { vi } from 'vitest';

const blobClient = {
    exists: vi.fn(),
    download: vi.fn(),
};

const containerClient = {
    exists: vi.fn(),
    getBlobClient: vi.fn().mockReturnValue(blobClient),
};

const azureCache = {
    getContainerClient: vi.fn().mockReturnValue(containerClient),
};

export default azureCache;
