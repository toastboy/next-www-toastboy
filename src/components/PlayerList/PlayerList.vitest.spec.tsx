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

        const getFirstRow = () => screen.getAllByTestId('players-table-row')[0];
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

        const sendEmailButton = screen.getByTestId('players-send-email');
        expect(sendEmailButton).toBeDisabled();

        await user.click(screen.getByTestId('players-select-all'));

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

        await user.click(screen.getByTestId('players-select-all'));
        expect(screen.getByText('Selected: 2')).toBeInTheDocument();

        await user.click(screen.getByTestId('players-select-all'));
        expect(screen.getByText('Selected: 0')).toBeInTheDocument();
    });

    it('selects and deselects individual player rows via checkboxes', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <PlayerList players={players} gameDay={gameDay} sendEmail={sendEmailMock} />
            </Wrapper>,
        );

        const rows = screen.getAllByTestId('players-table-row');
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
        const rowsFirst = screen.getAllByTestId('players-table-row');
        expect(within(rowsFirst[0]).getByRole('link', { name: 'Charlie Active' })).toBeInTheDocument();

        // Second click: same column (sortBy === 'name') → toggles direction — Alice sorts first
        await user.click(nameHeader);
        const rowsSecond = screen.getAllByTestId('players-table-row');
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
});
