import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('@/actions/sendEnquiry', () => ({
    sendEnquiry: vi.fn(),
}));

vi.mock('@/components/EnquiryForm/EnquiryForm', () => ({
    EnquiryForm: vi.fn(() => null),
}));

vi.mock('@mantine/core', () => ({
    Anchor: ({ children }: { children?: unknown }) => children,
    Container: ({ children }: { children?: unknown }) => children,
    Flex: ({ children }: { children?: unknown }) => children,
    Text: ({ children }: { children?: unknown }) => children,
    Title: ({ children }: { children?: unknown }) => children,
}));

import { sendEnquiry } from '@/actions/sendEnquiry';
import Page from '@/app/footy/info/page';
import { EnquiryForm } from '@/components/EnquiryForm/EnquiryForm';

describe('Info page', () => {
    it('renders club information content', () => {
        const html = renderToStaticMarkup(Page());

        expect(html).toContain('Toastboy FC: Tuesday Night Football');
        expect(html).toContain('Kelsey Kerridge Sports Centre');
    });

    it('passes sendEnquiry action to EnquiryForm', () => {
        renderToStaticMarkup(Page());

        expect(EnquiryForm as Mock).toHaveBeenCalledWith(
            expect.objectContaining({
                redirectUrl: '/footy/info',
                onSendEnquiry: sendEnquiry,
            }),
            undefined,
        );
    });
});
