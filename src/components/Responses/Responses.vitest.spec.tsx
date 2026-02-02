import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { Responses } from '@/components/Responses/Responses';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultResponsesAdminData } from '@/tests/mocks/data/responses';

const mockSave = vi.fn();

describe('Responses (TDD)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSave.mockResolvedValue(undefined);
    });

    it('groups responses and shows counts', () => {
        render(
            <Wrapper>
                <Responses
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={defaultResponsesAdminData}
                    onSave={mockSave}
                />
            </Wrapper>,
        );

        expect(screen.getByRole('heading', { name: /Responses/i })).toBeInTheDocument();
        expect(screen.getByTestId('response-group-yes')).toHaveAttribute('data-count', '1');
        expect(screen.getByTestId('response-group-no')).toHaveAttribute('data-count', '1');
        expect(screen.getByTestId('response-group-none')).toHaveAttribute('data-count', '2');
    });

    it('updates a player response and calls onSave', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <Responses
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={defaultResponsesAdminData}
                    onSave={mockSave}
                />
            </Wrapper>,
        );

        const noneGroup = screen.getByTestId('response-group-none');
        const firstRow = within(noneGroup).getAllByTestId('response-row')[0];

        const select = within(firstRow).getByTestId('response-select');
        const goalie = within(firstRow).getByTestId('goalie-checkbox');
        const comment = within(firstRow).getByTestId('comment-input');
        const submit = within(firstRow).getByTestId('response-submit');

        await user.selectOptions(select, 'Yes');
        await user.click(goalie);
        await user.type(comment, 'See you there');
        await user.click(submit);

        await waitFor(() => {
            expect(mockSave).toHaveBeenCalledWith({
                playerId: Number(firstRow.getAttribute('data-player-id')),
                response: 'Yes',
                goalie: true,
                comment: 'See you there',
            });
        });
    });
});
