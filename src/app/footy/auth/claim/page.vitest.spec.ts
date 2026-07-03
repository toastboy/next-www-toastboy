import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
    redirect: vi.fn(() => { throw new Error('redirected'); }),
}));

vi.mock('@/components/ClaimSignup/ClaimSignup', () => ({
    ClaimSignup: vi.fn(() => null),
}));

import { redirect } from 'next/navigation';

import Page from '@/app/footy/auth/claim/page';
import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';

describe('Claim Sign Up page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders ClaimSignup when name, email, and token are all present', async () => {
        const element = await Page({
            searchParams: Promise.resolve({ name: 'Alice', email: 'alice@example.com', token: 'tok' }),
        });
        renderToStaticMarkup(element);

        expect(redirect).not.toHaveBeenCalled();
        expect(ClaimSignup).toHaveBeenCalled();
    });

    it('redirects with an error param when any of name, email, or token is missing', async () => {
        await expect(
            Page({ searchParams: Promise.resolve({ name: 'Alice' }) }),
        ).rejects.toThrow('redirected');

        expect(redirect).toHaveBeenCalledWith(
            '/footy/auth/claim?name=Alice&error=Missing+required+invitation+details.',
        );
    });

    it('renders the error from the error param without redirecting again', async () => {
        const element = await Page({
            searchParams: Promise.resolve({ error: 'Missing required invitation details.' }),
        });
        renderToStaticMarkup(element);

        expect(redirect).not.toHaveBeenCalled();
        expect(ClaimSignup).toHaveBeenCalled();
    });

    it('redirects with an error param when searchParams is not provided at all', async () => {
        await expect(Page({})).rejects.toThrow('redirected');

        expect(redirect).toHaveBeenCalledWith(
            '/footy/auth/claim?error=Missing+required+invitation+details.',
        );
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
});
