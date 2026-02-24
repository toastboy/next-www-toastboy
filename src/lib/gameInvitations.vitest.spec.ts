import crypto from 'crypto';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import type { GameInvitationType } from 'prisma/zod/schemas/models/GameInvitation.schema';
import type { OutcomeType } from 'prisma/zod/schemas/models/Outcome.schema';
import type { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sendEmail } from '@/actions/sendEmail';
import { NotFoundError } from '@/lib/errors';
import { buildInvitationEmail, getGameInvitationResponseDetails, sendGameInvitations } from '@/lib/gameInvitations';
import { getPublicBaseUrl } from '@/lib/urls';
import gameDayService from '@/services/GameDay';
import gameInvitationService from '@/services/GameInvitation';
import outcomeService from '@/services/Outcome';
import playerService from '@/services/Player';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { createMockGameInvitation } from '@/tests/mocks/data/gameInvitation';
import { createMockOutcome } from '@/tests/mocks/data/outcome';
import { createMockPlayerData } from '@/tests/mocks/data/playerData';
import type { PlayerDataType } from '@/types';

type ConcretePlayer = Omit<
    PlayerType,
    'comment' | 'name' | 'accountEmail' | 'anonymous' | 'joined' | 'finished' | 'born' | 'introducedBy'
> & {
    comment: string | null;
    name: string | null;
    accountEmail: string | null;
    anonymous: boolean | null;
    joined: Date | null;
    finished: Date | null;
    born: number | null;
    introducedBy: number | null;
};

vi.mock('@/actions/sendEmail', () => ({
    sendEmail: vi.fn(),
}));

vi.mock('@/lib/urls', () => ({
    getPublicBaseUrl: vi.fn(),
}));

vi.mock('@/services/GameDay', () => ({
    default: {
        get: vi.fn(),
        markMailSent: vi.fn(),
    },
}));

vi.mock('@/services/GameInvitation', () => ({
    default: {
        deleteAll: vi.fn(),
        createMany: vi.fn(),
        get: vi.fn(),
    },
}));

vi.mock('@/services/Outcome', () => ({
    default: {
        get: vi.fn(),
    },
}));

vi.mock('@/services/Player', () => ({
    default: {
        getAll: vi.fn(),
        getName: vi.fn(),
        getById: vi.fn(),
        getLogin: vi.fn(),
    },
}));

const mockSendEmail = vi.mocked(sendEmail);
const mockBaseUrl = vi.mocked(getPublicBaseUrl);
const mockGameDayService = vi.mocked(gameDayService);
const mockInvitationService = vi.mocked(gameInvitationService);
const mockOutcomeService = vi.mocked(outcomeService);
const mockPlayerService = vi.mocked(playerService);

const fixedNow = new Date('2026-01-30T12:00:00Z');

describe('buildInvitationEmail', () => {
    it('escapes user content and includes optional message', () => {
        const html = buildInvitationEmail({
            playerName: '<Bob & Co.>',
            inviteLink: 'https://example.com/invite?x=<y>',
            gameDate: new Date('2026-02-14T15:00:00Z'),
            customMessage: 'See you <soon> & bring boots',
        });

        expect(html).toContain('Hello &lt;Bob &amp; Co.&gt;');
        expect(html).toContain('See you &lt;soon&gt; &amp; bring boots');
        expect(html).toContain('https://example.com/invite?x=&lt;y&gt;');
    });

    it('omits the custom message block when absent', () => {
        const html = buildInvitationEmail({
            playerName: 'Alice',
            inviteLink: 'https://example.com/invite',
            gameDate: new Date('2026-02-14'),
        });

        expect(html.includes('Heads up')).toBe(false);
        expect(html).toContain('Hello Alice');
    });
});

describe('sendGameInvitations', () => {
    let gameDay: GameDayType;
    let players: PlayerDataType[];

    beforeEach(() => {
        vi.resetAllMocks();
        vi.useFakeTimers();
        vi.setSystemTime(fixedNow);

        mockBaseUrl.mockReturnValue('https://toast.test');
        gameDay = createMockGameDay({
            id: 99,
            date: new Date('2026-02-15T18:00:00Z'),
            mailSent: null,
        });
        mockGameDayService.get.mockResolvedValue(gameDay);

        players = [
            createMockPlayerData({
                id: 1,
                name: 'Alice',
                finished: null,
                accountEmail: ' Alice@example.com ',
                extraEmails: [
                    {
                        id: 1,
                        playerId: 1,
                        email: 'ALICE@example.com',
                        verifiedAt: null,
                        createdAt: new Date('2025-12-01'),
                    },
                    {
                        id: 2,
                        playerId: 1,
                        email: 'alice+kit@example.com',
                        verifiedAt: null,
                        createdAt: new Date('2025-12-02'),
                    },
                ],
            }),
            createMockPlayerData({
                id: 2,
                name: 'Bob',
                finished: null,
                accountEmail: null,
                extraEmails: [],
            }),
            createMockPlayerData({
                id: 3,
                name: 'Charlie',
                finished: new Date('2024-01-01'),
                accountEmail: 'charlie@example.com',
                extraEmails: [],
            }),
        ];
        mockPlayerService.getAll.mockResolvedValue(players);
        mockPlayerService.getName.mockImplementation((player: PlayerType | PlayerDataType) => player.name ?? `Player ${player.id}`);
        mockInvitationService.createMany.mockResolvedValue(1);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('sends invitations to active players with deduped emails', async () => {
        vi.spyOn(crypto, 'randomUUID').mockReturnValueOnce('123e4567-e89b-12d3-a456-426614174000');

        await sendGameInvitations(99, 'Heads up');

        expect(mockGameDayService.get).toHaveBeenCalledWith(99);
        expect(mockInvitationService.deleteAll).toHaveBeenCalledTimes(1);

        expect(mockInvitationService.createMany).toHaveBeenCalledWith([
            { uuid: '123e4567-e89b-12d3-a456-426614174000', playerId: 1, gameDayId: 99 },
        ]);

        expect(mockSendEmail).toHaveBeenCalledTimes(1);

        const [emailPayload] = mockSendEmail.mock.calls[0] ?? [];
        if (!emailPayload) {
            throw new Error('Expected email payload to be defined.');
        }

        expect(emailPayload).toMatchObject({
            to: 'alice@example.com,alice+kit@example.com',
            subject: 'Toastboy FC invitation',
        });
        expect(emailPayload.html).toContain('Hello Alice');

        const mailSentCall = mockGameDayService.markMailSent.mock.calls[0];
        expect(mailSentCall[0]).toBe(99);
        expect((mailSentCall[1]!).toISOString()).toBe(fixedNow.toISOString());
    });

    it('throws when the game day cannot be found', async () => {
        mockGameDayService.get.mockResolvedValueOnce(null);

        const operation = sendGameInvitations(123);
        await expect(operation).rejects.toBeInstanceOf(NotFoundError);
        await expect(operation).rejects.toThrow('Game day not found.');
        expect(mockInvitationService.deleteAll).not.toHaveBeenCalled();
        expect(mockSendEmail).not.toHaveBeenCalled();
    });
});

describe('getGameInvitationResponseDetails', () => {
    let invitation: GameInvitationType;
    let player: ConcretePlayer;
    let outcome: OutcomeType;

    beforeEach(() => {
        vi.resetAllMocks();

        mockPlayerService.getName.mockImplementation((playerObj: PlayerType) => playerObj.name ?? `Player ${playerObj.id}`);

        invitation = createMockGameInvitation({
            uuid: 'token-abc',
            playerId: 7,
            gameDayId: 42,
        });
        mockInvitationService.get.mockResolvedValue(invitation);

        player = {
            id: 7,
            name: 'Dana',
            accountEmail: null,
            anonymous: false,
            joined: null,
            finished: null,
            born: null,
            comment: null,
            introducedBy: null,
        };
        mockPlayerService.getById.mockResolvedValue(player);
        mockPlayerService.getLogin.mockResolvedValue('dana');

        outcome = createMockOutcome({
            response: 'Yes',
            goalie: true,
            comment: 'In goal',
            playerId: 7,
            gameDayId: 42,
        });
        mockOutcomeService.get.mockResolvedValue(outcome);
    });

    it('returns null for a missing or empty token', async () => {
        expect(await getGameInvitationResponseDetails('')).toBeNull();
    });

    it('returns null when invitation is not found', async () => {
        mockInvitationService.get.mockResolvedValueOnce(null);

        const result = await getGameInvitationResponseDetails('missing');
        expect(result).toBeNull();
    });

    it('returns assembled details when everything is found', async () => {
        const result = await getGameInvitationResponseDetails('token-abc');

        expect(result).toEqual({
            token: 'token-abc',
            playerId: 7,
            playerName: 'Dana',
            playerLogin: 'dana',
            gameDayId: 42,
            response: 'Yes',
            goalie: true,
            comment: 'In goal',
        });

        expect(mockPlayerService.getById).toHaveBeenCalledWith(7);
        expect(mockOutcomeService.get).toHaveBeenCalledWith(42, 7);
    });
});
