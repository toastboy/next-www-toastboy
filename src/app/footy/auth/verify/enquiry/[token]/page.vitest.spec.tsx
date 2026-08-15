import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

const { captureUnexpectedErrorMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
}));

vi.mock('@/actions/sendEnquiry', () => ({
    deliverContactEnquiry: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

vi.mock('@mantine/core', () => ({
    Anchor: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
    Notification: ({ children }: { children?: ReactNode }) => (
        <div>{children}</div>
    ),
    Stack: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@tabler/icons-react', () => ({
    IconCheck: () => null,
    IconX: () => null,
}));

import { deliverContactEnquiry } from '@/actions/sendEnquiry';
import { NotFoundError } from '@/lib/errors';

import Page from './page';

describe('Enquiry verify page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders a thank-you message when the enquiry is delivered', async () => {
        vi.mocked(deliverContactEnquiry).mockResolvedValue({
            enquiry: 'verified',
        });

        const element = await Page({
            params: Promise.resolve({ token: 'tok' }),
        });
        const html = renderToStaticMarkup(element);

        expect(deliverContactEnquiry).toHaveBeenCalledWith('tok');
        expect(html).toContain('Thanks for your message');
        expect(html).toContain('Return to the home page');
        expect(captureUnexpectedErrorMock).not.toHaveBeenCalled();
    });

    it('renders a thank-you message when the enquiry was already delivered', async () => {
        vi.mocked(deliverContactEnquiry).mockResolvedValue({
            enquiry: 'already-delivered',
        });

        const element = await Page({
            params: Promise.resolve({ token: 'tok' }),
        });
        const html = renderToStaticMarkup(element);

        expect(html).toContain('Thanks for your message');
    });

    it('renders the public error message and a link home when delivery fails', async () => {
        vi.mocked(deliverContactEnquiry).mockRejectedValue(
            new NotFoundError('Enquiry not found for this verification.'),
        );

        const element = await Page({
            params: Promise.resolve({ token: 'bad-tok' }),
        });
        const html = renderToStaticMarkup(element);

        expect(html).toContain('Return to the home page');
        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            expect.any(NotFoundError),
            expect.objectContaining({
                layer: 'server',
                action: 'deliverContactEnquiry',
                component: 'EnquiryVerify',
                route: '/footy/auth/verify/enquiry/[token]',
            }),
        );
    });

    it('captures unexpected errors and falls back to a generic message', async () => {
        vi.mocked(deliverContactEnquiry).mockRejectedValue(
            new Error('Database timeout'),
        );

        const element = await Page({
            params: Promise.resolve({ token: 'bad-tok' }),
        });
        const html = renderToStaticMarkup(element);

        expect(html).toContain('Unable to deliver your message.');
        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                layer: 'server',
                action: 'deliverContactEnquiry',
                component: 'EnquiryVerify',
                route: '/footy/auth/verify/enquiry/[token]',
            }),
        );
    });
});
