import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PlayerList } from '@/components/PlayerList/PlayerList';
import type { Props as PlayerTimelineProps } from '@/components/PlayerTimeline/PlayerTimeline';
import type { Props as PlayerWDLChartProps } from '@/components/PlayerWDLChart/PlayerWDLChart';
import type { Props as SendEmailFormProps } from '@/components/SendEmailForm/SendEmailForm';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { createMockPlayerData } from '@/tests/mocks/data/playerData';
import type { PlayerDataDisplayType } from '@/types';
import type { SendEmailProxy } from '@/types/actions/SendEmail';

vi.mock('@/components/PlayerTimeline/PlayerTimeline');
vi.mock('@/components/PlayerWDLChart/PlayerWDLChart');
vi.mock('@/components/SendEmailForm/SendEmailForm');

const gameDay = createMockGameDay({ id: 20 });

const players = [
    createMockPlayerData({
        id: 1,
        name: 'Alice Active',
        accountEmail: 'alice@example.com',
        finished: null,
        lastResponded: 20,
    }),
    createMockPlayerData({
        id: 2,
        name: 'Bob Former',
        accountEmail: 'bob@example.com',
        finished: new Date('2020-01-01'),
        lastResponded: 20,
    }),
    createMockPlayerData({
        id: 3,
        name: 'Charlie Active',
        accountEmail: 'charlie@example.com',
        finished: null,
        lastResponded: 19,
    }),
];

const sendEmailMock = vi.fn<SendEmailProxy>();

const renderWithInitialState = async (
    initialState: unknown[],
    localPlayers: PlayerDataDisplayType[],
) => {
    vi.resetModules();
    vi.doMock('react', async () => {
        const actual = await vi.importActual<typeof import('react')>('react');
        let stateIndex = 0;

        return {
            ...actual,
            useState: ((initial: unknown) => {
                const configured = stateIndex in initialState ? initialState[stateIndex] : initial;
                stateIndex += 1;
                return actual.useState(configured);
            }) as typeof actual.useState,
        };
    });

    const importedModule = await import('@/components/PlayerList/PlayerList');
    const TestPlayerList = importedModule.PlayerList;
    render(
        <Wrapper>
            <TestPlayerList players={localPlayers} gameDay={gameDay} sendEmail={sendEmailMock} />
        </Wrapper>,
    );

    vi.doUnmock('react');
};

describe('PlayerList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sendEmailMock.mockResolvedValue(undefined);
    });

    it('renders active players in current reply range and chart/timeline children', () => {
        render(
            <Wrapper>
                <PlayerList players={players} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        expect(screen.getByRole('heading', { level: 1, name: '2 Active Players' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Alice Active' })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Bob Former' })).not.toBeInTheDocument();

        const [wdlProps] = extractMockProps<PlayerWDLChartProps>('PlayerWDLChart');
        expect(wdlProps.player.id).toBe(1);
        const [timelineProps] = extractMockProps<PlayerTimelineProps>('PlayerTimeline');
        expect(timelineProps.player.id).toBe(1);
        expect(timelineProps.currentGameId).toBe(20);
    });

    it('includes former players when active filter is turned off and supports name sorting', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <PlayerList players={players} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('switch', { name: 'Active' }));

        expect(screen.getByRole('heading', { level: 1, name: '3 Active and Former Players' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Bob Former' })).toBeInTheDocument();

        const getFirstRow = () => screen.getAllByRole('row').slice(1)[0];
        expect(within(getFirstRow()).getByRole('link', { name: 'Alice Active' })).toBeInTheDocument();

        await user.click(screen.getByRole('columnheader', { name: /Name/ }));

        expect(within(getFirstRow()).getByRole('link', { name: 'Charlie Active' })).toBeInTheDocument();
    });

    it('selects visible players and opens SendEmailForm', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <PlayerList players={players} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        const sendEmailButton = screen.getByRole('button', { name: /send email/i });
        expect(sendEmailButton).toBeDisabled();

        await user.click(screen.getByRole('checkbox', { name: 'Select All' }));

        expect(screen.getByText('Selected: 2')).toBeInTheDocument();
        expect(sendEmailButton).toBeEnabled();

        await user.click(sendEmailButton);

        const [sendEmailFormProps] = extractMockProps<SendEmailFormProps>('SendEmailForm');
        expect(sendEmailFormProps.opened).toBe(true);
        expect(sendEmailFormProps.players).toHaveLength(2);
        expect(sendEmailFormProps.players[0]?.id).toBe(1);
        expect(sendEmailFormProps.players[1]?.id).toBe(3);
    });

    it('deselects all players when select-all is unchecked', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <PlayerList players={players} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('checkbox', { name: 'Select All' }));
        expect(screen.getByText('Selected: 2')).toBeInTheDocument();

        await user.click(screen.getByRole('checkbox', { name: 'Select All' }));
        expect(screen.getByText('Selected: 0')).toBeInTheDocument();
    });

    it('selects and deselects individual player rows via checkboxes', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <PlayerList players={players} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        const rows = screen.getAllByRole('row').slice(1);
        const firstRowCheckbox = within(rows[0]).getByRole('checkbox');

        await user.click(firstRowCheckbox);
        expect(screen.getByText('Selected: 1')).toBeInTheDocument();

        await user.click(firstRowCheckbox);
        expect(screen.getByText('Selected: 0')).toBeInTheDocument();
    });

    it('toggles sort direction when the same column header is clicked again', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <PlayerList players={players} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        const nameHeader = screen.getByRole('columnheader', { name: /Name/ });

        // First click: sets sortBy to 'name' — Charlie sorts first in this direction
        await user.click(nameHeader);
        const rowsFirst = screen.getAllByRole('row').slice(1);
        expect(within(rowsFirst[0]).getByRole('link', { name: 'Charlie Active' })).toBeInTheDocument();

        // Second click: same column (sortBy === 'name') → toggles direction — Alice sorts first
        await user.click(nameHeader);
        const rowsSecond = screen.getAllByRole('row').slice(1);
        expect(within(rowsSecond[0]).getByRole('link', { name: 'Alice Active' })).toBeInTheDocument();
    });

    it('includes players with null lastResponded within the full reply range', () => {
        const playersWithNullResponse = [
            ...players,
            createMockPlayerData({
                id: 4,
                name: 'Drew NoResponse',
                accountEmail: null,
                finished: null,
                lastResponded: null,
            }),
        ];

        render(
            <Wrapper>
                <PlayerList players={playersWithNullResponse} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        // Drew has null lastResponded; with full reply range they should appear in the list
        expect(screen.getByRole('link', { name: 'Drew NoResponse' })).toBeInTheDocument();
    });

    it('filters by email address', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <PlayerList players={players} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        await user.type(screen.getByPlaceholderText('Search players'), 'charlie@example.com');

        expect(screen.queryByRole('link', { name: 'Alice Active' })).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Charlie Active' })).toBeInTheDocument();
    });

    it('starts unsorted when sortBy is null and then sets name sort on first header click', async () => {
        const user = userEvent.setup();
        const reversedPlayers = [players[2], players[0], players[1]];

        await renderWithInitialState([null], reversedPlayers);

        let rows = screen.getAllByRole('row').slice(1);
        expect(within(rows[0]).getByRole('link', { name: 'Charlie Active' })).toBeInTheDocument();

        await user.click(screen.getByRole('columnheader', { name: /Name/ }));

        rows = screen.getAllByRole('row').slice(1);
        expect(within(rows[0]).getByRole('link', { name: 'Alice Active' })).toBeInTheDocument();
    });

    it('sorts descending for numeric and date sort keys and falls back for unsupported types', async () => {
        const mixedPlayers = [
            createMockPlayerData({ id: 9, name: 'Nine', joined: new Date('2024-03-01T00:00:00.000Z'), comment: null, finished: null, lastResponded: 20 }),
            createMockPlayerData({ id: 2, name: 'Two', joined: new Date('2022-01-01T00:00:00.000Z'), comment: null, finished: null, lastResponded: 20 }),
            createMockPlayerData({ id: 5, name: 'Five', joined: new Date('2023-07-01T00:00:00.000Z'), comment: null, finished: null, lastResponded: 20 }),
        ];

        await renderWithInitialState(['id', 'desc'], mixedPlayers);
        let rows = screen.getAllByRole('row').slice(1);
        expect(within(rows[0]).getByRole('link', { name: 'Nine' })).toBeInTheDocument();

        await renderWithInitialState(['joined', 'desc'], mixedPlayers);
        rows = screen.getAllByRole('row').slice(1);
        expect(within(rows[0]).getByRole('link', { name: 'Nine' })).toBeInTheDocument();

        await renderWithInitialState(['comment', 'desc'], mixedPlayers);
        rows = screen.getAllByRole('row').slice(1);
        expect(within(rows[0]).getByRole('link', { name: 'Nine' })).toBeInTheDocument();
    });

    it('sorts ascending for date sort keys', async () => {
        const mixedPlayers = [
            createMockPlayerData({ id: 2, name: 'Two', joined: new Date('2022-01-01T00:00:00.000Z'), finished: null, lastResponded: 20 }),
            createMockPlayerData({ id: 9, name: 'Nine', joined: new Date('2024-03-01T00:00:00.000Z'), finished: null, lastResponded: 20 }),
            createMockPlayerData({ id: 5, name: 'Five', joined: new Date('2023-07-01T00:00:00.000Z'), finished: null, lastResponded: 20 }),
        ];

        await renderWithInitialState(['joined', 'asc'], mixedPlayers);
        const rows = screen.getAllByRole('row').slice(1);
        expect(within(rows[0]).getByRole('link', { name: 'Two' })).toBeInTheDocument();
    });

    it('handles players without names when matching by email', async () => {
        const user = userEvent.setup();
        const namelessPlayer = createMockPlayerData({
            id: 44,
            name: '',
            accountEmail: 'nameless@example.com',
            finished: null,
            lastResponded: 20,
        });

        render(
            <Wrapper>
                <PlayerList players={[namelessPlayer]} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        await user.type(screen.getByPlaceholderText('Search players'), 'nameless@example.com');

        expect(screen.getByRole('heading', { level: 1, name: '1 Active Players' })).toBeInTheDocument();
    });

    it('renders with no players when the players array is empty', () => {
        render(
            <Wrapper>
                <PlayerList players={[]} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        expect(screen.getByRole('heading', { level: 1, name: '0 Active Players' })).toBeInTheDocument();
    });

    it('narrows the reply range when the min slider thumb is moved right', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <PlayerList players={players} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        // gameDay.id = 20; initial range is [0, 20]
        expect(screen.getByRole('heading', { level: 3, name: /who last responded between/i })).toHaveTextContent('0 and 20 weeks ago');

        const [minThumb] = screen.getAllByRole('slider');
        minThumb.focus();
        await user.keyboard('{ArrowRight}');

        // After one ArrowRight step the min bound becomes 1
        expect(screen.getByRole('heading', { level: 3, name: /who last responded between/i })).toHaveTextContent('1 and 20 weeks ago');
    });

    it('closes the email modal when SendEmailForm fires onClose', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <PlayerList players={players} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('checkbox', { name: 'Select All' }));
        await user.click(screen.getByRole('button', { name: /send email/i }));

        const closeButton = screen.getByRole('button', { name: 'Close SendEmailForm' });
        await user.click(closeButton);

        expect(screen.queryByRole('button', { name: 'Close SendEmailForm' })).not.toBeInTheDocument();
    });

    it('hides null lastResponded entries when reply-range max is below the current game day', async () => {
        const playersWithNullResponse = [
            ...players,
            createMockPlayerData({
                id: 4,
                name: 'Drew NoResponse',
                accountEmail: null,
                finished: null,
                lastResponded: null,
            }),
        ];

        await renderWithInitialState(['name', 'asc', '', true, [0, gameDay.id - 1]], playersWithNullResponse);

        expect(screen.queryByRole('link', { name: 'Drew NoResponse' })).not.toBeInTheDocument();
    });
});
