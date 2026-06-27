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

        await user.type(screen.getByRole('textbox', { name: /cancellation reason/i }), 'Not enough players');
        await user.click(screen.getByRole('button', { name: 'Cancel game' }));

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

        expect(screen.queryByLabelText(/^Select /)).toBeNull();
        expect(screen.getByRole('button', { name: /reinstate game/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /reinstatement reason/i })).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: /cancellation reason/i })).toBeNull();
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

        const getResponseCell = (playerName: string) => {
            const nameCell = screen.getByText(playerName);
            const row = nameCell.closest('tr')!;
            return row.querySelectorAll('td')[2]?.textContent;
        };

        expect(getResponseCell('Player Null')).toBe('-');
        expect(getResponseCell('Player 30s')).toBe('30s');
        expect(getResponseCell('Player 1m')).toBe('1m');
        expect(getResponseCell('Player 1h')).toBe('1h');
        expect(getResponseCell('Player 1h1m')).toBe('1h 1m');
        expect(getResponseCell('Player 1d')).toBe('1d');
        expect(getResponseCell('Player 1d1h')).toBe('1d 1h');
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

    it('shows generic error message when submitPicker rejects with non-Error value', async () => {
        const user = userEvent.setup();
        mockSave.mockRejectedValueOnce('plain string');

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
                expect.objectContaining({ color: 'red', message: 'Failed to submit selection' }),
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

        await user.click(screen.getByRole('button', { name: 'Cancel game' }));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(
                expect.objectContaining({ color: 'red', message: 'Status error' }),
            );
        });
    });

    it('shows generic error message when setGameEnabled rejects with non-Error value', async () => {
        const user = userEvent.setup();
        mockSetGameEnabled.mockRejectedValueOnce('plain string');

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

        await user.click(screen.getByRole('button', { name: 'Cancel game' }));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(
                expect.objectContaining({ color: 'red', message: 'Failed to set game status' }),
            );
        });
    });

    it('reverses sort direction when the already-active column header is clicked again', async () => {
        const user = userEvent.setup();
        const players = [
            createPickerPlayer(1, 'Alice', 100, 5),
            createPickerPlayer(2, 'Bob', 50, 3),
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

        // Default sort is 'responseTime' ascending → Bob (50) first, Alice (100) second
        const getFirstRow = () => screen.getAllByRole('row').slice(1)[0];
        expect(within(getFirstRow()).getByText('Bob')).toBeInTheDocument();

        // Click the active 'Response time' header → toggles to descending → Alice (100) first
        await user.click(screen.getByRole('button', { name: /sort by response time/i }));

        expect(within(getFirstRow()).getByText('Alice')).toBeInTheDocument();
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

        expect(within(screen.getAllByRole('row').slice(1)[0]).getByText('Alice')).toBeInTheDocument();
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

        expect(within(screen.getAllByRole('row').slice(1)[0]).getByText('Alice')).toBeInTheDocument();
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

    it('selects all players when select-all is clicked while some are unselected', async () => {
        const user = userEvent.setup();
        const players14 = Array.from({ length: 14 }, (_, index) => {
            const id = index + 1;
            return createPickerPlayer(id, `Player ${id}`, id * 10, id);
        });

        render(
            <Wrapper>
                <PickerForm
                    gameDay={defaultGameDay}
                    players={players14}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        // Players 13 and 14 start unselected (>12 limit)
        expect(screen.getByLabelText('Select Player 13')).not.toBeChecked();
        expect(screen.getByLabelText('Select Player 14')).not.toBeChecked();

        // Click select-all (checked=true) to select all 14
        await user.click(screen.getByLabelText('Select all players'));

        expect(screen.getByLabelText('Select Player 13')).toBeChecked();
        expect(screen.getByLabelText('Select Player 14')).toBeChecked();
    });

    it('selects an individual unchecked player via its checkbox', async () => {
        const user = userEvent.setup();
        const players14 = Array.from({ length: 14 }, (_, index) => {
            const id = index + 1;
            return createPickerPlayer(id, `Player ${id}`, id * 10, id);
        });

        render(
            <Wrapper>
                <PickerForm
                    gameDay={defaultGameDay}
                    players={players14}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        const p13checkbox = screen.getByLabelText('Select Player 13');
        expect(p13checkbox).not.toBeChecked();
        await user.click(p13checkbox);
        expect(p13checkbox).toBeChecked();
    });

    it('toggles sort direction back to ascending after a third click on the same column', async () => {
        const user = userEvent.setup();
        const players = [
            createPickerPlayer(1, 'Alice', 100, 5),
            createPickerPlayer(2, 'Bob', 50, 3),
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

        const responseTimeHeader = screen.getByRole('button', { name: /sort by response time/i });

        // Default asc: Bob (50) first; click toggles to desc: Alice (100) first
        await user.click(responseTimeHeader);
        expect(within(screen.getAllByRole('row').slice(1)[0]).getByText('Alice')).toBeInTheDocument();

        // Click again: desc → asc: Bob (50) first again
        await user.click(responseTimeHeader);
        expect(within(screen.getAllByRole('row').slice(1)[0]).getByText('Bob')).toBeInTheDocument();
    });

    it('shows "Game reinstated" notification when game is reinstated', async () => {
        const user = userEvent.setup();
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

        await user.click(screen.getByRole('button', { name: 'Reinstate game' }));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    color: 'teal',
                    title: 'Game reinstated',
                }),
            );
        });
    });

    it('breaks ties in buildDefaultSelection by name then playerId when responseInterval is equal', () => {
        const players = [
            createPickerPlayer(3, 'Zeta', 100, 5),
            createPickerPlayer(2, 'Alpha', 100, 5),
            createPickerPlayer(1, 'Alpha', 100, 5),
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

        // All 3 under the 12-player limit → all selected by default
        const rows = screen.getAllByRole('row').slice(1);
        expect(rows).toHaveLength(3);
        rows.forEach((row) => {
            expect(within(row).getByRole('checkbox')).toBeChecked();
        });
    });

    it('sets aria-sort to "descending" on name column after two name-sort clicks', async () => {
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

        // First click: sort by name ascending
        await user.click(screen.getByRole('button', { name: /sort by player/i }));
        // Second click: toggle to name descending
        await user.click(screen.getByRole('button', { name: /sort by player/i }));

        const nameHeader = screen.getByRole('columnheader', { name: /Player/ });
        expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('sets aria-sort to "descending" on games-played column after two gamesPlayed-sort clicks', async () => {
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

        // First click: sort by games played ascending
        await user.click(screen.getByRole('button', { name: /sort by total games played/i }));
        // Second click: toggle to games played descending
        await user.click(screen.getByRole('button', { name: /sort by total games played/i }));

        const gamesHeader = screen.getAllByRole('columnheader').find((h) => h.getAttribute('aria-sort') !== null && h.textContent?.includes('Total'));
        expect(gamesHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('renders with no eligible players when all responses are non-Yes (exercises empty buildDefaultSelection)', () => {
        const noYesPlayers = defaultPickerAdminData.map((p) => ({ ...p, response: 'No' as const }));

        render(
            <Wrapper>
                <PickerForm
                    gameDay={defaultGameDay}
                    players={noYesPlayers}
                    submitPicker={mockSave}
                    setGameEnabled={mockSetGameEnabled}
                />
            </Wrapper>,
        );

        // No data rows — header row only
        expect(screen.getAllByRole('row')).toHaveLength(1);
    });

    it('sorts null-name players after named players when sorting by name ascending (exercises one-null paths in compareNullableString)', async () => {
        const user = userEvent.setup();
        const nullNamePlayer = (id: number): PickerPlayerType => ({
            ...createPickerPlayer(id, 'Placeholder', id * 10, 5),
            player: { ...createPickerPlayer(id, 'Placeholder', id * 10, 5).player, name: null },
        });
        const players = [
            createPickerPlayer(3, 'Zeta', 100, 5),
            createPickerPlayer(4, 'Alpha', 200, 5),
            nullNamePlayer(1),
            nullNamePlayer(2),
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

        // Sort by name to trigger compareNullableString with both a-null and b-null paths
        await user.click(screen.getByRole('button', { name: /sort by player/i }));

        const rows = screen.getAllByRole('row').slice(1);
        // Named players (Alpha, Zeta) sort before null-named (Player 1, Player 2)
        expect(within(rows[0]).getByText('Alpha')).toBeInTheDocument();
        expect(within(rows[1]).getByText('Zeta')).toBeInTheDocument();
        expect(within(rows[2]).getByText('Player 1')).toBeInTheDocument();
        expect(within(rows[3]).getByText('Player 2')).toBeInTheDocument();
    });

    it('sorts a named player before a null-named player when null-named appears first in input (exercises b==null path in compareNullableString)', async () => {
        const user = userEvent.setup();
        const nullNamePlayer: PickerPlayerType = {
            ...createPickerPlayer(1, 'Placeholder', 50, 5),
            player: { ...createPickerPlayer(1, 'Placeholder', 50, 5).player, name: null },
        };
        // null-named player appears BEFORE the named player in the input array so that
        // when InsertionSort inserts 'Alpha' it calls compareNullableString('Alpha', null, 'asc'),
        // hitting the `if (b == null) return -1` branch.
        const players = [nullNamePlayer, createPickerPlayer(2, 'Alpha', 100, 5)];

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

        const rows = screen.getAllByRole('row').slice(1);
        expect(within(rows[0]).getByText('Alpha')).toBeInTheDocument();
        expect(within(rows[1]).getByText('Player 1')).toBeInTheDocument();
    });

    it('renders all players when both have null responseInterval (exercises both-null path in compareNullableNumber)', () => {
        // Both null responseIntervals → compareNullableNumber returns 0 for both-null case
        const players = [
            createPickerPlayer(2, 'Zeta Null', null, 5),
            createPickerPlayer(1, 'Alpha Null', null, 5),
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

        expect(screen.getByText('Alpha Null')).toBeInTheDocument();
        expect(screen.getByText('Zeta Null')).toBeInTheDocument();
    });

    it('renders players with null names using fallback and sorts by playerId (exercises both-null path in compareNullableString)', () => {
        // Both null names → compareNullableString returns 0 for both-null case; ties broken by playerId
        const nullNamePlayer = (id: number): PickerPlayerType => ({
            ...createPickerPlayer(id, 'Placeholder', null, 5),
            player: { ...createPickerPlayer(id, 'Placeholder', null, 5).player, name: null },
        });

        const players = [nullNamePlayer(5), nullNamePlayer(3)];

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

        expect(screen.getByText('Player 3')).toBeInTheDocument();
        expect(screen.getByText('Player 5')).toBeInTheDocument();
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
