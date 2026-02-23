import { describe, expect, it, vi } from 'vitest';

import { listUsersActionCore, setAdminRoleActionCore } from '@/lib/actions/auth';
import { AuthError } from '@/lib/errors';

type AuthDeps = NonNullable<Parameters<typeof listUsersActionCore>[1]>;

const createDeps = (overrides: Partial<AuthDeps> = {}): AuthDeps => {
  const baseDeps = {
    auth: {
      api: {
        listUsers: vi.fn().mockResolvedValue({
          users: [],
          total: 0,
          limit: undefined,
          offset: undefined,
        }),
        setRole: vi.fn().mockResolvedValue(undefined),
      },
    },
    headers: vi.fn().mockResolvedValue(new Headers({ cookie: 'mock-auth-state=none' })),
    getMockAuthState: vi.fn().mockResolvedValue('none'),
    getMockUsersList: vi.fn().mockReturnValue([
      {
        id: 'test-user-id',
        name: 'Test User',
        email: 'testuser@example.com',
        role: 'user',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        emailVerified: false,
        image: null,
        banned: false,
        banReason: null,
        banExpires: null,
      },
      {
        id: 'test-admin-id',
        name: 'Test Admin',
        email: 'testadmin@example.com',
        role: 'admin',
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
        updatedAt: new Date('2026-01-04T00:00:00.000Z'),
        emailVerified: true,
        image: null,
        banned: false,
        banReason: null,
        banExpires: null,
      },
    ]),
  } as unknown as AuthDeps;

  return {
    ...baseDeps,
    ...overrides,
  };
};

describe('listUsersActionCore', () => {
  it('returns serialized users in mock admin mode and applies email filtering', async () => {
    const deps = createDeps({
      getMockAuthState: vi.fn().mockResolvedValue('admin'),
    });

    const allUsers = await listUsersActionCore(undefined, deps);
    const filteredUsers = await listUsersActionCore(
      encodeURIComponent('ADMIN@EXAMPLE.COM'),
      deps,
    );

    expect(allUsers).toHaveLength(2);
    expect(allUsers[0]?.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(allUsers[0]?.updatedAt).toBe('2026-01-02T00:00:00.000Z');
    expect(allUsers[0]?.banExpires).toBeNull();
    expect(filteredUsers).toHaveLength(1);
    expect(filteredUsers[0]?.email).toBe('testadmin@example.com');
    expect(deps.auth.api.listUsers).not.toHaveBeenCalled();
  });

  it('returns an empty array for mock non-admin mode', async () => {
    const deps = createDeps({
      getMockAuthState: vi.fn().mockResolvedValue('user'),
    });

    const users = await listUsersActionCore(undefined, deps);

    expect(users).toEqual([]);
    expect(deps.auth.api.listUsers).not.toHaveBeenCalled();
  });

  it('calls auth api listUsers in live mode with decoded email query', async () => {
    const deps = createDeps({
      getMockAuthState: vi.fn().mockResolvedValue('none'),
    });
    vi.mocked(deps.auth.api.listUsers).mockResolvedValue({
      users: [
        {
          id: 'real-user-id',
          name: 'Real User',
          email: 'real.user@example.com',
          role: 'user',
          createdAt: new Date('2026-02-01T00:00:00.000Z'),
          updatedAt: new Date('2026-02-02T00:00:00.000Z'),
          emailVerified: true,
          image: null,
          banned: false,
          banReason: null,
          banExpires: null,
        },
      ],
      total: 1,
      limit: undefined,
      offset: undefined,
    });

    const users = await listUsersActionCore(
      encodeURIComponent('real.user@example.com'),
      deps,
    );

    expect(deps.headers).toHaveBeenCalledTimes(1);
    const [listUsersPayload] = vi.mocked(deps.auth.api.listUsers).mock.calls[0] as [{
            headers: Headers;
            query: {
                searchField: string;
                searchOperator: string;
                searchValue: string;
            };
        }];
    expect(listUsersPayload.headers).toBeInstanceOf(Headers);
    expect(listUsersPayload.query).toEqual({
      searchField: 'email',
      searchOperator: 'contains',
      searchValue: 'real.user@example.com',
    });
    expect(users).toHaveLength(1);
    expect(users[0]?.createdAt).toBe('2026-02-01T00:00:00.000Z');
  });
});

describe('setAdminRoleActionCore', () => {
  it('does nothing in mock admin mode', async () => {
    const deps = createDeps({
      getMockAuthState: vi.fn().mockResolvedValue('admin'),
    });

    await setAdminRoleActionCore('abc', true, deps);

    expect(deps.auth.api.setRole).not.toHaveBeenCalled();
  });

  it('throws AuthError when mock auth state is forbidden', async () => {
    const deps = createDeps({
      getMockAuthState: vi.fn().mockResolvedValue('user'),
    });

    await expect(setAdminRoleActionCore('abc', true, deps))
      .rejects.toBeInstanceOf(AuthError);
    expect(deps.auth.api.setRole).not.toHaveBeenCalled();
  });

  it('calls auth api setRole in live mode', async () => {
    const deps = createDeps({
      getMockAuthState: vi.fn().mockResolvedValue('none'),
    });

    await setAdminRoleActionCore('abc', false, deps);

    expect(deps.headers).toHaveBeenCalledTimes(1);
    const [setRolePayload] = vi.mocked(deps.auth.api.setRole).mock.calls[0] as [{
            headers: Headers;
            body: {
                userId: string;
                role: string;
            };
        }];
    expect(setRolePayload.headers).toBeInstanceOf(Headers);
    expect(setRolePayload.body).toEqual({
      userId: 'abc',
      role: 'user',
    });
  });
});
