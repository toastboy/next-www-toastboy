import { beforeEach, describe, it, vi } from 'vitest';

const { requireAdminMock, authExportCoreMock } = vi.hoisted(() => ({
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    authExportCoreMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/core/authExport', () => ({ authExportCore: authExportCoreMock }));


describe('authExport action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('calls requireAdmin then delegates to authExportCore');
    it.todo('propagates AuthError when requireAdmin throws without calling authExportCore');
    it.todo('propagates errors thrown by authExportCore');
});
