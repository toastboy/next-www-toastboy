
import { render } from '@testing-library/react';
import { TableNameSchema } from 'prisma/zod/schemas';
import { vi } from 'vitest';

import { Props as RecordsTableProps } from '@/components/RecordsTable/RecordsTable';
import { YearTable } from '@/components/YearTable/YearTable';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

vi.mock('@/components/RecordsTable/RecordsTable');

describe('YearTable', () => {
    it('renders qualified table', () => {
        render(
            <Wrapper>
                <YearTable
                    table={TableNameSchema.enum.points}
                    year={2024}
                    qualified={defaultPlayerRecordDataList}
                    unqualified={[]}
                />
            </Wrapper>,
        );

        const props = extractMockProps<RecordsTableProps>("RecordsTable");
        expect(props.length).toBe(1);
        expect(props[0].year).toBe(2024);
    });

    it('renders both qualified and unqualified tables for averages', () => {
        render(
            <Wrapper>
                <YearTable
                    table={TableNameSchema.enum.averages}
                    year={2024}
                    qualified={defaultPlayerRecordDataList}
                    unqualified={defaultPlayerRecordDataList}
                />
            </Wrapper>,
        );

        const props = extractMockProps<RecordsTableProps>("RecordsTable");
        expect(props.length).toBe(2);
        expect(props[0].year).toBe(2024);
        expect(props[1].year).toBe(2024);
    });
});
