import { render, screen } from '@testing-library/react';

import { HomeContent } from '@/components/HomeContent/HomeContent';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

vi.mock('@/components/AutoRefresh/AutoRefresh');
vi.mock('@/components/RecordsTable/RecordsTable');

describe('HomeContent', () => {
    const tables = ['points', 'averages', 'stalwart'] as const;
    const tableRecords = [
        defaultPlayerRecordDataList,
        defaultPlayerRecordDataList,
        defaultPlayerRecordDataList,
    ];

    it('renders the crest, table leader headings, and the info link', () => {
        render(
            <Wrapper>
                <HomeContent
                    year={2024}
                    tables={tables}
                    tableRecords={tableRecords}
                />
            </Wrapper>,
        );

        expect(
            screen.getByRole('img', { name: 'Toastboy FC Crest' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: 'Table Leaders' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: 'Points' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: 'Averages' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: 'Stalwart' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', {
                name: 'Information about Toastboy FC',
            }),
        ).toHaveAttribute('href', '/footy/info');
    });

    it('passes table, year, and records through to each RecordsTable', () => {
        render(
            <Wrapper>
                <HomeContent
                    year={2024}
                    tables={tables}
                    tableRecords={tableRecords}
                />
            </Wrapper>,
        );

        const props = extractMockProps<{
            table: string;
            year: number;
            records: unknown;
        }>('RecordsTable');
        expect(props).toHaveLength(3);
        expect(props.map((p) => p.table)).toEqual([
            'points',
            'averages',
            'stalwart',
        ]);
        expect(props.every((p) => p.year === 2024)).toBe(true);
    });
});
