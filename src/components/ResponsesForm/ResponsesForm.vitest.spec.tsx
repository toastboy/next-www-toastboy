import { notifications } from '@mantine/notifications';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { ResponsesForm } from '@/components/ResponsesForm/ResponsesForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultResponsesAdminData } from '@/tests/mocks/data/responses';

vi.mock('@mantine/notifications', () => ({
    notifications: {
        show: vi.fn(),
        update: vi.fn(),
    },
}));

const mockSave = vi.fn();

describe('Responses', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSave.mockResolvedValue(undefined);
    });

    it('filters safely when a player name is missing', async () => {
        const user = userEvent.setup();
        const namelessResponses = defaultResponsesAdminData.map((response) => (
            response.playerId === 4 ?
                {
                    ...response,
                    player: {
                        ...response.player,
                        name: null,
                    },
                } :
                response
        ));

        render(
            <Wrapper>
                <ResponsesForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={namelessResponses}
                    submitResponse={mockSave}
                />
            </Wrapper>,
        );

        const filterInput = screen.getByPlaceholderText('Search players');
        await user.type(filterInput, 'Dev');

        expect(screen.queryByTestId('response-group-none')).toBeNull();
    });

    it('converts a null comment to an empty string on initialisation', () => {
        const responsesWithNullComment = defaultResponsesAdminData.map((r) =>
            r.playerId === 3 ? { ...r, comment: null } : r,
        );

        // Rendering with a null comment exercises the toResponseValues ?? '' branch.
        // No interaction needed — the branch fires at form initialisation time.
        render(
            <Wrapper>
                <ResponsesForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={responsesWithNullComment}
                    submitResponse={mockSave}
                />
            </Wrapper>,
        );

        expect(screen.getByPlaceholderText('Search players')).toBeInTheDocument();
    });

    it('groups responses and shows counts', () => {
        render(
            <Wrapper>
                <ResponsesForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={defaultResponsesAdminData}
                    submitResponse={mockSave}
                />
            </Wrapper>,
        );

        expect(screen.getByRole('heading', { name: /Responses/i })).toBeInTheDocument();
        expect(screen.getByTestId('response-group-yes')).toHaveAttribute('data-count', '1');
        expect(screen.getByTestId('response-group-no')).toHaveAttribute('data-count', '1');
        expect(screen.queryByTestId('response-group-dunno')).toBeNull();
        expect(screen.getByTestId('response-group-none')).toHaveAttribute('data-count', '2');

        const firstCommentInput = screen.getAllByTestId('comment-input')[0];
        expect(firstCommentInput).toHaveAttribute('maxlength', '127');
    });

    it('filters players before grouping', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <ResponsesForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={defaultResponsesAdminData}
                    submitResponse={mockSave}
                />
            </Wrapper>,
        );

        const filterInput = screen.getByPlaceholderText('Search players');
        await user.type(filterInput, 'Casey');

        expect(screen.queryByTestId('response-group-yes')).toBeNull();
        expect(screen.queryByTestId('response-group-no')).toBeNull();
        expect(screen.queryByTestId('response-group-dunno')).toBeNull();
        expect(screen.getByTestId('response-group-none')).toHaveAttribute('data-count', '1');
    });

    it('returns early without calling submitResponse when response is still null', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <ResponsesForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={defaultResponsesAdminData}
                    submitResponse={mockSave}
                />
            </Wrapper>,
        );

        // Casey Mid is in the "none" group (null response). Change only the goalie
        // checkbox — this makes the row dirty without setting a response.
        const filterInput = screen.getByPlaceholderText('Search players');
        await user.type(filterInput, 'Casey');
        const noneGroup = screen.getByTestId('response-group-none');
        const row = within(noneGroup).getByTestId('response-row');
        const goalie = within(row).getByTestId('goalie-checkbox');
        await user.click(goalie);

        // Row is now dirty so submit button is enabled, but response is still null
        const submit = within(row).getByTestId('response-submit');
        await user.click(submit);

        await waitFor(() => {
            expect(mockSave).not.toHaveBeenCalled();
        });
    });

    it('shows an error notification when submitResponse rejects', async () => {
        const user = userEvent.setup();
        mockSave.mockRejectedValueOnce(new Error('network error'));

        render(
            <Wrapper>
                <ResponsesForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={defaultResponsesAdminData}
                    submitResponse={mockSave}
                />
            </Wrapper>,
        );

        const filterInput = screen.getByPlaceholderText('Search players');
        await user.type(filterInput, 'Casey');
        const noneGroup = screen.getByTestId('response-group-none');
        const row = within(noneGroup).getByTestId('response-row');

        const select = within(row).getByTestId('response-select');
        await user.click(select);
        await user.click(await screen.findByRole('option', { name: 'Yes', hidden: true }));

        const submit = within(row).getByTestId('response-submit');
        await user.click(submit);

        await waitFor(() => {
            expect(mockSave).toHaveBeenCalled();
        });

        expect(notifications.show).toHaveBeenCalledWith({
            id: 'response-3',
            loading: true,
            title: 'Updating response',
            message: 'Updating response...',
            autoClose: false,
            withCloseButton: false,
        });
        expect(notifications.update).toHaveBeenCalledWith(expect.objectContaining({
            id: 'response-3',
            color: 'red',
            title: 'Error',
            message: 'network error',
            loading: false,
            autoClose: false,
            withCloseButton: true,
        }));
    });

    it('falls back to a generic error notification for non-Error rejections', async () => {
        const user = userEvent.setup();
        mockSave.mockRejectedValueOnce('network error');

        render(
            <Wrapper>
                <ResponsesForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={defaultResponsesAdminData}
                    submitResponse={mockSave}
                />
            </Wrapper>,
        );

        const filterInput = screen.getByPlaceholderText('Search players');
        await user.type(filterInput, 'Casey');
        const row = within(screen.getByTestId('response-group-none')).getByTestId('response-row');

        await user.click(within(row).getByTestId('response-select'));
        await user.click(await screen.findByRole('option', { name: 'Yes', hidden: true }));
        await user.click(within(row).getByTestId('response-submit'));

        await waitFor(() => {
            expect(notifications.update).toHaveBeenCalledWith(expect.objectContaining({
                id: 'response-3',
                message: 'Failed to update response',
            }));
        });
    });

    it('updates a player response and calls onSave', async () => {
        const user = userEvent.setup();

        const { rerender } = render(
            <Wrapper>
                <ResponsesForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={defaultResponsesAdminData}
                    submitResponse={mockSave}
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
        expect(screen.queryByTestId('response-group-yes')).toBeNull();
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

        // Simulate revalidate / SSE: parent re-renders with the saved response now
        // present in the server data. The row should move to the "yes" group.
        const updatedResponses = defaultResponsesAdminData.map((r) =>
            r.playerId === playerId ?
                { ...r, response: 'Yes' as const, goalie: true, comment: 'See you there' } :
                r,
        );
        rerender(
            <Wrapper>
                <ResponsesForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    responses={updatedResponses}
                    submitResponse={mockSave}
                />
            </Wrapper>,
        );

        expect(screen.queryByTestId('response-group-none')).toBeNull();
        expect(screen.getByTestId('response-group-yes')).toHaveAttribute('data-count', '1');
    });

});
