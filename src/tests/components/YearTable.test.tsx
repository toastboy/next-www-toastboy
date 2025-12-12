jest.mock('components/TableQualified/TableQualified', () => {
    const MockTableQualified = () => <div data-testid="mock-table-qualified" />;
    MockTableQualified.displayName = 'MockTableQualified';
    return MockTableQualified;
});

import { render, screen } from '@testing-library/react';
import { TableNameSchema } from 'prisma/generated/schemas';

import YearTable from '@/components/YearTable/YearTable';
import { defaultPlayerRecordDataList } from '@/tests/mocks';

import { Wrapper } from './lib/common';

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

        const tableQualified = screen.getAllByTestId('mock-table-qualified');
        expect(tableQualified.length).toBeGreaterThan(0);
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

        const tableQualified = screen.getAllByTestId('mock-table-qualified');
        expect(tableQualified.length).toBe(2);
    });
});
