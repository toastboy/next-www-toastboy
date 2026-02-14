import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import { vi } from 'vitest';

import { GameResultForm } from '@/components/GameResultForm/GameResultForm';
import { Wrapper } from '@/tests/components/lib/common';
import type { SetGameResultProxy } from '@/types/actions/SetGameResult';

const { refreshMock, notificationsShowMock, notificationsUpdateMock } = vi.hoisted(() => ({
    refreshMock: vi.fn(),
    notificationsShowMock: vi.fn(),
    notificationsUpdateMock: vi.fn(),
}));

interface MockSelectOption {
    value: string;
    label: string;
}

interface MockSelectProps {
    label: string;
    value: string | null;
    onChange?: (value: string | null) => void;
    data: MockSelectOption[];
}

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: refreshMock,
    }),
}));

vi.mock('@mantine/notifications', () => ({
    notifications: {
        show: notificationsShowMock,
        update: notificationsUpdateMock,
    },
}));

vi.mock('@mantine/core', async () => {
    const actual = await vi.importActual<typeof import('@mantine/core')>('@mantine/core');

    const Select = ({ label, value, onChange, data }: MockSelectProps) => (
        <label>
            {label}
            <select
                aria-label={label}
                value={value ?? 'none'}
                onChange={(event) => onChange?.(event.target.value)}
            >
                {data.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );

    return {
        ...actual,
        Select,
    };
});

const renderForm = (setGameResult: SetGameResultProxy) => {
    render(
        <Wrapper>
            <GameResultForm
                gameDayId={1249}
                bibs={null}
                winners={null}
                setGameResult={setGameResult}
            />
        </Wrapper>,
    );
};

describe('GameResultForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with Save disabled when nothing changed', () => {
        renderForm(vi.fn<SetGameResultProxy>());

        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    it('saves bibs and refreshes the page after success', async () => {
        const user = userEvent.setup();
        const setGameResult = vi.fn<SetGameResultProxy>().mockResolvedValue({} as GameDayType);

        renderForm(setGameResult);

        await user.selectOptions(screen.getByLabelText('Bibs'), 'A');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(setGameResult).toHaveBeenCalledWith({
                gameDayId: 1249,
                bibs: 'A',
                winner: null,
            });
        });

        expect(refreshMock).toHaveBeenCalledTimes(1);
        expect(notificationsShowMock).toHaveBeenCalledWith(expect.objectContaining({
            id: 'game-result-update',
            loading: true,
        }));
        expect(notificationsUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
            id: 'game-result-update',
            color: 'teal',
        }));
    });

    it('shows an error notification when save fails', async () => {
        const user = userEvent.setup();
        const setGameResult = vi.fn<SetGameResultProxy>().mockRejectedValue(new Error('Boom'));

        renderForm(setGameResult);

        await user.selectOptions(screen.getByLabelText('Result'), 'draw');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
                id: 'game-result-update',
                color: 'red',
                message: 'Boom',
            }));
        });

        expect(refreshMock).not.toHaveBeenCalled();
    });
});
