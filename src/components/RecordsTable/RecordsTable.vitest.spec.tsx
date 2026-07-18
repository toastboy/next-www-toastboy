
import { render, screen, within } from '@testing-library/react';
import { TableName, TableNameSchema } from 'prisma/zod/schemas';
import { vi } from 'vitest';

import { Props as PlayerLinkProps } from '@/components/PlayerLink/PlayerLink';
import { RecordsTable } from '@/components/RecordsTable/RecordsTable';
import { Props as TableScoreProps } from '@/components/TableScore/TableScore';
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
});
