jest.mock('@/components/PlayerLink/PlayerLink');
jest.mock('@/components/TableScore/TableScore');

import { render, screen } from '@testing-library/react';
import { TableNameSchema } from 'prisma/generated/schemas';

import { TableQualified } from '@/components/TableQualified/TableQualified';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecordDataList } from '@/tests/mocks';

describe('TableQualified', () => {
    it('renders qualified table with player records', () => {
        render(
            <Wrapper>
                <TableQualified
                    table={TableNameSchema.enum.points}
                    title="2024 Points Table"
                    year={2024}
                    records={defaultPlayerRecordDataList}
                />
            </Wrapper>,
        );

        expect(screen.getByText('2024 Points Table')).toBeInTheDocument();
        const playerLinks = screen.getAllByTestId('mock-player-link');
        expect(playerLinks.length).toBeGreaterThan(0);
    });
});
