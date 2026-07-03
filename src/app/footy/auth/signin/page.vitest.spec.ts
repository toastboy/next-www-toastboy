import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('@/components/SignIn/SignIn', () => ({
    SignIn: vi.fn(() => null),
}));

import SignInPage from '@/app/footy/auth/signin/page';
import { SignIn } from '@/components/SignIn/SignIn';

describe('Sign In page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the SignIn component with a default redirect to /footy/profile', async () => {
        renderToStaticMarkup(await SignInPage({ searchParams: Promise.resolve({}) }));

        expect(SignIn).toHaveBeenCalledWith(
            { redirect: '/footy/profile', admin: undefined },
            undefined,
        );
    });

    it('passes through a custom redirect param', async () => {
        renderToStaticMarkup(await SignInPage({ searchParams: Promise.resolve({ redirect: '/footy/games' }) }));

        const [[props]] = (SignIn as Mock).mock.calls as [{ redirect: string }][];
        expect(props.redirect).toBe('/footy/games');
    });

    it('parses admin=true into a boolean true', async () => {
        renderToStaticMarkup(await SignInPage({ searchParams: Promise.resolve({ admin: 'true' }) }));

        const [[props]] = (SignIn as Mock).mock.calls as [{ admin?: boolean }][];
        expect(props.admin).toBe(true);
    });

    it('parses admin=false into a boolean false', async () => {
        renderToStaticMarkup(await SignInPage({ searchParams: Promise.resolve({ admin: 'false' }) }));

        const [[props]] = (SignIn as Mock).mock.calls as [{ admin?: boolean }][];
        expect(props.admin).toBe(false);
    });

    it('leaves admin undefined when the param is absent or unrecognised', async () => {
        renderToStaticMarkup(await SignInPage({ searchParams: Promise.resolve({ admin: 'nonsense' }) }));

        const [[props]] = (SignIn as Mock).mock.calls as [{ admin?: boolean }][];
        expect(props.admin).toBeUndefined();
    });
});
