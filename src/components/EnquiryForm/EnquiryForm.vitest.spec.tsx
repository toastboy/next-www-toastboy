import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { vi } from 'vitest';

import { EnquiryForm } from '@/components/EnquiryForm/EnquiryForm';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { Wrapper } from '@/tests/components/lib/common';
import { SendEnquiryProxy } from '@/types/actions/SendEnquiry';

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: vi.fn(),
}));

const mockParams = (init = '') =>
    new URLSearchParams(init) as unknown as ReturnType<typeof useSearchParams>;

describe('EnquiryForm', () => {
    const mockSendEnquiry: SendEnquiryProxy = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useSearchParams).mockReturnValue(mockParams());
        vi.mocked(usePathname).mockReturnValue('/footy/contact');
        vi.mocked(useRouter).mockReturnValue({
            push: vi.fn(),
            replace: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
            prefetch: vi.fn(),
        });
    });

    it('renders the form fields', async () => {
        render(<Wrapper><EnquiryForm redirectUrl="redirect-url" onSendEnquiry={mockSendEnquiry} /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: /^Name/ })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /^Email/ })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /^Message/ })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
        });
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        render(<Wrapper><EnquiryForm redirectUrl="redirect-url" onSendEnquiry={mockSendEnquiry} /></Wrapper>);

        await user.click(screen.getByRole('button', { name: 'Send message' }));

        expect(await screen.findByText('Name is required')).toBeInTheDocument();
        expect(await screen.findByText('Invalid email')).toBeInTheDocument();
        expect(await screen.findByText('Message is required')).toBeInTheDocument();
    });

    it('submits valid data', async () => {
        const user = userEvent.setup();
        render(<Wrapper><EnquiryForm redirectUrl="redirect-url" onSendEnquiry={mockSendEnquiry} /></Wrapper>);

        await user.type(screen.getByRole('textbox', { name: /^Name/ }), 'Test User');
        await user.type(screen.getByRole('textbox', { name: /^Email/ }), 'test@example.com');
        await user.type(screen.getByRole('textbox', { name: /^Message/ }), 'Hello there');
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(mockSendEnquiry).toHaveBeenCalledWith({
                name: 'Test User',
                email: 'test@example.com',
                message: 'Hello there',
            }, 'redirect-url');
        });
    });

    it('shows success notification and cleans URL when enquiry=verified in params', async () => {
        const replace = vi.fn();
        vi.mocked(useRouter).mockReturnValue({ replace, push: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() });
        vi.mocked(useSearchParams).mockReturnValue(mockParams('enquiry=verified'));
        const showSpy = vi.spyOn(notifications, 'show');

        render(<Wrapper><EnquiryForm redirectUrl="redirect-url" onSendEnquiry={mockSendEnquiry} /></Wrapper>);

        await waitFor(() => {
            expect(showSpy).toHaveBeenCalledWith(expect.objectContaining({
                color: 'teal',
                title: 'Email verified',
            }));
        });
        expect(replace).toHaveBeenCalledWith('/footy/contact');
    });

    it('shows error notification and cleans URL when enquiry=error in params', async () => {
        const replace = vi.fn();
        vi.mocked(useRouter).mockReturnValue({ replace, push: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() });
        vi.mocked(useSearchParams).mockReturnValue(mockParams('enquiry=error&error=Could+not+verify'));
        const showSpy = vi.spyOn(notifications, 'show');

        render(<Wrapper><EnquiryForm redirectUrl="redirect-url" onSendEnquiry={mockSendEnquiry} /></Wrapper>);

        await waitFor(() => {
            expect(showSpy).toHaveBeenCalledWith(expect.objectContaining({
                color: 'red',
                title: 'Verification failed',
                message: 'Could not verify',
            }));
        });
        expect(replace).toHaveBeenCalledWith('/footy/contact');
    });

    it('shows fallback error message when enquiry=error but no error param', async () => {
        const replace = vi.fn();
        vi.mocked(useRouter).mockReturnValue({ replace, push: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() });
        vi.mocked(useSearchParams).mockReturnValue(mockParams('enquiry=error'));
        const showSpy = vi.spyOn(notifications, 'show');

        render(<Wrapper><EnquiryForm redirectUrl="redirect-url" onSendEnquiry={mockSendEnquiry} /></Wrapper>);

        await waitFor(() => {
            expect(showSpy).toHaveBeenCalledWith(expect.objectContaining({
                color: 'red',
                title: 'Verification failed',
                message: 'We could not verify your email.',
            }));
        });
    });

    it('preserves remaining search params when cleaning up enquiry status', async () => {
        const replace = vi.fn();
        vi.mocked(useRouter).mockReturnValue({ replace, push: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() });
        vi.mocked(useSearchParams).mockReturnValue(mockParams('enquiry=verified&tab=info'));

        render(<Wrapper><EnquiryForm redirectUrl="redirect-url" onSendEnquiry={mockSendEnquiry} /></Wrapper>);

        await waitFor(() => {
            expect(replace).toHaveBeenCalledWith('/footy/contact?tab=info');
        });
    });

    it('shows error notification when submit throws', async () => {
        const user = userEvent.setup();
        const submitError = new Error('Server error');
        const failingSubmit = vi.fn<SendEnquiryProxy>().mockRejectedValue(submitError);
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');

        render(<Wrapper><EnquiryForm redirectUrl="redirect-url" onSendEnquiry={failingSubmit} /></Wrapper>);

        await user.type(screen.getByRole('textbox', { name: /^Name/ }), 'Test User');
        await user.type(screen.getByRole('textbox', { name: /^Email/ }), 'test@example.com');
        await user.type(screen.getByRole('textbox', { name: /^Message/ }), 'Hello there');
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(captureUnexpectedError).toHaveBeenCalledWith(
                submitError,
                expect.objectContaining({ layer: 'client', component: 'EnquiryForm' }),
            );
        });
        expect(notificationUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
            color: 'red',
            title: 'Error',
            message: 'Unable to send your message.',
        }));
    });
});
