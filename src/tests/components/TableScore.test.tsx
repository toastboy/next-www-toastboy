import { render, screen } from '@testing-library/react';
import { TableNameSchema } from 'prisma/generated/schemas';

import TableScore from '@/components/TableScore/TableScore';
import { defaultPlayerRecord } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('TableScore', () => {
    it('renders points score', () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.points}
                    playerRecord={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        expect(screen.getByText(String(defaultPlayerRecord.points))).toBeInTheDocument();
    });

    it('renders averages with fixed decimal places', () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.averages}
                    playerRecord={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        const expectedAverage = defaultPlayerRecord.averages?.toFixed(3);
        expect(screen.getByText(expectedAverage!)).toBeInTheDocument();
    });
});
