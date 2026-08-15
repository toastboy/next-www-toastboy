import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname } from 'next/navigation';
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
        vi.mocked(usePathname).mockReturnValue('/footy/info');
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

    it('shows a loading state on submit and clears it after a successful send', async () => {
        const user = userEvent.setup();
        let resolveSend: () => void = () => undefined;
        const pending = new Promise<void>((resolve) => {
            resolveSend = resolve;
        });
        const slowSubmit = vi.fn<SendEnquiryProxy>().mockReturnValue(pending);

        render(
            <Wrapper>
                <EnquiryForm onSendEnquiry={slowSubmit} />
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
        const submitButton = screen.getByRole('button', {
            name: 'Send message',
        });
        await user.click(submitButton);

        await waitFor(() => {
            expect(submitButton).toHaveAttribute('data-loading', 'true');
        });

        resolveSend();

        await waitFor(() => {
            expect(submitButton).not.toHaveAttribute('data-loading', 'true');
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
        const submitButton = screen.getByRole('button', {
            name: 'Send message',
        });
        await user.click(submitButton);

        await waitFor(() => {
            expect(captureUnexpectedError).toHaveBeenCalledWith(
                submitError,
                expect.objectContaining({
                    layer: 'client',
                    component: 'EnquiryForm',
                    route: '/footy/info',
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
        expect(submitButton).not.toHaveAttribute('data-loading', 'true');
    });
});
