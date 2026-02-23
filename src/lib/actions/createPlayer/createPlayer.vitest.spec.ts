import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ValidationError } from '@/lib/errors';

const { createVerificationTokenMock } = vi.hoisted(() => ({
  createVerificationTokenMock: vi.fn(() => ({
    token: 'invite-token',
    expiresAt: new Date('2026-03-01T12:00:00.000Z'),
  })),
}));

vi.mock('@/lib/verificationToken', () => ({
  createVerificationToken: createVerificationTokenMock,
}));

vi.mock('@/lib/urls', () => ({
  getPublicBaseUrl: vi.fn(() => 'https://example.test'),
}));

import { addPlayerInviteCore, createPlayerCore } from '@/lib/actions/createPlayer';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createPlayerCore', () => {
  it('creates a player and returns an invite link', async () => {
    const playerService = {
      create: vi.fn().mockResolvedValue({
        id: 55,
        name: 'Alex Example',
      }),
    };
    const emailVerificationService = {
      create: vi.fn().mockResolvedValue(undefined),
    };

    const result = await createPlayerCore(
      {
        name: '  Alex Example  ',
        email: 'alex@example.com',
        introducedBy: '7',
      },
      { playerService, emailVerificationService },
    );

    expect(playerService.create).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Alex Example',
      introducedBy: 7,
      accountEmail: 'alex@example.com',
    }));
    const [createPayload] = vi.mocked(playerService.create).mock.calls[0] as [{
      joined: Date;
    }];
    expect(createPayload.joined).toBeInstanceOf(Date);
    expect(emailVerificationService.create).toHaveBeenCalledWith({
      playerId: 55,
      email: 'alex@example.com',
      token: 'invite-token',
      expiresAt: new Date('2026-03-01T12:00:00.000Z'),
    });
    expect(result).toEqual({
      player: {
        id: 55,
        name: 'Alex Example',
      },
      inviteLink: 'https://example.test/api/footy/auth/verify/player-invite/invite-token?redirect=/footy/auth/claim',
    });
  });

  it('throws ValidationError when introducer is not numeric', async () => {
    const playerService = {
      create: vi.fn(),
    };
    const emailVerificationService = {
      create: vi.fn(),
    };

    await expect(
      createPlayerCore(
        {
          name: 'Alex Example',
          email: 'alex@example.com',
          introducedBy: 'not-a-number',
        },
        { playerService, emailVerificationService },
      ),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(playerService.create).not.toHaveBeenCalled();
    expect(emailVerificationService.create).not.toHaveBeenCalled();
  });
});

describe('addPlayerInviteCore', () => {
  it('creates an email verification and returns a claim URL', async () => {
    const playerService = {
      create: vi.fn(),
    };
    const emailVerificationService = {
      create: vi.fn().mockResolvedValue(undefined),
    };

    const inviteLink = await addPlayerInviteCore(
      99,
      'invitee@example.com',
      { playerService, emailVerificationService },
    );

    expect(createVerificationTokenMock).toHaveBeenCalledTimes(1);
    expect(emailVerificationService.create).toHaveBeenCalledWith({
      playerId: 99,
      email: 'invitee@example.com',
      token: 'invite-token',
      expiresAt: new Date('2026-03-01T12:00:00.000Z'),
    });
    expect(inviteLink).toBe(
      'https://example.test/api/footy/auth/verify/player-invite/invite-token?redirect=/footy/auth/claim',
    );
  });

  it('returns a claim URL without creating verification when email is empty', async () => {
    const playerService = {
      create: vi.fn(),
    };
    const emailVerificationService = {
      create: vi.fn(),
    };

    const inviteLink = await addPlayerInviteCore(
      100,
      '',
      { playerService, emailVerificationService },
    );

    expect(emailVerificationService.create).not.toHaveBeenCalled();
    expect(inviteLink).toBe(
      'https://example.test/api/footy/auth/verify/player-invite/invite-token?redirect=/footy/auth/claim',
    );
  });
});
