
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TableName, TableNameSchema } from 'prisma/zod/schemas';
import { vi } from 'vitest';

import { Props as PlayerLinkProps } from '@/components/PlayerLink/PlayerLink';
import { RecordsTable } from '@/components/RecordsTable/RecordsTable';
import { Props as TableScoreProps } from '@/components/TableScore/TableScore';
import { config } from '@/lib/config';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { createMockPlayerRecordData, defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';
import { PlayerRecordDataType } from '@/types';

vi.mock('@/components/PlayerLink/PlayerLink');
vi.mock('@/components/TableScore/TableScore');

const getFirstDataRowCells = () => {
    const [, tbody] = screen.getAllByRole('rowgroup');
    const [firstRow] = within(tbody).getAllByRole('row');
    return within(firstRow).getAllByRole('cell');
};

// Collapses JSX-formatting whitespace (newlines/indentation between
// expressions) so assertions compare against the meaningful text only.
const normalizeText = (text: string | null) => (text ?? '').replace(/\s+/g, ' ').trim();

const getRankColumnValues = () => {
    const [, tbody] = screen.getAllByRole('rowgroup');
    const rows = within(tbody).getAllByRole('row');
    return rows.map((row) => normalizeText(within(row).getAllByRole('cell')[0].textContent));
};

const getRankCell = (rowIndex: number) => {
    const [, tbody] = screen.getAllByRole('rowgroup');
    const rows = within(tbody).getAllByRole('row');
    return within(rows[rowIndex]).getAllByRole('cell')[0];
};

// Text nodes sitting directly in the cell are what a sighted user sees;
// text inside a child element (the VisuallyHidden span) is accessible-only.
const getRankCellVisibleText = (cell: HTMLElement) =>
    normalizeText(
        Array.from(cell.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent)
            .join(''),
    );

describe('RecordsTable', () => {
    it('renders qualified table with player records', () => {
        render(
            <Wrapper>
                <RecordsTable
                    table={TableNameSchema.enum.points}
                    year={2024}
                    records={defaultPlayerRecordDataList}
                />
            </Wrapper>,
        );

        {
            const props = extractMockProps<PlayerLinkProps>('PlayerLink');
            expect(props.length).toBe(20);
            expect(props[0].player.name).toEqual("Gary Player");
        }

        {
            const props = extractMockProps<TableScoreProps>('TableScore');
            expect(props.length).toBe(20);
            expect(props[0].table).toEqual(TableNameSchema.enum.points);
            expect(props[0].playerRecord.playerId).toEqual(12);
        }
    });

    describe.each([
        [TableNameSchema.enum.points, 'rankPoints', 1, 'Points'],
        [TableNameSchema.enum.averages, 'rankAverages', 2, 'Average'],
        [TableNameSchema.enum.stalwart, 'rankStalwart', 3, 'Games Played'],
        [TableNameSchema.enum.speedy, 'rankSpeedy', 4, 'Average Response Time (hh:mm:ss)'],
        [TableNameSchema.enum.pub, 'rankPub', 5, 'Pub Score'],
    ] satisfies [TableName, keyof PlayerRecordDataType, number, string][])(
        'when table is "%s"',
        (table, rankField, expectedRank, expectedHeading) => {
            it(`renders the ${rankField} value in the rank column`, () => {
                render(
                    <Wrapper>
                        <RecordsTable
                            table={table}
                            year={2024}
                            records={[createMockPlayerRecordData({ [rankField]: expectedRank })]}
                        />
                    </Wrapper>,
                );

                const [rankCell] = getFirstDataRowCells();
                expect(rankCell).toHaveTextContent(String(expectedRank));
            });

            it(`renders '-' when ${rankField} is undefined`, () => {
                render(
                    <Wrapper>
                        <RecordsTable
                            table={table}
                            year={2024}
                            records={[createMockPlayerRecordData({ [rankField]: undefined })]}
                        />
                    </Wrapper>,
                );

                const [rankCell] = getFirstDataRowCells();
                expect(rankCell).toHaveTextContent('-');
            });

            it(`renders "${expectedHeading}" as the score column heading`, () => {
                render(
                    <Wrapper>
                        <RecordsTable
                            table={table}
                            year={2024}
                            records={[createMockPlayerRecordData()]}
                        />
                    </Wrapper>,
                );

                const headings = screen.getAllByRole('columnheader');
                expect(headings).toHaveLength(3);
                expect(headings[2]).toHaveTextContent(expectedHeading);
            });
        },
    );

    describe('tied ranks', () => {
        it('blanks out subsequent tied rows visually, while keeping the rank in the accessible text', () => {
            render(
                <Wrapper>
                    <RecordsTable
                        table={TableNameSchema.enum.points}
                        year={2024}
                        records={[
                            createMockPlayerRecordData({ id: 1, rankPoints: 1 }),
                            createMockPlayerRecordData({ id: 2, rankPoints: 2 }),
                            createMockPlayerRecordData({ id: 3, rankPoints: 2 }),
                            createMockPlayerRecordData({ id: 4, rankPoints: 4 }),
                        ]}
                    />
                </Wrapper>,
            );

            // Row 3 has no visible "2" (it's implied by row 2 above it), but its
            // accessible text still contains "2" so screen reader users get the
            // value on every row, not just the first row of the tie.
            expect(getRankColumnValues()).toEqual(['1', '2', '2', '4']);

            const tiedRowCell = getRankCell(2);
            expect(getRankCellVisibleText(tiedRowCell)).toBe('');
            expect(tiedRowCell).toHaveTextContent('2');
        });

        it('applies the same treatment to a three-way tie', () => {
            render(
                <Wrapper>
                    <RecordsTable
                        table={TableNameSchema.enum.points}
                        year={2024}
                        records={[
                            createMockPlayerRecordData({ id: 1, rankPoints: 1 }),
                            createMockPlayerRecordData({ id: 2, rankPoints: 1 }),
                            createMockPlayerRecordData({ id: 3, rankPoints: 1 }),
                        ]}
                    />
                </Wrapper>,
            );

            expect(getRankColumnValues()).toEqual(['1', '1', '1']);

            expect(getRankCellVisibleText(getRankCell(0))).toBe('1');
            expect(getRankCellVisibleText(getRankCell(1))).toBe('');
            expect(getRankCellVisibleText(getRankCell(2))).toBe('');
        });
    });

    describe('missing ranks', () => {
        it('renders "-" independently for each consecutive missing rank, without treating them as a tie', () => {
            render(
                <Wrapper>
                    <RecordsTable
                        table={TableNameSchema.enum.points}
                        year={2024}
                        records={[
                            createMockPlayerRecordData({ id: 1, rankPoints: undefined }),
                            createMockPlayerRecordData({ id: 2, rankPoints: null }),
                            createMockPlayerRecordData({ id: 3, rankPoints: 1 }),
                        ]}
                    />
                </Wrapper>,
            );

            expect(getRankColumnValues()).toEqual(['-', '-', '1']);

            // Every "-" is fully visible content, not a blanked continuation
            // row with an accessible-only value hiding behind it.
            expect(getRankCellVisibleText(getRankCell(0))).toBe('-');
            expect(getRankCellVisibleText(getRankCell(1))).toBe('-');
            expect(getRankCellVisibleText(getRankCell(2))).toBe('1');
        });

        it('does not treat a real rank as tied with a preceding missing rank', () => {
            render(
                <Wrapper>
                    <RecordsTable
                        table={TableNameSchema.enum.points}
                        year={2024}
                        records={[
                            createMockPlayerRecordData({ id: 1, rankPoints: undefined }),
                            createMockPlayerRecordData({ id: 2, rankPoints: 2 }),
                            createMockPlayerRecordData({ id: 3, rankPoints: 2 }),
                        ]}
                    />
                </Wrapper>,
            );

            expect(getRankColumnValues()).toEqual(['-', '2', '2']);
            expect(getRankCellVisibleText(getRankCell(1))).toBe('2');
            expect(getRankCellVisibleText(getRankCell(2))).toBe('');
        });
    });

    describe('show more / show less', () => {
        const untiedRecords = Array.from(
            { length: config.tableVisibleRows + 5 },
            (_, index) => createMockPlayerRecordData({ id: index + 1, rankPoints: index + 1 }),
        );

        it('renders only the configured number of rows, with a "show more" toggle', () => {
            render(
                <Wrapper>
                    <RecordsTable
                        table={TableNameSchema.enum.points}
                        year={2024}
                        records={untiedRecords}
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
                    <RecordsTable
                        table={TableNameSchema.enum.points}
                        year={2024}
                        records={untiedRecords}
                    />
                </Wrapper>,
            );

            await user.click(screen.getByRole('button', { name: 'Show 5 more' }));

            expect(extractMockProps<PlayerLinkProps>('PlayerLink')).toHaveLength(untiedRecords.length);
            const showLess = screen.getByRole('button', { name: 'Show less' });

            await user.click(showLess);

            expect(extractMockProps<PlayerLinkProps>('PlayerLink')).toHaveLength(
                config.tableVisibleRows,
            );
        });

        it('does not render a toggle when all rows already fit', () => {
            render(
                <Wrapper>
                    <RecordsTable
                        table={TableNameSchema.enum.points}
                        year={2024}
                        records={defaultPlayerRecordDataList}
                    />
                </Wrapper>,
            );

            expect(screen.queryByRole('button', { name: /show/i })).not.toBeInTheDocument();
        });

        it('does not split a tie straddling the cutoff', () => {
            const tiedAcrossCutoff = untiedRecords.map((record, index) =>
                index === config.tableVisibleRows ?
                    { ...record, rankPoints: config.tableVisibleRows } :
                    record,
            );

            render(
                <Wrapper>
                    <RecordsTable
                        table={TableNameSchema.enum.points}
                        year={2024}
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

    describe('title', () => {
        it('renders no heading or divider when no title is given', () => {
            render(
                <Wrapper>
                    <RecordsTable
                        table={TableNameSchema.enum.points}
                        year={2024}
                        records={[createMockPlayerRecordData()]}
                    />
                </Wrapper>,
            );

            expect(screen.queryByRole('heading')).not.toBeInTheDocument();
            expect(screen.queryByRole('separator')).not.toBeInTheDocument();
        });

        it('renders the title as a level 2 heading by default', () => {
            render(
                <Wrapper>
                    <RecordsTable
                        table={TableNameSchema.enum.points}
                        year={2024}
                        records={[createMockPlayerRecordData()]}
                        title="Unqualified"
                    />
                </Wrapper>,
            );

            const heading = screen.getByRole('heading', { level: 2, name: 'Unqualified' });
            expect(heading).toBeInTheDocument();
            expect(screen.getByRole('separator')).toBeInTheDocument();
        });

        it('renders the title at an explicit heading level', () => {
            render(
                <Wrapper>
                    <RecordsTable
                        table={TableNameSchema.enum.points}
                        year={2024}
                        records={[createMockPlayerRecordData()]}
                        title="Unqualified"
                        titleOrder={4}
                    />
                </Wrapper>,
            );

            expect(screen.getByRole('heading', { level: 4, name: 'Unqualified' })).toBeInTheDocument();
        });
    });
});
