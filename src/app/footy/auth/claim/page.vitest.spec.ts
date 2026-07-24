import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

vi.mock('@mantine/core', () => ({
    Paper: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/ClaimSignup/ClaimSignup', () => ({
    ClaimSignup: vi.fn(() => null),
}));

import Page from '@/app/footy/auth/claim/page';
import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';

describe('Claim Sign Up page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('passes name, email, and token through to ClaimSignup', async () => {
        const element = await Page({
            searchParams: Promise.resolve({ name: 'Alice', email: 'alice@example.com', token: 'tok' }),
        });
        renderToStaticMarkup(element);

        expect(ClaimSignup).toHaveBeenCalledWith(
            { name: 'Alice', email: 'alice@example.com', token: 'tok' },
            undefined,
        );
    });

    it('defaults name, email, and token to empty strings when missing', async () => {
        const element = await Page({ searchParams: Promise.resolve({}) });
        renderToStaticMarkup(element);

        expect(ClaimSignup).toHaveBeenCalledWith(
            { name: '', email: '', token: '' },
            undefined,
        );
    });

    it('defaults name, email, and token to empty strings when searchParams is not provided', async () => {
        const element = await Page({});
        renderToStaticMarkup(element);

        expect(ClaimSignup).toHaveBeenCalledWith(
            { name: '', email: '', token: '' },
            undefined,
        );
    });
});
