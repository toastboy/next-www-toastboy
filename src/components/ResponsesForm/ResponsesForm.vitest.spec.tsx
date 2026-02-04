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
        expect(screen.getByTestId('response-group-dunno')).toHaveAttribute('data-count', '0');
        expect(screen.getByTestId('response-group-none')).toHaveAttribute('data-count', '2');
    });

    it('filters players before grouping', async () => {
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

        const filterInput = screen.getByPlaceholderText('Search players');
        await user.type(filterInput, 'Casey');

        expect(screen.getByTestId('response-group-yes')).toHaveAttribute('data-count', '0');
        expect(screen.getByTestId('response-group-no')).toHaveAttribute('data-count', '0');
        expect(screen.getByTestId('response-group-dunno')).toHaveAttribute('data-count', '0');
        expect(screen.getByTestId('response-group-none')).toHaveAttribute('data-count', '1');
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

        const filterInput = screen.getByPlaceholderText('Search players');
        await user.type(filterInput, 'Casey');
        const noneGroup = screen.getByTestId('response-group-none');
        const row = within(noneGroup).getByTestId('response-row');
        const playerId = Number(row.getAttribute('data-player-id'));

        const select = within(row).getByTestId('response-select');
        const goalie = within(row).getByTestId('goalie-checkbox');
        const comment = within(row).getByTestId('comment-input');
        await user.click(goalie);
        await user.type(comment, 'See you there');
        await user.click(select);
        await user.click(await screen.findByRole('option', { name: 'Yes', hidden: true }));
        expect(screen.getByTestId('response-group-none')).toHaveAttribute('data-count', '1');
        expect(screen.getByTestId('response-group-yes')).toHaveAttribute('data-count', '0');
        const submit = within(row).getByTestId('response-submit');
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
        expect(screen.getByTestId('response-group-none')).toHaveAttribute('data-count', '0');
        expect(screen.getByTestId('response-group-yes')).toHaveAttribute('data-count', '1');
    });
});
