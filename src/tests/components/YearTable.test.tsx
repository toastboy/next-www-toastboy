jest.mock('@/components/TableQualified/TableQualified');

import { render } from '@testing-library/react';
import { TableNameSchema } from 'prisma/generated/schemas';

import { Props as TableQualifiedProps } from '@/components/TableQualified/TableQualified';
import { YearTable } from '@/components/YearTable/YearTable';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecordDataList } from '@/tests/mocks';

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

        const props = extractMockProps<TableQualifiedProps>("TableQualified");
        expect(props.length).toBe(1);
        expect(props[0].title).toBe('2024 Points Table');
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

        const props = extractMockProps<TableQualifiedProps>("TableQualified");
        expect(props.length).toBe(2);
        expect(props[0].year).toBe(2024);
        expect(props[0].title).toBe('2024 Averages Table');
        expect(props[1].year).toBe(2024);
        expect(props[1].title).toBe('Played Fewer than 10 Games');
    });
});
