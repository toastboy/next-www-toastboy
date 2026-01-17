jest.mock('@/actions/createMoreGameDays', () => ({
    createMoreGameDays: jest.fn(),
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createMoreGameDays } from '@/actions/createMoreGameDays';
import { MoreGamesForm } from '@/components/MoreGamesForm/MoreGamesForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultMoreGamesFormData } from '@/tests/mocks';
import type { CreateMoreGameDaysInput } from '@/types/CreateMoreGameDaysInput';

const mockCreateMoreGameDays = createMoreGameDays as jest.MockedFunction<typeof createMoreGameDays>;

describe('MoreGamesForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCreateMoreGameDays.mockResolvedValue([] as Awaited<ReturnType<typeof createMoreGameDays>>);
    });

    it('renders a row for each game day', () => {
        render(
            <Wrapper>
                <MoreGamesForm rows={defaultMoreGamesFormData.rows} />
            </Wrapper>,
        );

        expect(screen.getAllByRole('checkbox')).toHaveLength(defaultMoreGamesFormData.rows.length);
        expect(screen.getByText(defaultMoreGamesFormData.rows[0].date)).toBeInTheDocument();
    });

    it('submits updated rows', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <MoreGamesForm rows={defaultMoreGamesFormData.rows} />
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
        });
    });
});
