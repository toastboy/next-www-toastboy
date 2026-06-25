import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

import { InvoiceForm } from '@/components/InvoiceForm/InvoiceForm';
import { Wrapper } from '@/tests/components/lib/common';

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

const mockPush = vi.fn();

const defaultGameDays = [
    { id: 1, date: '2026-01-06', gameScheduled: true, hallCost: 4700 },
    { id: 2, date: '2026-01-13', gameScheduled: false, hallCost: 4700 },
    { id: 3, date: '2026-01-20', gameScheduled: true, hallCost: 4700 },
];

const renderForm = ({
    gameDays = defaultGameDays,
    year = 2026,
    month = 1,
    onUpdateGameDays = vi.fn().mockResolvedValue(undefined),
    onRecordHallHire = vi.fn().mockResolvedValue(undefined),
} = {}) => {
    render(
        <Wrapper>
            <InvoiceForm
                year={year}
                month={month}
                gameDays={gameDays}
                onUpdateGameDays={onUpdateGameDays}
                onRecordHallHire={onRecordHallHire}
            />
        </Wrapper>,
    );
};

describe('InvoiceForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useRouter).mockReturnValue({
            push: mockPush,
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
        });
    });

    it('renders the heading and current month', () => {
        renderForm();

        expect(screen.getByRole('heading', { name: 'Invoice Check' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'January 2026' })).toBeInTheDocument();
    });

    it('renders a row for each game day', () => {
        renderForm();

        expect(screen.getByText('2026-01-06')).toBeInTheDocument();
        expect(screen.getByText('2026-01-13')).toBeInTheDocument();
        expect(screen.getByText('2026-01-20')).toBeInTheDocument();
    });

    it('shows checkboxes reflecting the initial gameScheduled values', () => {
        renderForm();

        expect(screen.getByLabelText('Game scheduled for 2026-01-06')).toBeChecked();
        expect(screen.getByLabelText('Game scheduled for 2026-01-13')).not.toBeChecked();
        expect(screen.getByLabelText('Game scheduled for 2026-01-20')).toBeChecked();
    });

    it('shows the correct total for scheduled game days', () => {
        // 2 scheduled × £47.00 = £94.00
        renderForm();

        expect(screen.getByText('Total: £94.00')).toBeInTheDocument();
    });

    it("shows 'No game days found' when the list is empty", () => {
        renderForm({ gameDays: [] });

        expect(screen.getByText('No game days found for this month.')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Record invoice/i })).not.toBeInTheDocument();
    });

    it('navigates to the previous month when the prev button is clicked', async () => {
        const user = userEvent.setup();
        renderForm();

        await user.click(screen.getByRole('button', { name: /December/i }));

        expect(mockPush).toHaveBeenCalledWith('/footy/admin/invoice?year=2025&month=12');
    });

    it('navigates to the next month when the next button is clicked', async () => {
        const user = userEvent.setup();
        renderForm();

        await user.click(screen.getByRole('button', { name: /February/i }));

        expect(mockPush).toHaveBeenCalledWith('/footy/admin/invoice?year=2026&month=2');
    });

    it('wraps from December to January of the next year', async () => {
        const user = userEvent.setup();
        renderForm({ year: 2026, month: 12 });

        await user.click(screen.getByRole('button', { name: /January/i }));

        expect(mockPush).toHaveBeenCalledWith('/footy/admin/invoice?year=2027&month=1');
    });

    it('submits the form and calls both action proxies', async () => {
        const user = userEvent.setup();
        const onUpdateGameDays = vi.fn().mockResolvedValue(undefined);
        const onRecordHallHire = vi.fn().mockResolvedValue(undefined);
        renderForm({ onUpdateGameDays, onRecordHallHire });

        await user.click(screen.getByRole('button', { name: /Record invoice/i }));

        await waitFor(() => {
            expect(onUpdateGameDays).toHaveBeenCalledWith({
                gameDays: [
                    { id: 1, gameScheduled: true },
                    { id: 2, gameScheduled: false },
                    { id: 3, gameScheduled: true },
                ],
            });
        });

        await waitFor(() => {
            expect(onRecordHallHire).toHaveBeenCalledTimes(2);
            expect(onRecordHallHire).toHaveBeenCalledWith({
                amountPence: 4700,
                gameDayId: 1,
                note: 'Kelsey Kerridge invoice January 2026',
            });
            expect(onRecordHallHire).toHaveBeenCalledWith({
                amountPence: 4700,
                gameDayId: 3,
                note: 'Kelsey Kerridge invoice January 2026',
            });
        });
    });

    it('does not call onRecordHallHire for unscheduled game days', async () => {
        const user = userEvent.setup();
        const onUpdateGameDays = vi.fn().mockResolvedValue(undefined);
        const onRecordHallHire = vi.fn().mockResolvedValue(undefined);
        renderForm({
            gameDays: [{ id: 1, date: '2026-01-06', gameScheduled: false, hallCost: 4700 }],
            onUpdateGameDays,
            onRecordHallHire,
        });

        await user.click(screen.getByRole('button', { name: /Record invoice/i }));

        await waitFor(() => {
            expect(onUpdateGameDays).toHaveBeenCalled();
        });

        expect(onRecordHallHire).not.toHaveBeenCalled();
    });

    it('shows a success notification after submitting', async () => {
        const user = userEvent.setup();
        renderForm();

        await user.click(screen.getByRole('button', { name: /Record invoice/i }));

        await waitFor(() => {
            expect(notificationsShowMock).toHaveBeenCalledWith(
                expect.objectContaining({ id: 'invoice-form', loading: true }),
            );
            expect(notificationsUpdateMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'invoice-form',
                    color: 'teal',
                    title: 'Invoice recorded',
                    message: 'Hall hire of £94.00 recorded.',
                }),
            );
        });
    });

    it('shows a generic error message when submission fails with a non-Error value', async () => {
        const user = userEvent.setup();
        const onUpdateGameDays = vi.fn().mockRejectedValue('unexpected string error');
        renderForm({ onUpdateGameDays });

        await user.click(screen.getByRole('button', { name: /Record invoice/i }));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'invoice-form',
                    color: 'red',
                    title: 'Error',
                    message: 'Failed to save invoice.',
                }),
            );
        });
    });

    it('shows an error notification when submission fails', async () => {
        const user = userEvent.setup();
        const onUpdateGameDays = vi.fn().mockRejectedValue(new Error('Network error'));
        renderForm({ onUpdateGameDays });

        await user.click(screen.getByRole('button', { name: /Record invoice/i }));

        await waitFor(() => {
            expect(notificationsUpdateMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'invoice-form',
                    color: 'red',
                    title: 'Error',
                    message: 'Network error',
                }),
            );
        });
    });

    it('shows £0.00 total for a scheduled game day with zero hall cost', () => {
        renderForm({
            gameDays: [{ id: 1, date: '2026-01-06', gameScheduled: true, hallCost: 0 }],
        });

        expect(screen.getByText('Total: £0.00')).toBeInTheDocument();
    });

    it('updates the total when a checkbox is toggled off', async () => {
        const user = userEvent.setup();
        renderForm();

        expect(screen.getByText('Total: £94.00')).toBeInTheDocument();

        await user.click(screen.getByLabelText('Game scheduled for 2026-01-06'));

        expect(screen.getByText('Total: £47.00')).toBeInTheDocument();
    });

    it('updates the total when a checkbox is toggled on', async () => {
        const user = userEvent.setup();
        renderForm();

        expect(screen.getByText('Total: £94.00')).toBeInTheDocument();

        await user.click(screen.getByLabelText('Game scheduled for 2026-01-13'));

        expect(screen.getByText('Total: £141.00')).toBeInTheDocument();
    });
});
