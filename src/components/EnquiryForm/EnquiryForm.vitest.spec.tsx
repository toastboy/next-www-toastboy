import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { EnquiryForm } from '@/components/EnquiryForm/EnquiryForm';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { Wrapper } from '@/tests/components/lib/common';
import { SendEnquiryProxy } from '@/types/actions/SendEnquiry';

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: vi.fn(),
}));

describe('EnquiryForm', () => {
    const mockSendEnquiry: SendEnquiryProxy = vi
        .fn()
        .mockResolvedValue(undefined);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the form fields', async () => {
        render(
            <Wrapper>
                <EnquiryForm onSendEnquiry={mockSendEnquiry} />
            </Wrapper>,
        );
        await waitFor(() => {
            expect(
                screen.getByRole('textbox', { name: /^Name/ }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole('textbox', { name: /^Email/ }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole('textbox', { name: /^Message/ }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: 'Send message' }),
            ).toBeInTheDocument();
        });
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <EnquiryForm onSendEnquiry={mockSendEnquiry} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: 'Send message' }));

        expect(await screen.findByText('Name is required')).toBeInTheDocument();
        expect(await screen.findByText('Invalid email')).toBeInTheDocument();
        expect(
            await screen.findByText('Message is required'),
        ).toBeInTheDocument();
    });

    it('submits valid data', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <EnquiryForm onSendEnquiry={mockSendEnquiry} />
            </Wrapper>,
        );

        await user.type(
            screen.getByRole('textbox', { name: /^Name/ }),
            'Test User',
        );
        await user.type(
            screen.getByRole('textbox', { name: /^Email/ }),
            'test@example.com',
        );
        await user.type(
            screen.getByRole('textbox', { name: /^Message/ }),
            'Hello there',
        );
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(mockSendEnquiry).toHaveBeenCalledWith({
                name: 'Test User',
                email: 'test@example.com',
                message: 'Hello there',
            });
        });
    });

    it('shows error notification when submit throws', async () => {
        const user = userEvent.setup();
        const submitError = new Error('Server error');
        const failingSubmit = vi
            .fn<SendEnquiryProxy>()
            .mockRejectedValue(submitError);
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');

        render(
            <Wrapper>
                <EnquiryForm onSendEnquiry={failingSubmit} />
            </Wrapper>,
        );

        await user.type(
            screen.getByRole('textbox', { name: /^Name/ }),
            'Test User',
        );
        await user.type(
            screen.getByRole('textbox', { name: /^Email/ }),
            'test@example.com',
        );
        await user.type(
            screen.getByRole('textbox', { name: /^Message/ }),
            'Hello there',
        );
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(captureUnexpectedError).toHaveBeenCalledWith(
                submitError,
                expect.objectContaining({
                    layer: 'client',
                    component: 'EnquiryForm',
                }),
            );
        });
        expect(notificationUpdateSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                color: 'red',
                title: 'Error',
                message: 'Unable to send your message.',
            }),
        );
    });
});
