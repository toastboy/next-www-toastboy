import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

vi.mock('@/components/PasswordChangeForm/PasswordChangeForm', () => ({
    PasswordChangeForm: vi.fn(() => null),
}));

import ChangePasswordPage from '@/app/footy/(authenticated)/password/page';
import { PasswordChangeForm } from '@/components/PasswordChangeForm/PasswordChangeForm';

describe('Change Password page', () => {
    it('renders the PasswordChangeForm', () => {
        renderToStaticMarkup(ChangePasswordPage());

        expect(PasswordChangeForm).toHaveBeenCalledWith({}, undefined);
    });
});
