import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TableNameSchema } from 'prisma/zod/schemas';
import { vi } from 'vitest';

import { Props as PlayerLinkProps } from '@/components/PlayerLink/PlayerLink';
import { WinnersTable } from '@/components/WinnersTable/WinnersTable';
import { config } from '@/lib/config';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { createMockPlayerRecordData, defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

vi.mock('@/components/PlayerLink/PlayerLink');

const getYearColumnValues = () => {
    const [, tbody] = screen.getAllByRole('rowgroup');
    const rows = within(tbody).getAllByRole('row');
    return rows.map((row) => within(row).getAllByRole('cell')[0].textContent);
};

describe('WinnersTable', () => {
    it('renders winners table with title and records', () => {
        render(
            <Wrapper>
                <WinnersTable
                    table={TableNameSchema.enum.points}
                    records={defaultPlayerRecordDataList}
                />
            </Wrapper>,
        );

        const props = extractMockProps<PlayerLinkProps>('PlayerLink');
        expect(screen.getByText('Points')).toBeInTheDocument();
        expect(props.length).toBe(20);
        expect(props[0].player.name).toEqual('Gary Player');
    });

    it('renders visually hidden column headers for accessibility', () => {
        render(
            <Wrapper>
                <WinnersTable
                    table={TableNameSchema.enum.points}
                    records={defaultPlayerRecordDataList}
                />
            </Wrapper>,
        );

        const headings = screen.getAllByRole('columnheader');
        expect(headings).toHaveLength(2);
        expect(headings[0]).toHaveTextContent('Year');
        expect(headings[1]).toHaveTextContent('Winner(s)');
    });

    it('renders no winners table when there are no records', () => {
        const { container } = render(
            <Wrapper>
                <WinnersTable
                    table={TableNameSchema.enum.points}
                    records={[]}
                />
            </Wrapper>,
        );

        expect(screen.queryByRole('table')).not.toBeInTheDocument();
        expect(screen.queryByText('Points')).not.toBeInTheDocument();
        expect(container.firstChild?.nodeName).toBe('STYLE');
    });

    describe('tied years', () => {
        it('blanks the year cell for subsequent winners in the same year', () => {
            render(
                <Wrapper>
                    <WinnersTable
                        table={TableNameSchema.enum.points}
                        records={[
                            createMockPlayerRecordData({ id: 1, year: 2001 }),
                            createMockPlayerRecordData({ id: 2, year: 2002 }),
                            createMockPlayerRecordData({ id: 3, year: 2002 }),
                            createMockPlayerRecordData({ id: 4, year: 2003 }),
                        ]}
                    />
                </Wrapper>,
            );

            expect(getYearColumnValues()).toEqual(['2001', '2002', '', '2003']);
        });
    });

    describe('show more / show less', () => {
        const manyYears = Array.from(
            { length: config.tableVisibleRows + 5 },
            (_, index) => createMockPlayerRecordData({ id: index + 1, year: 2000 + index }),
        );

        it('renders only the configured number of rows, with a "show more" toggle', () => {
            render(
                <Wrapper>
                    <WinnersTable
                        table={TableNameSchema.enum.points}
                        records={manyYears}
                    />
                </Wrapper>,
            );

            expect(extractMockProps<PlayerLinkProps>('PlayerLink')).toHaveLength(
                config.tableVisibleRows,
            );
            expect(screen.getByRole('button', { name: 'Show 5 more' })).toBeInTheDocument();
        });

        it('reveals the remaining rows when the toggle is clicked, then hides them again', async () => {
            const user = userEvent.setup();
            render(
                <Wrapper>
                    <WinnersTable
                        table={TableNameSchema.enum.points}
                        records={manyYears}
                    />
                </Wrapper>,
            );

            await user.click(screen.getByRole('button', { name: 'Show 5 more' }));

            expect(extractMockProps<PlayerLinkProps>('PlayerLink')).toHaveLength(manyYears.length);
            const showLess = screen.getByRole('button', { name: 'Show less' });

            await user.click(showLess);

            expect(extractMockProps<PlayerLinkProps>('PlayerLink')).toHaveLength(
                config.tableVisibleRows,
            );
        });

        it('does not render a toggle when all rows already fit', () => {
            render(
                <Wrapper>
                    <WinnersTable
                        table={TableNameSchema.enum.points}
                        records={[
                            createMockPlayerRecordData({ id: 1, year: 2001 }),
                            createMockPlayerRecordData({ id: 2, year: 2002 }),
                            createMockPlayerRecordData({ id: 3, year: 2003 }),
                        ]}
                    />
                </Wrapper>,
            );

            expect(screen.queryByRole('button', { name: /show/i })).not.toBeInTheDocument();
        });

        it('does not split a year straddling the cutoff', () => {
            const tiedAcrossCutoff = manyYears.map((record, index) =>
                index === config.tableVisibleRows ?
                    { ...record, year: manyYears[config.tableVisibleRows - 1].year } :
                    record,
            );

            render(
                <Wrapper>
                    <WinnersTable
                        table={TableNameSchema.enum.points}
                        records={tiedAcrossCutoff}
                    />
                </Wrapper>,
            );

            expect(extractMockProps<PlayerLinkProps>('PlayerLink')).toHaveLength(
                config.tableVisibleRows + 1,
            );
            expect(screen.getByRole('button', { name: 'Show 4 more' })).toBeInTheDocument();
        });
    });
});
