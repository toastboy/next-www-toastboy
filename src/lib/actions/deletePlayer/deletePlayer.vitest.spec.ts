import { describe, expect, it, vi } from 'vitest';

import { beforeDeletePlayerCore, deletePlayerCore } from '@/lib/actions/deletePlayer';
import { AuthError } from '@/lib/errors';
import type { AuthUserSummary } from '@/types/AuthUser';

describe('beforeDeletePlayerCore', () => {
  it('cleans up player data before deletion', async () => {
    const deps = {
      playerService: {
        setFinished: vi.fn().mockResolvedValue(undefined),
        anonymise: vi.fn().mockResolvedValue(undefined),
      },
      playerExtraEmailService: {
        deleteAll: vi.fn().mockResolvedValue(undefined),
      },
      emailVerificationService: {
        deleteAll: vi.fn().mockResolvedValue(undefined),
      },
      clubSupporterService: {
        deleteAll: vi.fn().mockResolvedValue(undefined),
      },
      countrySupporterService: {
        deleteAll: vi.fn().mockResolvedValue(undefined),
      },
    };

    await beforeDeletePlayerCore(
      {
        name: 'Alex',
        email: 'alex@example.com',
        playerId: 42,
        role: 'user',
      },
      deps,
    );

    expect(deps.playerService.setFinished).toHaveBeenCalledWith(42);
    expect(deps.playerExtraEmailService.deleteAll).toHaveBeenCalledWith(42);
    expect(deps.emailVerificationService.deleteAll).toHaveBeenCalledWith(42);
    expect(deps.clubSupporterService.deleteAll).toHaveBeenCalledWith(42);
    expect(deps.countrySupporterService.deleteAll).toHaveBeenCalledWith(42);
    expect(deps.playerService.anonymise).toHaveBeenCalledWith(42);
  });
});

describe('deletePlayerCore', () => {
    type DeleteDeps = NonNullable<Parameters<typeof deletePlayerCore>[0]>;

    const createDeps = (user: AuthUserSummary | null) => {
      const deps = {
        auth: {
          api: {
            deleteUser: vi.fn().mockResolvedValue(undefined),
          },
        },
        headers: vi.fn().mockResolvedValue(new Headers({ cookie: 'mock-auth-state=user' })),
        getCurrentUser: vi.fn().mockResolvedValue(user),
        playerService: {
          setFinished: vi.fn(),
          anonymise: vi.fn(),
        },
        playerExtraEmailService: {
          deleteAll: vi.fn(),
        },
        emailVerificationService: {
          deleteAll: vi.fn(),
        },
        clubSupporterService: {
          deleteAll: vi.fn(),
        },
        countrySupporterService: {
          deleteAll: vi.fn(),
        },
      };

      return deps as unknown as DeleteDeps;
    };

    it('throws AuthError when no authenticated user is available', async () => {
      const deps = createDeps(null);

      await expect(deletePlayerCore(deps)).rejects.toBeInstanceOf(AuthError);
      expect(deps.auth.api.deleteUser).not.toHaveBeenCalled();
    });

    it('deletes the authenticated user', async () => {
      const deps = createDeps({
        name: 'Alex',
        email: 'alex@example.com',
        playerId: 42,
        role: 'user',
      });

      await deletePlayerCore(deps);

      expect(deps.headers).toHaveBeenCalledTimes(1);
      const [deleteUserPayload] = vi.mocked(deps.auth.api.deleteUser).mock.calls[0] as [{
            body: {
                callbackURL: string;
            };
            headers: Headers;
        }];
      expect(deleteUserPayload.headers).toBeInstanceOf(Headers);
      expect(deleteUserPayload.body).toEqual({
        callbackURL: '/footy/auth/accountdeleted',
      });
    });
});
