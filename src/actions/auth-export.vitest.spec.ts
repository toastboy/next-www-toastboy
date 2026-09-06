import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireAdminMock, coreAuthExportMock } = vi.hoisted(() => ({
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    coreAuthExportMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/core/authExport', () => ({
    coreAuthExport: coreAuthExportMock,
}));

import { authExport } from '@/actions/auth-export';

describe('authExport action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls requireAdmin then delegates to coreAuthExport', async () => {
        await authExport();

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(coreAuthExportMock).toHaveBeenCalledTimes(1);
    });

    it('propagates AuthError when requireAdmin throws without calling coreAuthExport', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(authExport()).rejects.toBe(authError);
        expect(coreAuthExportMock).not.toHaveBeenCalled();
    });

    it('propagates errors thrown by coreAuthExport', async () => {
        const coreError = new Error('export failed');
        coreAuthExportMock.mockRejectedValueOnce(coreError);

        await expect(authExport()).rejects.toBe(coreError);
    });
});
