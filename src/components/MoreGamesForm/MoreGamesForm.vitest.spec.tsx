
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { MoreGamesForm } from '@/components/MoreGamesForm/MoreGamesForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultMoreGamesFormData } from '@/tests/mocks/data/moreGamesForm';
import type {
    CreateMoreGameDaysInput,
    CreateMoreGameDaysProxy,
} from '@/types/actions/CreateMoreGameDays';

const { notificationsShowMock, notificationsUpdateMock, captureUnexpectedErrorMock } = vi.hoisted(() => ({
    notificationsShowMock: vi.fn(),
    notificationsUpdateMock: vi.fn(),
    captureUnexpectedErrorMock: vi.fn(),
}));

vi.mock('@mantine/notifications', () => ({
    notifications: {
        show: notificationsShowMock,
        update: notificationsUpdateMock,
    },
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

const mockCreateMoreGameDays = vi.fn();

describe('MoreGamesForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockCreateMoreGameDays.mockResolvedValue([] as Awaited<ReturnType<CreateMoreGameDaysProxy>>);
        captureUnexpectedErrorMock.mockResolvedValue(undefined);
    });

    it('renders a row for each game day', () => {
        render(
            <Wrapper>
                <MoreGamesForm
                    cost={defaultMoreGamesFormData.cost}
                    hallCost={defaultMoreGamesFormData.hallCost}
                    rows={defaultMoreGamesFormData.rows}
                    onCreateMoreGameDays={mockCreateMoreGameDays}
                />
            </Wrapper>,
        );

        expect(screen.getAllByRole('checkbox')).toHaveLength(defaultMoreGamesFormData.rows.length);
        expect(screen.getByText(defaultMoreGamesFormData.rows[0].date)).toBeInTheDocument();
    });

    it('shows an error notification when creation fails', async () => {
        const user = userEvent.setup();
        mockCreateMoreGameDays.mockRejectedValueOnce(new Error('Server error'));

        render(
            <Wrapper>
                <MoreGamesForm
                    cost={defaultMoreGamesFormData.cost}
                    hallCost={defaultMoreGamesFormData.hallCost}
                    rows={defaultMoreGamesFormData.rows}
                    onCreateMoreGameDays={mockCreateMoreGameDays}
                />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /Create game days/i }));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
                color: 'red',
                title: 'Error',
                message: 'Failed to create game days.',
            }));
        });
        expect(captureUnexpectedErrorMock).toHaveBeenCalled();
    });

    it('submits updated rows', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <MoreGamesForm
                    cost={defaultMoreGamesFormData.cost}
                    hallCost={defaultMoreGamesFormData.hallCost}
                    rows={defaultMoreGamesFormData.rows}
                    onCreateMoreGameDays={mockCreateMoreGameDays}
                />
            </Wrapper>,
        );

        const firstDate = defaultMoreGamesFormData.rows[0].date;
        const firstComment = screen.getByLabelText(`Comment for ${firstDate}`);
        const firstCheckbox = screen.getByLabelText(`Game scheduled for ${firstDate}`);
        const submitButton = screen.getByRole('button', { name: /Create game days/i });

        await user.type(firstComment, 'Updated note');
        await user.click(firstCheckbox);
        await user.click(submitButton);

        await waitFor(() => {
            const payload = mockCreateMoreGameDays.mock.calls[0]?.[0] as CreateMoreGameDaysInput;

            expect(payload.rows).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        date: firstDate,
                        game: false,
                        comment: 'Updated note',
                    }),
                ]),
            );
            expect(payload.cost).toBe(defaultMoreGamesFormData.cost);
        });
    });
});
