
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { SendEmailForm } from '@/components/SendEmailForm/SendEmailForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerData } from '@/tests/mocks/data/playerData';

describe('SendEmailForm', () => {
    it('renders modal with subject input and send button', async () => {
        const onClose = vi.fn();
        render(
            <Wrapper>
                <SendEmailForm opened={true} onClose={onClose} players={[defaultPlayerData]} />
            </Wrapper>,
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Send Mail/i })).toBeInTheDocument();
        });
    });
});
