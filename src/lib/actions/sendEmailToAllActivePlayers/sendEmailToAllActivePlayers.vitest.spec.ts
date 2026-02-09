import { describe, expect, it, vi } from 'vitest';

import { sendEmailToAllActivePlayersCore } from '@/lib/actions/sendEmailToAllActivePlayers';
import { createMockPlayerData } from '@/tests/mocks/data/playerData';

describe('sendEmailToAllActivePlayersCore', () => {
    it('emails unique addresses for active players only', async () => {
        const playerService = {
            getAll: vi.fn().mockResolvedValue([
                createMockPlayerData({
                    id: 1,
                    finished: null,
                    accountEmail: '  ONE@example.com ',
                    extraEmails: [
                        {
                            id: 11,
                            playerId: 1,
                            email: 'one@example.com',
                            verifiedAt: new Date('2026-01-01T00:00:00Z'),
                            createdAt: new Date('2026-01-01T00:00:00Z'),
                        },
                        {
                            id: 12,
                            playerId: 1,
                            email: 'two@example.com',
                            verifiedAt: null,
                            createdAt: new Date('2026-01-02T00:00:00Z'),
                        },
                    ],
                }),
                createMockPlayerData({
                    id: 2,
                    finished: null,
                    accountEmail: null,
                    extraEmails: [
                        {
                            id: 21,
                            playerId: 2,
                            email: 'THREE@example.com',
                            verifiedAt: null,
                            createdAt: new Date('2026-01-03T00:00:00Z'),
                        },
                    ],
                }),
                createMockPlayerData({
                    id: 3,
                    finished: new Date('2026-01-01T00:00:00Z'),
                    accountEmail: 'freeman@example.com',
                    extraEmails: [],
                }),
            ]),
        };
        const sendEmail = vi.fn().mockResolvedValue(undefined);

        const result = await sendEmailToAllActivePlayersCore(
            {
                cc: 'captain@example.com',
                subject: 'Game Cancelled',
                html: '<p>No game this week</p>',
            },
            {
                playerService,
                sendEmail,
            },
        );

        expect(sendEmail).toHaveBeenCalledTimes(1);
        expect(sendEmail).toHaveBeenCalledWith(
            {
                bcc: "freeman@example.com,one@example.com",
                cc: 'captain@example.com',
                subject: 'Game Cancelled',
                html: '<p>No game this week</p>',
            },
        );
        expect(result).toEqual({ recipientCount: 2 });
    });

    it('returns zero recipients when no active player has an email', async () => {
        const playerService = {
            getAll: vi.fn().mockResolvedValue([
                createMockPlayerData({
                    id: 1,
                    finished: null,
                    accountEmail: null,
                    extraEmails: [],
                }),
                createMockPlayerData({
                    id: 2,
                    finished: new Date('2026-01-01T00:00:00Z'),
                    accountEmail: null,
                    extraEmails: [],
                }),
            ]),
        };
        const sendEmail = vi.fn();

        const result = await sendEmailToAllActivePlayersCore(
            {
                subject: 'Subject',
                html: '<p>Body</p>',
            },
            {
                playerService,
                sendEmail,
            },
        );

        expect(sendEmail).not.toHaveBeenCalled();
        expect(result).toEqual({ recipientCount: 0 });
    });
});
