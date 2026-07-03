import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireAdminMock, authExportCoreMock } = vi.hoisted(() => ({
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    authExportCoreMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/core/authExport', () => ({ authExportCore: authExportCoreMock }));

import { authExport } from '@/actions/auth-export';

describe('authExport action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('calls requireAdmin then delegates to authExportCore', async () => {
        await authExport();

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(authExportCoreMock).toHaveBeenCalledTimes(1);
    });

    it('propagates AuthError when requireAdmin throws without calling authExportCore', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(authExport()).rejects.toBe(authError);
        expect(authExportCoreMock).not.toHaveBeenCalled();
    });

    it('propagates errors thrown by authExportCore', async () => {
        const coreError = new Error('export failed');
        authExportCoreMock.mockRejectedValueOnce(coreError);

        await expect(authExport()).rejects.toBe(coreError);
    });
});
