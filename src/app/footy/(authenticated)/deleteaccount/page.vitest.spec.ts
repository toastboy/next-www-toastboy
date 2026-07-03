import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

vi.mock('@/actions/deletePlayer', () => ({
    deletePlayer: vi.fn(),
}));

vi.mock('@/components/DeleteAccountForm/DeleteAccountForm', () => ({
    DeleteAccountForm: vi.fn(() => null),
}));

import { deletePlayer } from '@/actions/deletePlayer';
import DeleteAccountPage from '@/app/footy/(authenticated)/deleteaccount/page';
import { DeleteAccountForm } from '@/components/DeleteAccountForm/DeleteAccountForm';

describe('Delete Account page', () => {
    it('renders the DeleteAccountForm with the deletePlayer server action', () => {
        renderToStaticMarkup(DeleteAccountPage());

        expect(DeleteAccountForm).toHaveBeenCalledWith(
            { onDeletePlayer: deletePlayer },
            undefined,
        );
    });
});
