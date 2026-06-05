
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

import { AdminUpdatePlayerRecords } from '@/components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';
import { Wrapper } from '@/tests/components/lib/common';
import { GetProgressProxy } from '@/types/actions/GetProgress';
import { UpdatePlayerRecordsProxy } from '@/types/actions/UpdatePlayerRecords';

const { captureUnexpectedErrorMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

describe('AdminUpdatePlayerRecords', () => {
    const mockUpdatePlayerRecords: UpdatePlayerRecordsProxy = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('shows skeleton before first poll resolves', () => {
        const getProgress: GetProgressProxy = vi.fn((): Promise<[number, number] | null> => new Promise(() => { /* never resolves */ }));

        render(<Wrapper><AdminUpdatePlayerRecords onUpdatePlayerRecords={mockUpdatePlayerRecords} getProgress={getProgress} /></Wrapper>);

        expect(screen.getByRole('status', { name: 'Loading player records progress' })).toBeInTheDocument();
        expect(screen.queryByText(/%/)).not.toBeInTheDocument();
        expect(screen.queryByText('Update Player Records')).not.toBeInTheDocument();
    });

    it('renders with data < 100%', async () => {
        const getProgress: GetProgressProxy = vi.fn().mockResolvedValue([800, 2000]);

        render(<Wrapper><AdminUpdatePlayerRecords onUpdatePlayerRecords={mockUpdatePlayerRecords} getProgress={getProgress} /></Wrapper>);

        await act(async () => { await Promise.resolve(); });

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.getByText('40%')).toBeInTheDocument();
    });

    it('captures unexpected error when getProgress rejects', async () => {
        const error = new Error('Poll failed');
        const getProgress: GetProgressProxy = vi.fn().mockRejectedValue(error);

        render(<Wrapper><AdminUpdatePlayerRecords onUpdatePlayerRecords={mockUpdatePlayerRecords} getProgress={getProgress} /></Wrapper>);

        await act(async () => { await Promise.resolve(); });

        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            error,
            expect.objectContaining({
                layer: 'client',
                component: 'AdminUpdatePlayerRecords',
                action: 'getProgress',
            }),
        );
    });

    it('shows error notification when onUpdatePlayerRecords rejects', async () => {
        const getProgress: GetProgressProxy = vi.fn().mockResolvedValue([2000, 2000]);
        const failingUpdate: UpdatePlayerRecordsProxy = vi.fn().mockRejectedValue(new Error('Update failed'));

        render(<Wrapper><AdminUpdatePlayerRecords onUpdatePlayerRecords={failingUpdate} getProgress={getProgress} /></Wrapper>);

        await act(async () => { await Promise.resolve(); });

        fireEvent.click(screen.getByText('Update Player Records'));

        await act(async () => { await Promise.resolve(); });

        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                layer: 'client',
                component: 'AdminUpdatePlayerRecords',
                action: 'updatePlayerRecords',
            }),
        );
    });

    it('renders nothing when getProgress resolves to null', async () => {
        const getProgress: GetProgressProxy = vi.fn().mockResolvedValue(null);

        render(<Wrapper><AdminUpdatePlayerRecords onUpdatePlayerRecords={mockUpdatePlayerRecords} getProgress={getProgress} /></Wrapper>);

        await act(async () => { await Promise.resolve(); });

        expect(screen.queryByText('Update Player Records')).not.toBeInTheDocument();
        expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });

    it('renders with data == 100% and polls on interval', async () => {
        const getProgress: GetProgressProxy = vi.fn().mockResolvedValue([2000, 2000]);

        render(<Wrapper><AdminUpdatePlayerRecords onUpdatePlayerRecords={mockUpdatePlayerRecords} getProgress={getProgress} /></Wrapper>);

        await act(async () => { await Promise.resolve(); });

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Progress complete' })).toBeInTheDocument();

        fireEvent.click(screen.getByText('Update Player Records'));

        await act(async () => { vi.advanceTimersByTime(1000); await Promise.resolve(); });
        expect(getProgress).toHaveBeenCalledTimes(2); // initial call + one interval tick
    });
});
