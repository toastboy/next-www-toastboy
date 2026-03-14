import { beforeEach, describe, expect, it, vi } from 'vitest';

const { captureUnexpectedErrorMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

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
            authService: {
                getSessionUser: vi.fn().mockResolvedValue({
                    id: 'user-1',
                    email: 'account@example.com',
                    playerId: 7,
                }),
                changeCurrentUserEmail: vi.fn().mockResolvedValue({ status: true }),
            },
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
                accountEmail: 'account@example.com',
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
            accountEmail: 'account@example.com',
            anonymous: false,
            name: 'Alex Updated',
            born: 1990,
            comment: 'Updated profile',
            finished: null,
        });
        expect(deps.authService.changeCurrentUserEmail).not.toHaveBeenCalled();
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

    it('continues when add/remove extra-email side effects fail and captures errors', async () => {
        const updatedPlayer = {
            id: 7,
            name: 'Alex Updated',
        };
        const deps = {
            authService: {
                getSessionUser: vi
                    .fn()
                    .mockResolvedValueOnce({
                        id: 'user-1',
                        email: 'old@example.com',
                        playerId: 7,
                    })
                    .mockResolvedValueOnce({
                        id: 'user-1',
                        email: 'new@example.com',
                        playerId: 7,
                    }),
                changeCurrentUserEmail: vi.fn().mockResolvedValue({ status: true }),
            },
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
        const result = await updatePlayerCore(
            7,
            {
                name: 'Alex Updated',
                accountEmail: 'new@example.com',
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

        expect(deps.authService.changeCurrentUserEmail).toHaveBeenCalledWith({
            newEmail: 'new@example.com',
            callbackURL: '/footy/profile',
        });
        expect(deps.playerService.update).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 7,
                accountEmail: 'new@example.com',
            }),
        );
        expect(deps.playerExtraEmailService.create).toHaveBeenCalledTimes(2);
        expect(deps.sendEmailVerificationCore).toHaveBeenCalledTimes(1);
        expect(deps.sendEmailVerificationCore).toHaveBeenCalledWith(
            'good-add@example.com',
            updatedPlayer,
        );
        expect(deps.playerExtraEmailService.delete).toHaveBeenCalledTimes(2);
        expect(captureUnexpectedErrorMock).toHaveBeenCalledTimes(2);
        expect(captureUnexpectedErrorMock).toHaveBeenNthCalledWith(
            1,
            expect.any(Error),
            expect.objectContaining({
                action: 'updatePlayerCore.sendVerificationEmail',
                layer: 'server-action',
            }),
        );
        expect(captureUnexpectedErrorMock).toHaveBeenNthCalledWith(
            2,
            expect.any(Error),
            expect.objectContaining({
                action: 'updatePlayerCore.removeExtraEmail',
                layer: 'server-action',
            }),
        );
        expect(deps.clubSupporterService.upsertAll).toHaveBeenCalledWith(7, [10]);
        expect(deps.countrySupporterService.upsertAll).toHaveBeenCalledWith(7, ['GB-ENG']);
        expect(result).toEqual(updatedPlayer);
    });

    it('throws when the authenticated user is not linked to the target player', async () => {
        const deps = {
            authService: {
                getSessionUser: vi.fn().mockResolvedValue({
                    id: 'user-1',
                    email: 'account@example.com',
                    playerId: 9,
                }),
                changeCurrentUserEmail: vi.fn(),
            },
            playerService: {
                update: vi.fn(),
            },
            playerExtraEmailService: {
                create: vi.fn(),
                delete: vi.fn(),
            },
            clubSupporterService: {
                deleteExcept: vi.fn(),
                upsertAll: vi.fn(),
            },
            countrySupporterService: {
                deleteExcept: vi.fn(),
                upsertAll: vi.fn(),
            },
            sendEmailVerificationCore: vi.fn(),
        };

        await expect(updatePlayerCore(
            7,
            {
                name: 'Alex Updated',
                accountEmail: 'account@example.com',
                anonymous: false,
                finished: null,
                born: 1990,
                extraEmails: [],
                addedExtraEmails: [],
                removedExtraEmails: [],
                countries: ['GB-ENG'],
                clubs: [10],
                comment: 'Updated profile',
            },
            deps,
        )).rejects.toThrow('You are not authorized to edit this player profile.');

        expect(deps.playerService.update).not.toHaveBeenCalled();
        expect(deps.authService.changeCurrentUserEmail).not.toHaveBeenCalled();
    });
});
