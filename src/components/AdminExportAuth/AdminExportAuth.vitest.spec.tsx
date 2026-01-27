import { notifications } from '@mantine/notifications';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { AdminExportAuth } from '@/components/AdminExportAuth/AdminExportAuth';
import { Wrapper } from '@/tests/components/lib/common';

vi.mock('@mantine/notifications', () => ({
    notifications: {
        show: vi.fn(),
        update: vi.fn(),
    },
}));

describe('AdminExportAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockExportAuth = vi.fn();

    it('renders export button', () => {
        render(
            <Wrapper>
                <AdminExportAuth onExportAuth={mockExportAuth} />
            </Wrapper>,
        );

        expect(screen.getByTestId('export-auth-button')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /export auth data/i })).toBeInTheDocument();
    });

    it('shows loading notification on button click', async () => {
        vi.mocked(notifications.show).mockReturnValue('notification-id-1');
        mockExportAuth.mockImplementation(
            () =>
                new Promise(() => {
                    // Never resolves
                }),
        );

        render(
            <Wrapper>
                <AdminExportAuth onExportAuth={mockExportAuth} />
            </Wrapper>,
        );

        const button = screen.getByTestId('export-auth-button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(notifications.show).toHaveBeenCalledWith({
                loading: true,
                title: 'Exporting Auth Data',
                message: 'Please wait...',
                autoClose: false,
                withCloseButton: false,
            });
        });
    });

    it('shows success notification when export succeeds', async () => {
        const notificationId = 'notification-id-success';
        vi.mocked(notifications.show).mockReturnValue(notificationId);
        mockExportAuth.mockResolvedValue(undefined);

        render(
            <Wrapper>
                <AdminExportAuth onExportAuth={mockExportAuth} />
            </Wrapper>,
        );

        const button = screen.getByTestId('export-auth-button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(notifications.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: notificationId,
                    color: 'green',
                    title: 'Success',
                    message: 'Auth data exported successfully',
                    loading: false,
                }),
            );
        });

        expect(mockExportAuth).toHaveBeenCalled();
        expect(mockExportAuth).toHaveBeenCalledTimes(1);
    });

    it('shows error notification when export fails', async () => {
        const notificationId = 'notification-id-error';
        const errorMessage = 'Database connection failed';
        vi.mocked(notifications.show).mockReturnValue(notificationId);
        mockExportAuth.mockRejectedValue(new Error(errorMessage));

        render(
            <Wrapper>
                <AdminExportAuth onExportAuth={mockExportAuth} />
            </Wrapper>,
        );

        const button = screen.getByTestId('export-auth-button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(notifications.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: notificationId,
                    color: 'red',
                    title: 'Error',
                    message: `Failed to export auth data: Error: ${errorMessage}`,
                    loading: false,
                }),
            );
        });

        expect(mockExportAuth).toHaveBeenCalled();
        expect(mockExportAuth).toHaveBeenCalledTimes(1);
    });
});
