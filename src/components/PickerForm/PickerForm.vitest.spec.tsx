import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { PickerForm } from '@/components/PickerForm/PickerForm';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockGameDay, defaultGameDay } from '@/tests/mocks/data/gameDay';
import { defaultPickerAdminData } from '@/tests/mocks/data/picker';
import type { PickerPlayerType } from '@/types/PickerPlayerType';

const { notificationsShowMock, notificationsUpdateMock } = vi.hoisted(() => ({
    notificationsShowMock: vi.fn(),
    notificationsUpdateMock: vi.fn(),
}));

vi.mock('@mantine/notifications', () => ({
    notifications: {
        show: notificationsShowMock,
        update: notificationsUpdateMock,
    },
}));

const mockSave = vi.fn();
const mockSetGameEnabled = vi.fn();

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
        mockSetGameEnabled.mockResolvedValue({
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
                    gameDay={defaultGameDay}
                    players={defaultPickerAdminData}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
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
                    gameDay={defaultGameDay}
                    players={players}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
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
                    gameDay={defaultGameDay}
                    players={defaultPickerAdminData}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        const devCheckbox = screen.getByLabelText('Select Dev Striker');
        await user.click(devCheckbox);

        await user.click(screen.getByRole('button', { name: /pick sides/i }));

        await waitFor(() => {
            expect(mockSave).toHaveBeenCalledWith([
                { playerId: 1 },
                { playerId: 2 },
                { playerId: 3 },
            ]);
        });
    });

    it('cancels the game with a reason', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <PickerForm
                    gameDay={defaultGameDay}
                    players={defaultPickerAdminData}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        await user.type(screen.getByTestId('cancellation-reason'), 'Not enough players');
        await user.click(screen.getByTestId('set-enabled-button'));

        await waitFor(() => {
            expect(mockSetGameEnabled).toHaveBeenCalledWith(
                {
                    gameDayId: 1,
                    game: false,
                    reason: 'Not enough players',
                },
            );
        });
    });

    it('hides the picker table and shows "Reinstate game" when game=false', () => {
        const cancelledGameDay = createMockGameDay({ game: false });

        render(
            <Wrapper>
                <PickerForm
                    gameDay={cancelledGameDay}
                    players={defaultPickerAdminData}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        expect(screen.queryByTestId('picker-row')).toBeNull();
        expect(screen.getByRole('button', { name: /reinstate game/i })).toBeInTheDocument();
        expect(screen.getByTestId('reinstatement-reason')).toBeInTheDocument();
        expect(screen.queryByTestId('cancellation-reason')).toBeNull();
    });

    it('formats responseInterval values correctly in the response-time column', () => {
        const players = [
            createPickerPlayer(1, 'Player Null', null, 1),
            createPickerPlayer(2, 'Player 30s', 30, 2),
            createPickerPlayer(3, 'Player 1m', 90, 3),
            createPickerPlayer(4, 'Player 1h', 3600, 4),
            createPickerPlayer(5, 'Player 1h1m', 3660, 5),
            createPickerPlayer(6, 'Player 1d', 86400, 6),
            createPickerPlayer(7, 'Player 1d1h', 90000, 7),
        ];

        render(
            <Wrapper>
                <PickerForm
                    gameDay={defaultGameDay}
                    players={players}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        const rows = screen.getAllByTestId('picker-row');

        const getResponseCell = (row: HTMLElement) => row.querySelectorAll('td')[2].textContent;

        const rowByPlayerId = (id: number) =>
            rows.find((r) => r.getAttribute('data-player-id') === String(id))!;

        expect(getResponseCell(rowByPlayerId(1))).toBe('-');
        expect(getResponseCell(rowByPlayerId(2))).toBe('30s');
        expect(getResponseCell(rowByPlayerId(3))).toBe('1m');
        expect(getResponseCell(rowByPlayerId(4))).toBe('1h');
        expect(getResponseCell(rowByPlayerId(5))).toBe('1h 1m');
        expect(getResponseCell(rowByPlayerId(6))).toBe('1d');
        expect(getResponseCell(rowByPlayerId(7))).toBe('1d 1h');
    });

    it('shows an error notification when submitPicker rejects', async () => {
        const user = userEvent.setup();
        mockSave.mockRejectedValueOnce(new Error('Network error'));

        render(
            <Wrapper>
                <PickerForm
                    gameDay={defaultGameDay}
                    players={defaultPickerAdminData}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /pick sides/i }));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(
                expect.objectContaining({ color: 'red', message: 'Network error' }),
            );
        });
    });

    it('shows an error notification when setGameEnabled rejects', async () => {
        const user = userEvent.setup();
        mockSetGameEnabled.mockRejectedValueOnce(new Error('Status error'));

        render(
            <Wrapper>
                <PickerForm
                    gameDay={defaultGameDay}
                    players={defaultPickerAdminData}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        await user.click(screen.getByTestId('set-enabled-button'));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(
                expect.objectContaining({ color: 'red', message: 'Status error' }),
            );
        });
    });

    it('reorders rows when sorted by Player name', async () => {
        const user = userEvent.setup();
        const players = [
            createPickerPlayer(1, 'Charlie', 100, 5),
            createPickerPlayer(2, 'Alice', 200, 3),
            createPickerPlayer(3, 'Bob', 300, 8),
        ];

        render(
            <Wrapper>
                <PickerForm
                    gameDay={defaultGameDay}
                    players={players}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /sort by player/i }));

        const rows = screen.getAllByTestId('picker-row');
        expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();
    });

    it('reorders rows when sorted by Total games played', async () => {
        const user = userEvent.setup();
        const players = [
            createPickerPlayer(1, 'Charlie', 100, 50),
            createPickerPlayer(2, 'Alice', 200, 3),
            createPickerPlayer(3, 'Bob', 300, 8),
        ];

        render(
            <Wrapper>
                <PickerForm
                    gameDay={defaultGameDay}
                    players={players}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /sort by total games played/i }));

        const rows = screen.getAllByTestId('picker-row');
        expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();
    });

    it('shows fallback name "Player {id}" when player.name is null', () => {
        const playerWithNullName: PickerPlayerType = {
            ...createPickerPlayer(99, 'Temp', 60, 5),
            player: {
                ...createPickerPlayer(99, 'Temp', 60, 5).player,
                name: null,
            },
        };

        render(
            <Wrapper>
                <PickerForm
                    gameDay={defaultGameDay}
                    players={[playerWithNullName]}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        expect(screen.getByText('Player 99')).toBeInTheDocument();
        expect(screen.getByLabelText('Select Player 99')).toBeInTheDocument();
    });

    it('deselects all players when select-all is unchecked', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <PickerForm
                    gameDay={defaultGameDay}
                    players={defaultPickerAdminData}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        const selectAll = screen.getByLabelText('Select all players');
        await user.click(selectAll);

        await waitFor(() => {
            expect(screen.getByLabelText('Select Alex Keeper')).not.toBeChecked();
            expect(screen.getByLabelText('Select Britt Winger')).not.toBeChecked();
            expect(screen.getByLabelText('Select Casey Mid')).not.toBeChecked();
            expect(screen.getByLabelText('Select Dev Striker')).not.toBeChecked();
        });
    });
});
