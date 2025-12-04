import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { SWRConfig } from 'swr';

import AdminUpdatePlayerRecords from '@/components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';
import { server } from '@/tests/setup/msw-server';

import { Wrapper } from './lib/common';

jest.mock('next/cache');
jest.mock('actions/updatePlayerRecords', () => ({
    updatePlayerRecords: jest.fn().mockResolvedValue(undefined),
}));

const { updatePlayerRecords } = jest.requireMock('actions/updatePlayerRecords');

describe('AdminUpdatePlayerRecords', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
        server.resetHandlers();
    });

    const renderWithConfig = () => render(
        <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
            <Wrapper>
                <AdminUpdatePlayerRecords />
            </Wrapper>
        </SWRConfig>,
    );

    it('renders with data < 100%', async () => {
        renderWithConfig();

        expect(await screen.findByText("40%")).toBeInTheDocument();
    });

    it('renders with data == 100% and calls update action on click', async () => {
        server.use(http.get('/api/footy/records/progress', () => HttpResponse.json([2000, 2000])));

        renderWithConfig();

        expect(await screen.findByTestId('update-player-records-compete-icon')).toBeInTheDocument();

        const button = screen.getByText("Update Player Records");
        fireEvent.click(button);

        await waitFor(() => {
            expect(updatePlayerRecords).toHaveBeenCalled();
        });
    });
});
