import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('services/Outcome');
vi.mock('@/lib/auth.server');

vi.mock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
    permanentRedirect: vi.fn(() => { throw new Error('permanent_redirect'); }),
}));

vi.mock('@/actions/setGameResult', () => ({
    setGameResult: vi.fn(),
}));

vi.mock('@mantine/core', () => ({
    Flex: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: () => null,
}));

vi.mock('@/components/GameDaySummary/GameDaySummary', () => ({
    GameDaySummary: vi.fn(() => null),
}));

vi.mock('@/components/GameResultForm/GameResultForm', () => ({
    GameResultForm: vi.fn(() => null),
}));

import { notFound, permanentRedirect } from 'next/navigation';

import GamePage, { generateMetadata } from '@/app/footy/game/[id]/page';
import { GameDaySummary } from '@/components/GameDaySummary/GameDaySummary';
import { GameResultForm } from '@/components/GameResultForm/GameResultForm';
import { getUserRole } from '@/lib/auth.server';
import { formatDate } from '@/lib/dates';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { defaultTeamPlayerList } from '@/tests/mocks/data/teamPlayer';

const gameDay = createMockGameDay({ id: 1249, game: true, bibs: 'A' });

describe('Game [id] page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (gameDayService.get as Mock).mockResolvedValue(gameDay);
        (gameDayService.getPrevious as Mock).mockResolvedValue(null);
        (gameDayService.getNext as Mock).mockResolvedValue(null);
        (outcomeService.getTeamPlayersByGameDay as Mock).mockResolvedValue(defaultTeamPlayerList);
        (getUserRole as Mock).mockResolvedValue('none');
    });

    describe('unpackParams', () => {
        it('calls notFound when the id param is not a valid positive integer', async () => {
            await expect(
                GamePage({ params: Promise.resolve({ id: 'abc' }) }),
            ).rejects.toThrow('not_found');

            expect(gameDayService.get).not.toHaveBeenCalled();
        });

        it('calls notFound when the game day cannot be found', async () => {
            (gameDayService.get as Mock).mockResolvedValue(null);

            await expect(
                GamePage({ params: Promise.resolve({ id: '1249' }) }),
            ).rejects.toThrow('not_found');

            expect(notFound).toHaveBeenCalledTimes(1);
        });

        it('calls permanentRedirect when the URL id does not match the canonical id', async () => {
            await expect(
                GamePage({ params: Promise.resolve({ id: '01249' }) }),
            ).rejects.toThrow('permanent_redirect');

            expect(permanentRedirect).toHaveBeenCalledWith('/footy/game/1249');
        });
    });

    describe('generateMetadata', () => {
        it('generates metadata with the formatted game date as the title', async () => {
            const metadata = await generateMetadata({ params: Promise.resolve({ id: '1249' }) });

            expect(metadata.title).toBe(formatDate(gameDay.date));
        });
    });

    describe('Page', () => {
        it('fetches role, prevGame, nextGame, teamA, and teamB in parallel via Promise.all', async () => {
            await GamePage({ params: Promise.resolve({ id: '1249' }) });

            expect(getUserRole).toHaveBeenCalledTimes(1);
            expect(gameDayService.getPrevious).toHaveBeenCalledWith(1249);
            expect(gameDayService.getNext).toHaveBeenCalledWith(1249);
            expect(outcomeService.getTeamPlayersByGameDay).toHaveBeenCalledWith(1249, 'A', 10);
            expect(outcomeService.getTeamPlayersByGameDay).toHaveBeenCalledWith(1249, 'B', 10);
        });

        it('renders the GameResultForm only when the user role is admin', async () => {
            (getUserRole as Mock).mockResolvedValue('admin');

            const element = await GamePage({ params: Promise.resolve({ id: '1249' }) });
            renderToStaticMarkup(element);

            expect(GameResultForm).toHaveBeenCalledTimes(1);
        });

        it('does not render the GameResultForm when the user role is not admin', async () => {
            (getUserRole as Mock).mockResolvedValue('user');

            const element = await GamePage({ params: Promise.resolve({ id: '1249' }) });
            renderToStaticMarkup(element);

            expect(GameResultForm).not.toHaveBeenCalled();
        });

        it('does not render the GameResultForm when the game is not enabled, even for an admin', async () => {
            (gameDayService.get as Mock).mockResolvedValue({ ...gameDay, game: false });
            (getUserRole as Mock).mockResolvedValue('admin');

            const element = await GamePage({ params: Promise.resolve({ id: '1249' }) });
            renderToStaticMarkup(element);

            expect(GameResultForm).not.toHaveBeenCalled();
        });

        it('passes the previous game to GameDaySummary when one exists', async () => {
            const prevGameDay = createMockGameDay({ id: 1248 });
            (gameDayService.getPrevious as Mock).mockResolvedValue(prevGameDay);

            const element = await GamePage({ params: Promise.resolve({ id: '1249' }) });
            renderToStaticMarkup(element);

            const [props] = (GameDaySummary as Mock).mock.calls[0] as [{ prevGameDay: unknown; nextGameDay: unknown }];
            expect(props.prevGameDay).toEqual(prevGameDay);
        });

        it('passes the next game to GameDaySummary when one exists', async () => {
            const nextGameDay = createMockGameDay({ id: 1250 });
            (gameDayService.getNext as Mock).mockResolvedValue(nextGameDay);

            const element = await GamePage({ params: Promise.resolve({ id: '1249' }) });
            renderToStaticMarkup(element);

            const [props] = (GameDaySummary as Mock).mock.calls[0] as [{ prevGameDay: unknown; nextGameDay: unknown }];
            expect(props.nextGameDay).toEqual(nextGameDay);
        });

        it('passes null prev/next games to GameDaySummary when there is no previous or next game', async () => {
            const element = await GamePage({ params: Promise.resolve({ id: '1249' }) });
            renderToStaticMarkup(element);

            const [props] = (GameDaySummary as Mock).mock.calls[0] as [{ prevGameDay: unknown; nextGameDay: unknown }];
            expect(props.prevGameDay).toBeNull();
            expect(props.nextGameDay).toBeNull();
        });

        it('passes null bibs to GameResultForm when the game day has no bibs set', async () => {
            (gameDayService.get as Mock).mockResolvedValue({ ...gameDay, bibs: null });
            (getUserRole as Mock).mockResolvedValue('admin');

            const element = await GamePage({ params: Promise.resolve({ id: '1249' }) });
            renderToStaticMarkup(element);

            const [props] = (GameResultForm as Mock).mock.calls[0] as [{ bibs: unknown }];
            expect(props.bibs).toBeNull();
        });

        it('computes game winners from teamA and teamB', async () => {
            const winningTeam = defaultTeamPlayerList.map((player) => ({
                ...player,
                outcome: { ...player.outcome, points: 3 as const },
            }));
            const losingTeam = defaultTeamPlayerList.map((player) => ({
                ...player,
                outcome: { ...player.outcome, points: 0 as const },
            }));
            (outcomeService.getTeamPlayersByGameDay as Mock).mockImplementation((_id: number, team: string) =>
                Promise.resolve(team === 'A' ? winningTeam : losingTeam));
            (getUserRole as Mock).mockResolvedValue('admin');

            const element = await GamePage({ params: Promise.resolve({ id: '1249' }) });
            renderToStaticMarkup(element);

            const [props] = (GameResultForm as Mock).mock.calls[0] as [{ winners: unknown }];
            expect(props.winners).toBe('A');
        });

        it('handles service errors gracefully', async () => {
            (outcomeService.getTeamPlayersByGameDay as Mock).mockRejectedValue(new Error('DB failed'));

            await expect(
                GamePage({ params: Promise.resolve({ id: '1249' }) }),
            ).rejects.toThrow('DB failed');
        });
    });
});
