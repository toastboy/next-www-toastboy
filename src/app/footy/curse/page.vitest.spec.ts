import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/PlayerRecord');
vi.mock('services/Outcome');

vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
    permanentRedirect: vi.fn(() => { throw new Error('permanent_redirect'); }),
}));

vi.mock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock('@mantine/core', () => ({
    Flex: ({ children }: { children?: unknown }) => children,
    Group: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/CurseOfTheBibs/CurseOfTheBibs', () => ({
    CurseOfTheBibs: vi.fn(() => null),
}));

vi.mock('@/components/TitleWithYearDropdown/TitleWithYearDropdown', () => ({
    TitleWithYearDropdown: vi.fn(() => null),
}));

import { permanentRedirect } from 'next/navigation';

import CurseOfTheBibsPage, { generateMetadata } from '@/app/footy/curse/page';
import outcomeService from '@/services/Outcome';
import playerRecordService from '@/services/PlayerRecord';

const bibsData = { wins: 10, draws: 2, losses: 3 };

describe('Curse of the Bibs page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (playerRecordService.getAllYears as Mock).mockResolvedValue([0, 2023, 2024]);
        (outcomeService.getByBibs as Mock).mockResolvedValue(bibsData);
    });

    it('fetches allYears from playerRecordService', async () => {
        await CurseOfTheBibsPage({ searchParams: Promise.resolve({ year: '2024' }) });

        expect(playerRecordService.getAllYears).toHaveBeenCalledWith({
            completed: false,
            mostRecentFirst: true,
        });
    });

    it('fetches bibs data for the selected year', async () => {
        await CurseOfTheBibsPage({ searchParams: Promise.resolve({ year: '2024' }) });

        expect(outcomeService.getByBibs).toHaveBeenCalledWith({ year: 2024 });
    });

    it('calls notFound when the selected year is not in allYears', async () => {
        await expect(
            CurseOfTheBibsPage({ searchParams: Promise.resolve({ year: '1999' }) }),
        ).rejects.toThrow('not_found');
    });

    it('calls notFound when the year param is not a valid integer', async () => {
        await expect(
            CurseOfTheBibsPage({ searchParams: Promise.resolve({ year: 'notanumber' }) }),
        ).rejects.toThrow('not_found');
    });

    it('defaults to year 0 (all-time) when no year param is provided', async () => {
        await CurseOfTheBibsPage({ searchParams: Promise.resolve({}) });

        expect(outcomeService.getByBibs).toHaveBeenCalledWith({ year: 0 });
        expect(permanentRedirect).not.toHaveBeenCalled();
    });

    it('parses the year search param into a number before querying services', async () => {
        await CurseOfTheBibsPage({ searchParams: Promise.resolve({ year: '2023' }) });

        expect(outcomeService.getByBibs).toHaveBeenCalledWith({ year: 2023 });
    });

    it('permanently redirects to the canonical URL when year=0 is explicit in the query', async () => {
        await expect(
            CurseOfTheBibsPage({ searchParams: Promise.resolve({ year: '0' }) }),
        ).rejects.toThrow('permanent_redirect');

        expect(permanentRedirect).toHaveBeenCalledWith('/footy/curse');
    });

    it('handles service errors gracefully', async () => {
        (playerRecordService.getAllYears as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(
            CurseOfTheBibsPage({ searchParams: Promise.resolve({ year: '2024' }) }),
        ).rejects.toThrow('DB failed');
    });

    it('generates metadata with the year-specific title', async () => {
        const metadata = await generateMetadata({ searchParams: Promise.resolve({ year: '2024' }) });

        expect(metadata.title).toBe('2024 Curse of the Bibs');
    });

    it('generates metadata with the all-time title when no year is provided', async () => {
        const metadata = await generateMetadata({ searchParams: Promise.resolve({}) });

        expect(metadata.title).toBe('All-time Curse of the Bibs');
    });
});
