jest.mock('@/components/PlayerLink/PlayerLink');

import { render, screen } from '@testing-library/react';
import { TableNameSchema } from 'prisma/generated/schemas';

import { WinnersTable } from '@/components/WinnersTable/WinnersTable';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecordDataList } from '@/tests/mocks';

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

        expect(screen.getByText('Points')).toBeInTheDocument();
        const playerLinks = screen.getAllByTestId('mock-player-link');
        expect(playerLinks.length).toBeGreaterThan(0);
    });
});
