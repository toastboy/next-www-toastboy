
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

import { AdminUpdatePlayerRecords } from '@/components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';
import { Wrapper } from '@/tests/components/lib/common';
import { GetProgressProxy } from '@/types/actions/GetProgress';
import { UpdatePlayerRecordsProxy } from '@/types/actions/UpdatePlayerRecords';

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

        expect(screen.getByTestId('skeleton-records-progress')).toBeInTheDocument();
        expect(screen.queryByTestId('update-player-records-progress')).not.toBeInTheDocument();
        expect(screen.queryByText('Update Player Records')).not.toBeInTheDocument();
    });

    it('renders with data < 100%', async () => {
        const getProgress: GetProgressProxy = vi.fn().mockResolvedValue([800, 2000]);

        render(<Wrapper><AdminUpdatePlayerRecords onUpdatePlayerRecords={mockUpdatePlayerRecords} getProgress={getProgress} /></Wrapper>);

        await act(async () => { await Promise.resolve(); });

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.getByText('40%')).toBeInTheDocument();
    });

    it('renders with data == 100% and polls on interval', async () => {
        const getProgress: GetProgressProxy = vi.fn().mockResolvedValue([2000, 2000]);

        render(<Wrapper><AdminUpdatePlayerRecords onUpdatePlayerRecords={mockUpdatePlayerRecords} getProgress={getProgress} /></Wrapper>);

        await act(async () => { await Promise.resolve(); });

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.getByTestId('update-player-records-compete-icon')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Update Player Records'));

        await act(async () => { vi.advanceTimersByTime(1000); await Promise.resolve(); });
        expect(getProgress).toHaveBeenCalledTimes(2); // initial call + one interval tick
    });
});
