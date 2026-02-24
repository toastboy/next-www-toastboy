import { beforeEach, describe, expect, it, vi } from 'vitest';

import { updatePlayerCore } from '@/lib/actions/updatePlayer';

describe('updatePlayerCore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates player info and related associations', async () => {
    const updatedPlayer = {
      id: 7,
      name: 'Alex Updated',
    };
    const deps = {
      playerService: {
        update: vi.fn().mockResolvedValue(updatedPlayer),
      },
      playerExtraEmailService: {
        create: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
      },
      clubSupporterService: {
        deleteExcept: vi.fn().mockResolvedValue(undefined),
        upsertAll: vi.fn().mockResolvedValue(undefined),
      },
      countrySupporterService: {
        deleteExcept: vi.fn().mockResolvedValue(undefined),
        upsertAll: vi.fn().mockResolvedValue(undefined),
      },
      sendEmailVerificationCore: vi.fn().mockResolvedValue(undefined),
    };

    const result = await updatePlayerCore(
      7,
      {
        name: 'Alex Updated',
        anonymous: false,
        finished: null,
        born: 1990,
        extraEmails: ['existing@example.com'],
        addedExtraEmails: ['new@example.com'],
        removedExtraEmails: ['old@example.com'],
        countries: ['GB-ENG'],
        clubs: [10, 12],
        comment: 'Updated profile',
      },
      deps,
    );

    expect(deps.playerService.update).toHaveBeenCalledWith({
      id: 7,
      anonymous: false,
      name: 'Alex Updated',
      born: 1990,
      comment: 'Updated profile',
      finished: null,
    });
    expect(deps.playerExtraEmailService.create).toHaveBeenCalledWith({
      playerId: 7,
      email: 'new@example.com',
    });
    expect(deps.sendEmailVerificationCore).toHaveBeenCalledWith(
      'new@example.com',
      updatedPlayer,
    );
    expect(deps.playerExtraEmailService.delete).toHaveBeenCalledWith('old@example.com');
    expect(deps.clubSupporterService.deleteExcept).toHaveBeenCalledWith(7, [10, 12]);
    expect(deps.clubSupporterService.upsertAll).toHaveBeenCalledWith(7, [10, 12]);
    expect(deps.countrySupporterService.deleteExcept).toHaveBeenCalledWith(7, ['GB-ENG']);
    expect(deps.countrySupporterService.upsertAll).toHaveBeenCalledWith(7, ['GB-ENG']);
    expect(result).toEqual(updatedPlayer);
  });

  it('continues when add/remove extra-email side effects fail and logs errors', async () => {
    const updatedPlayer = {
      id: 7,
      name: 'Alex Updated',
    };
    const deps = {
      playerService: {
        update: vi.fn().mockResolvedValue(updatedPlayer),
      },
      playerExtraEmailService: {
        create: vi.fn().mockImplementation(({ email }: { email: string }) => {
          if (email === 'bad-add@example.com') {
            throw new Error('cannot create email');
          }
        }),
        delete: vi.fn().mockImplementation((email: string) => {
          if (email === 'bad-remove@example.com') {
            throw new Error('cannot delete email');
          }
        }),
      },
      clubSupporterService: {
        deleteExcept: vi.fn().mockResolvedValue(undefined),
        upsertAll: vi.fn().mockResolvedValue(undefined),
      },
      countrySupporterService: {
        deleteExcept: vi.fn().mockResolvedValue(undefined),
        upsertAll: vi.fn().mockResolvedValue(undefined),
      },
      sendEmailVerificationCore: vi.fn().mockResolvedValue(undefined),
    };
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const result = await updatePlayerCore(
      7,
      {
        name: 'Alex Updated',
        anonymous: false,
        finished: null,
        born: 1990,
        extraEmails: [],
        addedExtraEmails: ['bad-add@example.com', 'good-add@example.com'],
        removedExtraEmails: ['bad-remove@example.com', 'good-remove@example.com'],
        countries: ['GB-ENG'],
        clubs: [10],
        comment: 'Updated profile',
      },
      deps,
    );

    expect(deps.playerExtraEmailService.create).toHaveBeenCalledTimes(2);
    expect(deps.sendEmailVerificationCore).toHaveBeenCalledTimes(1);
    expect(deps.sendEmailVerificationCore).toHaveBeenCalledWith(
      'good-add@example.com',
      updatedPlayer,
    );
    expect(deps.playerExtraEmailService.delete).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error sending verification email to:',
      'bad-add@example.com',
      expect.any(Error),
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error removing player extra email:',
      'bad-remove@example.com',
      expect.any(Error),
    );
    expect(deps.clubSupporterService.upsertAll).toHaveBeenCalledWith(7, [10]);
    expect(deps.countrySupporterService.upsertAll).toHaveBeenCalledWith(7, ['GB-ENG']);
    expect(result).toEqual(updatedPlayer);

    consoleErrorSpy.mockRestore();
  });
});
