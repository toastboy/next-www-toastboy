import { render } from '@testing-library/react';
import type { TableName } from 'prisma/zod/schemas';

import { WinnersGrid } from '@/components/WinnersGrid/WinnersGrid';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

vi.mock('@/components/WinnersTable/WinnersTable');

describe('WinnersGrid', () => {
    it('renders a WinnersTable for each entry, passing table and records through', () => {
        const winners: {
            table: TableName;
            records: typeof defaultPlayerRecordDataList;
        }[] = [
            { table: 'points', records: defaultPlayerRecordDataList },
            { table: 'averages', records: defaultPlayerRecordDataList },
        ];

        render(
            <Wrapper>
                <WinnersGrid winners={winners} />
            </Wrapper>,
        );

        const props = extractMockProps<{
            table: string;
            records: unknown;
        }>('WinnersTable');
        expect(props).toHaveLength(2);
        expect(props.map((p) => p.table)).toEqual(['points', 'averages']);
        expect(props[0].records).toEqual(
            JSON.parse(JSON.stringify(defaultPlayerRecordDataList)),
        );
    });
});
