import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

vi.mock('@mantine/core', () => ({
    Notification: ({ children }: { children?: unknown }) => children,
    Text: ({ children }: { children?: unknown }) => children,
}));

import AccountDeletedPage from '@/app/footy/auth/accountdeleted/page';

describe('Account Deleted page', () => {
    it('renders the account deleted confirmation notification', () => {
        const html = renderToStaticMarkup(AccountDeletedPage());

        expect(html).toContain('Your account has been successfully deleted.');
    });
});
