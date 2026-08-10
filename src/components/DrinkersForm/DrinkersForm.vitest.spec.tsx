import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

import { DrinkersForm } from '@/components/DrinkersForm/DrinkersForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultDrinkersData } from '@/tests/mocks/data/drinkers';
import type { SetDrinkersProxy } from '@/types/actions/SetDrinkers';
import type { OutcomePlayerType } from '@/types/OutcomePlayerType';

const { refreshMock, notificationsShowMock, notificationsUpdateMock } =
    vi.hoisted(() => ({
        refreshMock: vi.fn(),
        notificationsShowMock: vi.fn(),
        notificationsUpdateMock: vi.fn(),
    }));

vi.mock('@mantine/notifications', () => ({
    notifications: {
        show: notificationsShowMock,
        update: notificationsUpdateMock,
    },
}));

const getRowOrder = () =>
    screen
        .getAllByRole('checkbox', { name: /^Pub / })
        .map((checkbox) => checkbox.getAttribute('aria-label'));

const renderForm = (setDrinkers: SetDrinkersProxy) => {
    render(
        <Wrapper>
            <DrinkersForm
                gameId={1249}
                gameDate="2026-02-03"
                players={defaultDrinkersData}
                setDrinkers={setDrinkers}
            />
        </Wrapper>,
    );
};

describe('DrinkersForm', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.clearAllMocks();
        vi.mocked(useRouter).mockReturnValue({
            push: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            refresh: refreshMock,
            replace: vi.fn(),
            prefetch: vi.fn(),
        });
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('renders drinkers for a game with existing pub selections', () => {
        renderForm(vi.fn<SetDrinkersProxy>());

        expect(
            screen.getByRole('heading', { name: 'Game 1249 Drinkers' }),
        ).toBeInTheDocument();
        expect(
            screen.getByText('4 of 4 visible, 2 selected'),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Pub Alex Keeper')).toBeChecked();
        expect(screen.getByLabelText('Pub Casey Mid')).toBeChecked();
        expect(screen.getByLabelText('Pub Britt Winger')).not.toBeChecked();
    });

    it('submits drinkers and refreshes the page', async () => {
        const user = userEvent.setup();
        const setDrinkers = vi.fn<SetDrinkersProxy>().mockResolvedValue({
            gameDayId: 1249,
            updated: 4,
            drinkers: 3,
        });

        renderForm(setDrinkers);

        await user.click(screen.getByLabelText('Pub Britt Winger'));
        await user.click(screen.getByRole('button', { name: 'Save drinkers' }));

        await waitFor(() => {
            expect(setDrinkers).toHaveBeenCalledWith({
                gameDayId: 1249,
                players: [
                    { playerId: 1, drinker: true },
                    { playerId: 2, drinker: true },
                    { playerId: 3, drinker: true },
                    { playerId: 4, drinker: false },
                ],
            });
        });

        expect(notificationsShowMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'drinkers-save',
                loading: true,
            }),
        );
        expect(notificationsUpdateMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'drinkers-save',
                color: 'teal',
                title: 'Drinkers updated',
            }),
        );
        expect(refreshMock).toHaveBeenCalledTimes(1);
    });

    it('unchecks a currently-selected player', async () => {
        const user = userEvent.setup();
        renderForm(vi.fn<SetDrinkersProxy>());

        // Alex and Casey start checked; uncheck Alex
        await user.click(screen.getByLabelText('Pub Alex Keeper'));

        expect(screen.getByLabelText('Pub Alex Keeper')).not.toBeChecked();
        expect(
            screen.getByText('4 of 4 visible, 1 selected'),
        ).toBeInTheDocument();
    });

    it('filters visible players by name', async () => {
        const user = userEvent.setup();
        renderForm(vi.fn<SetDrinkersProxy>());

        await user.type(screen.getByPlaceholderText('Search players'), 'Alex');

        expect(screen.getByLabelText('Pub Alex Keeper')).toBeInTheDocument();
        expect(
            screen.queryByLabelText('Pub Britt Winger'),
        ).not.toBeInTheDocument();
    });

    it('select-all adds all visible players when clicked from indeterminate state', async () => {
        const user = userEvent.setup();
        renderForm(vi.fn<SetDrinkersProxy>());

        // Initial state: Alex and Casey selected (2/4) → indeterminate; Britt not selected
        expect(screen.getByLabelText('Pub Britt Winger')).not.toBeChecked();

        // Clicking indeterminate select-all checks all
        await user.click(screen.getByLabelText('Select all visible players'));

        expect(screen.getByLabelText('Pub Alex Keeper')).toBeChecked();
        expect(screen.getByLabelText('Pub Britt Winger')).toBeChecked();
        expect(screen.getByLabelText('Pub Casey Mid')).toBeChecked();
    });

    it('deselect-all removes all visible players when clicked from fully-checked state', async () => {
        const user = userEvent.setup();
        renderForm(vi.fn<SetDrinkersProxy>());

        // Select all first
        await user.click(screen.getByLabelText('Select all visible players'));
        expect(screen.getByLabelText('Pub Britt Winger')).toBeChecked();

        // Now all are selected → clicking deselects all
        await user.click(screen.getByLabelText('Select all visible players'));

        expect(screen.getByLabelText('Pub Alex Keeper')).not.toBeChecked();
        expect(screen.getByLabelText('Pub Britt Winger')).not.toBeChecked();
    });

    it('defaults to sorting by team ascending', () => {
        renderForm(vi.fn<SetDrinkersProxy>());

        expect(getRowOrder()).toEqual([
            'Pub Alex Keeper',
            'Pub Britt Winger',
            'Pub Casey Mid',
            'Pub Dev Striker',
        ]);

        expect(
            screen.getByRole('button', { name: 'Sort by Team' }).closest('th'),
        ).toHaveAttribute('aria-sort', 'ascending');
        expect(
            screen
                .getByRole('button', { name: 'Sort by Player' })
                .closest('th'),
        ).toHaveAttribute('aria-sort', 'none');
        expect(
            screen
                .getByRole('button', { name: 'Sort by Response' })
                .closest('th'),
        ).toHaveAttribute('aria-sort', 'none');
    });

    it('toggles sort direction on the already-active Team header when clicked', async () => {
        const user = userEvent.setup();
        renderForm(vi.fn<SetDrinkersProxy>());

        const teamSortButton = screen.getByRole('button', {
            name: 'Sort by Team',
        });

        await user.click(teamSortButton);

        expect(teamSortButton.closest('th')).toHaveAttribute(
            'aria-sort',
            'descending',
        );
        expect(getRowOrder()).toEqual([
            'Pub Britt Winger',
            'Pub Alex Keeper',
            'Pub Casey Mid',
            'Pub Dev Striker',
        ]);

        // Click again to toggle back to ascending
        await user.click(teamSortButton);

        expect(teamSortButton.closest('th')).toHaveAttribute(
            'aria-sort',
            'ascending',
        );
        expect(getRowOrder()).toEqual([
            'Pub Alex Keeper',
            'Pub Britt Winger',
            'Pub Casey Mid',
            'Pub Dev Striker',
        ]);
    });

    it('switches to sorting by name when the Player header is clicked, and toggles direction', async () => {
        const user = userEvent.setup();
        renderForm(vi.fn<SetDrinkersProxy>());

        const playerSortButton = screen.getByRole('button', {
            name: 'Sort by Player',
        });
        await user.click(playerSortButton);

        expect(playerSortButton.closest('th')).toHaveAttribute(
            'aria-sort',
            'ascending',
        );
        expect(
            screen.getByRole('button', { name: 'Sort by Team' }).closest('th'),
        ).toHaveAttribute('aria-sort', 'none');

        await user.click(playerSortButton);

        expect(playerSortButton.closest('th')).toHaveAttribute(
            'aria-sort',
            'descending',
        );
    });

    it('sorts a non-null team ahead of a null team when a null team sorts earlier', async () => {
        const user = userEvent.setup();
        const teamOrderedPlayers: OutcomePlayerType[] = [
            { ...defaultDrinkersData[2], team: null },
            { ...defaultDrinkersData[0], team: 'A' },
        ];

        render(
            <Wrapper>
                <DrinkersForm
                    gameId={1249}
                    gameDate="2026-02-03"
                    players={teamOrderedPlayers}
                    setDrinkers={vi.fn<SetDrinkersProxy>()}
                />
            </Wrapper>,
        );

        // Already sorted by team by default; toggling direction shouldn't move the null team
        await user.click(screen.getByRole('button', { name: 'Sort by Team' }));

        expect(getRowOrder()).toEqual(['Pub Alex Keeper', 'Pub Casey Mid']);
    });

    it('sorts by response when the Response header is clicked, and toggles direction', async () => {
        const user = userEvent.setup();
        renderForm(vi.fn<SetDrinkersProxy>());

        const responseSortButton = screen.getByRole('button', {
            name: 'Sort by Response',
        });
        await user.click(responseSortButton);
        expect(responseSortButton.closest('th')).toHaveAttribute(
            'aria-sort',
            'ascending',
        );

        await user.click(responseSortButton);
        expect(responseSortButton.closest('th')).toHaveAttribute(
            'aria-sort',
            'descending',
        );
    });

    it('resets selection when players prop changes to a new reference', () => {
        const setDrinkers = vi.fn<SetDrinkersProxy>();
        const { rerender } = render(
            <Wrapper>
                <DrinkersForm
                    gameId={1249}
                    gameDate="2026-02-03"
                    players={defaultDrinkersData}
                    setDrinkers={setDrinkers}
                />
            </Wrapper>,
        );

        expect(
            screen.getByText('4 of 4 visible, 2 selected'),
        ).toBeInTheDocument();

        // New reference with only one player having pub > 0
        const updatedPlayers: OutcomePlayerType[] = [
            { ...defaultDrinkersData[0], pub: null },
            ...defaultDrinkersData.slice(1),
        ];
        rerender(
            <Wrapper>
                <DrinkersForm
                    gameId={1249}
                    gameDate="2026-02-03"
                    players={updatedPlayers}
                    setDrinkers={setDrinkers}
                />
            </Wrapper>,
        );

        // Only Casey Mid (pub=2) remains selected
        expect(
            screen.getByText('4 of 4 visible, 1 selected'),
        ).toBeInTheDocument();
    });

    it('shows "No active players found" when players array is empty', () => {
        render(
            <Wrapper>
                <DrinkersForm
                    gameId={1249}
                    gameDate="2026-02-03"
                    players={[]}
                    setDrinkers={vi.fn<SetDrinkersProxy>()}
                />
            </Wrapper>,
        );

        expect(screen.getByText('No active players found')).toBeInTheDocument();
    });

    it('shows generic error message when drinkers save fails with non-Error value', async () => {
        const user = userEvent.setup();
        const setDrinkers = vi
            .fn<SetDrinkersProxy>()
            .mockRejectedValue('plain string error');

        renderForm(setDrinkers);

        await user.click(screen.getByLabelText('Pub Britt Winger'));
        await user.click(screen.getByRole('button', { name: 'Save drinkers' }));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'drinkers-save',
                    color: 'red',
                    message: 'Failed to update drinkers',
                }),
            );
        });
    });

    it('shows a dash when player response is null', () => {
        const noResponsePlayers: OutcomePlayerType[] = [
            { ...defaultDrinkersData[0], response: null },
        ];

        render(
            <Wrapper>
                <DrinkersForm
                    gameId={1249}
                    gameDate="2026-02-03"
                    players={noResponsePlayers}
                    setDrinkers={vi.fn<SetDrinkersProxy>()}
                />
            </Wrapper>,
        );

        // The response cell falls back to '-'
        const cells = screen.getAllByRole('cell');
        expect(cells.some((cell) => cell.textContent === '-')).toBe(true);
    });

    it('uses "Player N" fallback when a player name is null', () => {
        const nullNamePlayers: OutcomePlayerType[] = [
            {
                ...defaultDrinkersData[0],
                playerId: 42,
                player: {
                    ...defaultDrinkersData[0].player,
                    id: 42,
                    name: null,
                },
            },
        ];

        render(
            <Wrapper>
                <DrinkersForm
                    gameId={1249}
                    gameDate="2026-02-03"
                    players={nullNamePlayers}
                    setDrinkers={vi.fn<SetDrinkersProxy>()}
                />
            </Wrapper>,
        );

        expect(screen.getByText('Player 42')).toBeInTheDocument();
    });

    it('renders previous and next navigation links when both game ids are provided', () => {
        render(
            <Wrapper>
                <DrinkersForm
                    gameId={1249}
                    gameDate="2026-02-03"
                    players={defaultDrinkersData}
                    setDrinkers={vi.fn<SetDrinkersProxy>()}
                    previousGameId={1248}
                    nextGameId={1250}
                />
            </Wrapper>,
        );

        expect(screen.getByRole('link', { name: 'Previous' })).toHaveAttribute(
            'href',
            '/footy/admin/drinkers/1248',
        );
        expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute(
            'href',
            '/footy/admin/drinkers/1250',
        );
    });

    it('omits navigation links when no adjacent game ids are provided', () => {
        renderForm(vi.fn<SetDrinkersProxy>());

        expect(
            screen.queryByRole('link', { name: 'Previous' }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: 'Next' }),
        ).not.toBeInTheDocument();
    });

    it('shows an error notification when save fails', async () => {
        const user = userEvent.setup();
        const setDrinkers = vi
            .fn<SetDrinkersProxy>()
            .mockRejectedValue(new Error('Boom'));

        renderForm(setDrinkers);

        await user.click(screen.getByLabelText('Pub Britt Winger'));
        await user.click(screen.getByRole('button', { name: 'Save drinkers' }));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'drinkers-save',
                    color: 'red',
                    message: 'Boom',
                }),
            );
        });

        expect(refreshMock).not.toHaveBeenCalled();
    });
});
