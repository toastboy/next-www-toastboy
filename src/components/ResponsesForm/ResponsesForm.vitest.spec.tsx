import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { ResponsesForm } from '@/components/ResponsesForm/ResponsesForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultResponsesAdminData } from '@/tests/mocks/data/responses';

const mockSave = vi.fn();

describe('Responses', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSave.mockResolvedValue(undefined);
    });

    it('groups responses and shows counts', () => {
        render(
            <Wrapper>
                <ResponsesForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={defaultResponsesAdminData}
                    submitAdminResponse={mockSave}
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
                <ResponsesForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={defaultResponsesAdminData}
                    submitAdminResponse={mockSave}
                />
            </Wrapper>,
        );

        const noneGroup = screen.getByTestId('response-group-none');
        const firstRow = within(noneGroup).getAllByTestId('response-row')[0];
        const playerId = Number(firstRow.getAttribute('data-player-id'));

        const select = within(firstRow).getByTestId('response-select');
        const goalie = within(firstRow).getByTestId('goalie-checkbox');
        const comment = within(firstRow).getByTestId('comment-input');
        await user.click(goalie);
        await user.type(comment, 'See you there');
        await user.selectOptions(select, 'Yes');
        expect(screen.getByTestId('response-group-none')).toHaveAttribute('data-count', '2');
        expect(screen.getByTestId('response-group-yes')).toHaveAttribute('data-count', '1');
        const submit = within(firstRow).getByTestId('response-submit');
        await user.click(submit);

        await waitFor(() => {
            expect(mockSave).toHaveBeenCalledWith({
                gameDayId: 1249,
                playerId,
                response: 'Yes',
                goalie: true,
                comment: 'See you there',
            });
        });
        expect(screen.getByTestId('response-group-none')).toHaveAttribute('data-count', '1');
        expect(screen.getByTestId('response-group-yes')).toHaveAttribute('data-count', '2');
    });
});
