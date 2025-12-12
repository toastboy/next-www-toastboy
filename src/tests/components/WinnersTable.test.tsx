jest.mock('components/PlayerLink/PlayerLink', () => {
    const MockPlayerLink = () => <div data-testid="mock-player-link" />;
    MockPlayerLink.displayName = 'MockPlayerLink';
    return { PlayerLink: MockPlayerLink };
});

import { render, screen } from '@testing-library/react';
import { TableNameSchema } from 'prisma/generated/schemas';

import { WinnersTable } from '@/components/WinnersTable/WinnersTable';
import { defaultPlayerRecordDataList } from '@/tests/mocks';

import { Wrapper } from './lib/common';

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
