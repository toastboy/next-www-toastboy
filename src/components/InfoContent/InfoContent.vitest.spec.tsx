import { render, screen } from '@testing-library/react';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('@/components/EnquiryForm/EnquiryForm', () => ({
    EnquiryForm: vi.fn(() => null),
}));

import { EnquiryForm } from '@/components/EnquiryForm/EnquiryForm';
import { InfoContent } from '@/components/InfoContent/InfoContent';
import { Wrapper } from '@/tests/components/lib/common';

describe('InfoContent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the heading and rules/points/averages/stalwart/speedy links', () => {
        render(
            <Wrapper>
                <InfoContent onSendEnquiry={vi.fn()} />
            </Wrapper>,
        );

        expect(
            screen.getByRole('heading', {
                name: 'Toastboy FC: Tuesday Night Football',
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: /outline of the rules/ }),
        ).toHaveAttribute('href', '/footy/rules');
        expect(screen.getByRole('link', { name: 'Points' })).toHaveAttribute(
            'href',
            '/footy/points',
        );
        expect(screen.getByRole('link', { name: 'Averages' })).toHaveAttribute(
            'href',
            '/footy/averages',
        );
        expect(screen.getByRole('link', { name: 'Stalwart' })).toHaveAttribute(
            'href',
            '/footy/stalwart',
        );
        expect(
            screen.getByRole('link', { name: 'Captain Speedy' }),
        ).toHaveAttribute('href', '/footy/speedy');
    });

    it('passes the onSendEnquiry action through to EnquiryForm', () => {
        const onSendEnquiry = vi.fn();

        render(
            <Wrapper>
                <InfoContent onSendEnquiry={onSendEnquiry} />
            </Wrapper>,
        );

        const [props] = (EnquiryForm as Mock).mock.calls[0] as [
            { onSendEnquiry: unknown },
        ];
        expect(props.onSendEnquiry).toBe(onSendEnquiry);
    });
});
