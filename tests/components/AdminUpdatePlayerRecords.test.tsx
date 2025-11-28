jest.mock('swr');

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminUpdatePlayerRecords from 'components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';
import { act } from 'react';
import useSWR from 'swr';

import { Wrapper } from "./lib/common";

jest.mock('next/cache');
jest.mock('services/PlayerRecord');

describe('AdminUpdatePlayerRecords', () => {
    const mutateMock = jest.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('renders with data < 100%', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: [800, 2000],
            error: undefined,
            isLoading: false,
            mutate: mutateMock,
        });

        render(<Wrapper><AdminUpdatePlayerRecords /></Wrapper>);
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.getByText("40%")).toBeInTheDocument();
    });

    it('renders with data == 100%', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: [2000, 2000],
            error: undefined,
            isLoading: false,
            mutate: mutateMock,
        });

        render(<Wrapper><AdminUpdatePlayerRecords /></Wrapper>);
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.getByTestId('update-player-records-compete-icon')).toBeInTheDocument();

        const button = screen.getByText("Update Player Records");
        fireEvent.click(button);

        act(() => { jest.runOnlyPendingTimers(); });
        await waitFor(() => expect(mutateMock).toHaveBeenCalled());
    });
});
