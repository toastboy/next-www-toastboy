import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { PickerForm } from '@/components/PickerForm/PickerForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPickerAdminData } from '@/tests/mocks/data/picker';
import type { PickerPlayerType } from '@/types/PickerPlayerType';

const mockSave = vi.fn();
const mockCancelGame = vi.fn();

const createPickerPlayer = (
    id: number,
    name: string,
    responseInterval: number | null,
    gamesPlayed: number,
): PickerPlayerType => ({
    id,
    gameDayId: 1249,
    playerId: id,
    response: 'Yes',
    responseInterval,
    points: null,
    team: null,
    comment: null,
    pub: 1,
    paid: false,
    goalie: false,
    gamesPlayed,
    player: {
        id,
        name,
        accountEmail: null,
        anonymous: false,
        joined: null,
        finished: null,
        born: null,
        comment: null,
        introducedBy: null,
    },
});

describe('PickerForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSave.mockResolvedValue(undefined);
        mockCancelGame.mockResolvedValue({
            id: 1249,
            year: 2026,
            date: new Date('2026-02-03T00:00:00Z'),
            game: false,
            mailSent: new Date('2026-02-01T09:00:00Z'),
            comment: 'Not enough players',
            bibs: null,
            pickerGamesHistory: 10,
        });
    });

    it('selects all players by default when under the limit', () => {
        render(
            <Wrapper>
                <PickerForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    players={defaultPickerAdminData}
                    submitPicker={mockSave}
                    cancelGame={mockCancelGame}
                />
            </Wrapper>,
        );

        expect(screen.getByLabelText('Select Alex Keeper')).toBeChecked();
        expect(screen.getByLabelText('Select Britt Winger')).toBeChecked();
        expect(screen.getByLabelText('Select Casey Mid')).toBeChecked();
        expect(screen.getByLabelText('Select Dev Striker')).toBeChecked();
    });

    it('defaults to selecting the earliest 12 responses', () => {
        const players = Array.from({ length: 14 }, (_, index) => {
            const id = index + 1;
            return createPickerPlayer(
                id,
                `Player ${id}`,
                id * 10,
                id,
            );
        });

        render(
            <Wrapper>
                <PickerForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    players={players}
                    submitPicker={mockSave}
                    cancelGame={mockCancelGame}
                />
            </Wrapper>,
        );

        expect(screen.getByLabelText('Select Player 1')).toBeChecked();
        expect(screen.getByLabelText('Select Player 12')).toBeChecked();
        expect(screen.getByLabelText('Select Player 13')).not.toBeChecked();
        expect(screen.getByLabelText('Select Player 14')).not.toBeChecked();
    });

    it('submits the selected players', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <PickerForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    players={defaultPickerAdminData}
                    submitPicker={mockSave}
                    cancelGame={mockCancelGame}
                />
            </Wrapper>,
        );

        const devCheckbox = screen.getByLabelText('Select Dev Striker');
        await user.click(devCheckbox);

        await user.click(screen.getByRole('button', { name: /pick sides/i }));

        await waitFor(() => {
            expect(mockSave).toHaveBeenCalledWith([
                { playerId: 1, name: 'Alex Keeper' },
                { playerId: 2, name: 'Britt Winger' },
                { playerId: 3, name: 'Casey Mid' },
            ]);
        });
    });

    it('cancels the game with a reason', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <PickerForm
                    gameId={1249}
                    gameDate="3rd February 2026"
                    players={defaultPickerAdminData}
                    submitPicker={mockSave}
                    cancelGame={mockCancelGame}
                />
            </Wrapper>,
        );

        await user.type(screen.getByTestId('cancellation-reason'), 'Not enough players');
        await user.click(screen.getByTestId('cancel-game-button'));

        await waitFor(() => {
            expect(mockCancelGame).toHaveBeenCalledWith(
                {
                    gameDayId: 1249,
                    reason: 'Not enough players',
                },
            );
        });
    });
});
