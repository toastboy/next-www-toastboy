jest.mock('components/PlayerLink/PlayerLink', () => {
    const MockPlayerLink = () => <div data-testid="mock-player-link" />;
    MockPlayerLink.displayName = 'MockPlayerLink';
    return { PlayerLink: MockPlayerLink };
});

jest.mock('components/TableScore/TableScore', () => {
    const MockTableScore = () => <div data-testid="mock-table-score" />;
    MockTableScore.displayName = 'MockTableScore';
    return { TableScore: MockTableScore };
});

import { render, screen } from '@testing-library/react';
import { TableNameSchema } from 'prisma/generated/schemas';

import { TableQualified } from '@/components/TableQualified/TableQualified';
import { defaultPlayerRecordDataList } from '@/tests/mocks';

import { Wrapper } from './lib/common';

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
