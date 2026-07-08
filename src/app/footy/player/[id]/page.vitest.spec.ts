import { TableNameSchema } from 'prisma/zod/schemas';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/Player');
vi.mock('services/PlayerRecord');
vi.mock('services/ClubSupporter');
vi.mock('services/CountrySupporter');
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
vi.mock('@/actions/sendEmail', () => ({
    sendEmail: vi.fn(),
}));
vi.mock('@/components/PlayerProfile/PlayerProfile', () => ({
    PlayerProfile: vi.fn(() => null),
}));
vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: vi.fn(() => null),
}));

import { permanentRedirect } from 'next/navigation';

import PlayerPage, { generateMetadata } from '@/app/footy/player/[id]/page';
import { PlayerProfile } from '@/components/PlayerProfile/PlayerProfile';
import { getUserRole } from '@/lib/auth.server';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import outcomeService from '@/services/Outcome';
import playerService from '@/services/Player';
import playerRecordService from '@/services/PlayerRecord';

const player = {
    id: 7,
    name: 'Alice',
    joined: new Date('2020-01-01'),
    finished: null,
    born: 1990,
    introducedBy: null,
    comment: null,
    anonymous: false,
};

describe('Player [id] page', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (playerService.getById as Mock).mockResolvedValue(player);
        (playerService.getByLogin as Mock).mockResolvedValue(player);
        (playerService.getYearsActive as Mock).mockResolvedValue([0, 2021]);
        (playerService.getLastResult as Mock).mockResolvedValue(null);
        (playerService.getPrevious as Mock).mockResolvedValue(null);
        (playerService.getNext as Mock).mockResolvedValue(null);
        (playerService.getEmailDataById as Mock).mockResolvedValue(null);
        (outcomeService.getHistoryByPlayer as Mock).mockResolvedValue([]);
        (clubSupporterService.getByPlayer as Mock).mockResolvedValue([]);
        (countrySupporterService.getByPlayer as Mock).mockResolvedValue([]);
        (playerRecordService.getForYearByPlayer as Mock).mockResolvedValue(null);
        (playerRecordService.getWinners as Mock).mockResolvedValue([]);
        (getUserRole as Mock).mockResolvedValue('none');
    });

    describe('unpackParams', () => {
        it('looks up player by numeric id', async () => {
            await PlayerPage({
                params: Promise.resolve({ id: '7' }),
                searchParams: Promise.resolve({}),
            });

            expect(playerService.getById).toHaveBeenCalledWith(7);
            expect(playerService.getByLogin).not.toHaveBeenCalled();
        });

        it('looks up player by login string when id is not numeric', async () => {
            await expect(
                PlayerPage({
                    params: Promise.resolve({ id: 'alice' }),
                    searchParams: Promise.resolve({}),
                }),
            ).rejects.toThrow('permanent_redirect');

            expect(playerService.getByLogin).toHaveBeenCalledWith('alice');
            expect(playerService.getById).not.toHaveBeenCalled();
        });

        it('calls notFound when player cannot be found', async () => {
            (playerService.getById as Mock).mockResolvedValue(null);

            await expect(
                PlayerPage({
                    params: Promise.resolve({ id: '7' }),
                    searchParams: Promise.resolve({}),
                }),
            ).rejects.toThrow('not_found');
        });

        it('calls notFound when the year is not in the player\'s active years', async () => {
            await expect(
                PlayerPage({
                    params: Promise.resolve({ id: '7' }),
                    searchParams: Promise.resolve({ year: '2099' }),
                }),
            ).rejects.toThrow('not_found');
        });

        it('calls notFound when the year param is not a valid integer', async () => {
            await expect(
                PlayerPage({
                    params: Promise.resolve({ id: '7' }),
                    searchParams: Promise.resolve({ year: 'notanumber' }),
                }),
            ).rejects.toThrow('not_found');
        });

        it('calls permanentRedirect when a login-based URL has a numeric canonical URL', async () => {
            await expect(
                PlayerPage({
                    params: Promise.resolve({ id: 'alice' }),
                    searchParams: Promise.resolve({}),
                }),
            ).rejects.toThrow('permanent_redirect');

            expect(permanentRedirect).toHaveBeenCalledWith('/footy/player/7');
        });

        it('calls permanentRedirect when a year-based URL does not match the canonical URL', async () => {
            // year=0 is "all-time"; canonical URL has no ?year param, so ?year=0 triggers redirect
            await expect(
                PlayerPage({
                    params: Promise.resolve({ id: '7' }),
                    searchParams: Promise.resolve({ year: '0' }),
                }),
            ).rejects.toThrow('permanent_redirect');

            expect(permanentRedirect).toHaveBeenCalledWith('/footy/player/7');
        });
    });

    describe('Page', () => {
        const call = () => PlayerPage({
            params: Promise.resolve({ id: '7' }),
            searchParams: Promise.resolve({}),
        });

        it('fetches trophies for all tables in parallel via Promise.all', async () => {
            await call();

            expect(playerRecordService.getWinners).toHaveBeenCalledTimes(TableNameSchema.options.length);
        });

        it('calls getWinners with the player id for each table', async () => {
            await call();

            for (const table of TableNameSchema.options) {
                expect(playerRecordService.getWinners).toHaveBeenCalledWith(table, 0, player.id);
            }
        });

        it('fetches lastPlayed, form, clubs, countries, and record data for the player', async () => {
            await call();

            expect(playerService.getLastResult).toHaveBeenCalledWith(player.id, 0);
            expect(playerService.getLastResult).toHaveBeenCalledWith(player.id, 0, 3);
            expect(clubSupporterService.getByPlayer).toHaveBeenCalledWith(player.id);
            expect(countrySupporterService.getByPlayer).toHaveBeenCalledWith(player.id);
            expect(playerRecordService.getForYearByPlayer).toHaveBeenCalledWith(0, player.id);
        });

        it('passes trophies Map to PlayerProfile', async () => {
            (playerRecordService.getWinners as Mock).mockImplementation(() => [{ id: 1 }]);

            renderToStaticMarkup(await call());

            const [[props]] = (PlayerProfile as Mock).mock.calls as [{ trophies: Map<string, unknown[]> }][];
            expect(props.trophies).toBeInstanceOf(Map);
            for (const table of TableNameSchema.options) {
                expect(props.trophies.get(table)).toEqual([{ id: 1 }]);
            }
        });

        it('propagates errors from a service call', async () => {
            (outcomeService.getHistoryByPlayer as Mock).mockRejectedValue(new Error('DB failed'));

            await expect(call()).rejects.toThrow('DB failed');
        });

        it('fetches the introducedBy player when the player has one', async () => {
            const playerWithIntroducer = { ...player, introducedBy: 23 };
            (playerService.getById as Mock).mockImplementation((id: number) =>
                (id === player.id ? playerWithIntroducer : { ...player, id, name: 'Introducer' }));

            await PlayerPage({
                params: Promise.resolve({ id: '7' }),
                searchParams: Promise.resolve({}),
            });

            expect(playerService.getById).toHaveBeenCalledWith(23);
        });

        it('passes the player\'s finished date to outcomeService.getHistoryByPlayer when set', async () => {
            const finished = new Date('2022-06-01');
            (playerService.getById as Mock).mockResolvedValue({ ...player, finished });

            await call();

            expect(outcomeService.getHistoryByPlayer).toHaveBeenCalledWith(player.id, 0, player.joined, finished);
        });

        it('passes undefined to outcomeService.getHistoryByPlayer when the player has no joined date', async () => {
            (playerService.getById as Mock).mockResolvedValue({ ...player, joined: null });

            await call();

            expect(outcomeService.getHistoryByPlayer).toHaveBeenCalledWith(player.id, 0, undefined, undefined);
        });
    });

    describe('generateMetadata', () => {
        it('builds a title from the player name and year', async () => {
            const metadata = await generateMetadata({
                params: Promise.resolve({ id: '7' }),
                searchParams: Promise.resolve({ year: '2021' }),
            });

            expect(metadata.title).toBe('Alice: 2021');
        });

        it('uses "All-time" in the title when no year is given', async () => {
            const metadata = await generateMetadata({
                params: Promise.resolve({ id: '7' }),
                searchParams: Promise.resolve({}),
            });

            expect(metadata.title).toBe('Alice: All-time');
        });
    });
});
