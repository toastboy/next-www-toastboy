jest.mock('swr');

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminUpdatePlayerRecords from 'components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';
import { act } from 'react';
import useSWR from 'swr';

import { loaderClass,Wrapper } from "./lib/common";

jest.mock('next/cache');
jest.mock('services/PlayerRecord');

describe('AdminUpdatePlayerRecords', () => {
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
            mutate: jest.fn(),
        });

        const { container } = render(<Wrapper><AdminUpdatePlayerRecords /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("40%")).toBeInTheDocument();
    });

    it('renders with data == 100%', async () => {
        const mutateMock = jest.fn();
        (useSWR as jest.Mock).mockReturnValue({
            data: [2000, 2000],
            error: undefined,
            isLoading: false,
            mutate: mutateMock,
        });

        const { container } = render(<Wrapper><AdminUpdatePlayerRecords /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(container.querySelector('.tabler-icon-check')).toBeInTheDocument();

        const button = screen.getByText("Update Player Records");
        fireEvent.click(button);

        await act(async () => { jest.runOnlyPendingTimers(); });
        await waitFor(() => expect(mutateMock).toHaveBeenCalled());
    });
});
