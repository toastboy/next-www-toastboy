import { beforeEach, describe, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, listUsersActionCoreMock, setAdminRoleActionCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    listUsersActionCoreMock: vi.fn().mockResolvedValue([]),
    setAdminRoleActionCoreMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/auth', () => ({
    listUsersActionCore: listUsersActionCoreMock,
    setAdminRoleActionCore: setAdminRoleActionCoreMock,
}));


describe('listUsersAction wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('calls requireAdmin then returns the result of listUsersActionCore');
    it.todo('passes the optional email argument to listUsersActionCore');
    it.todo('propagates AuthError when requireAdmin throws');
});

describe('setAdminRoleAction wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('calls requireAdmin, setAdminRoleActionCore, revalidatePath for both user paths, and broadcasts Users channel');
    it.todo('propagates AuthError when requireAdmin throws without calling revalidatePath or broadcast');
});
