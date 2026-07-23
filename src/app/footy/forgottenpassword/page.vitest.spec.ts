import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

vi.mock('@mantine/core', () => ({
    Paper: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/ForgottenPasswordForm/ForgottenPasswordForm', () => ({
    ForgottenPasswordForm: vi.fn(() => null),
}));

import ForgottenPasswordPage from '@/app/footy/forgottenpassword/page';
import { ForgottenPasswordForm } from '@/components/ForgottenPasswordForm/ForgottenPasswordForm';

describe('Forgotten Password page', () => {
    it('renders the ForgottenPasswordForm', () => {
        renderToStaticMarkup(ForgottenPasswordPage());

        expect(ForgottenPasswordForm).toHaveBeenCalledWith({}, undefined);
    });
});
