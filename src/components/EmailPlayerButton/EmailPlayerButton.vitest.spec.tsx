import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { EmailPlayerButton } from '@/components/EmailPlayerButton/EmailPlayerButton';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerEmailData } from '@/tests/mocks/data/playerData';

vi.mock('@/components/SendEmailForm/SendEmailForm');

describe('EmailPlayerButton', () => {
    it('renders the Send Email button', () => {
        render(
            <Wrapper>
                <EmailPlayerButton
                    player={defaultPlayerEmailData}
                    onSendEmail={vi.fn()}
                />
            </Wrapper>,
        );

        expect(screen.getByRole('button', { name: /Send Email/i })).toBeInTheDocument();
    });

    it('does not show the modal as open initially', () => {
        render(
            <Wrapper>
                <EmailPlayerButton
                    player={defaultPlayerEmailData}
                    onSendEmail={vi.fn()}
                />
            </Wrapper>,
        );

        expect(screen.queryByRole('button', { name: /Close SendEmailForm/i })).not.toBeInTheDocument();
    });

    it('opens SendEmailForm when the button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <EmailPlayerButton
                    player={defaultPlayerEmailData}
                    onSendEmail={vi.fn()}
                />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /Send Email/i }));

        expect(screen.getByRole('button', { name: /Close SendEmailForm/i })).toBeInTheDocument();
    });

    it('closes SendEmailForm when the modal close callback is invoked', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <EmailPlayerButton
                    player={defaultPlayerEmailData}
                    onSendEmail={vi.fn()}
                />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /Send Email/i }));
        expect(screen.getByRole('button', { name: /Close SendEmailForm/i })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /Close SendEmailForm/i }));
        expect(screen.queryByRole('button', { name: /Close SendEmailForm/i })).not.toBeInTheDocument();
    });

    it('passes the player to SendEmailForm', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <EmailPlayerButton
                    player={defaultPlayerEmailData}
                    onSendEmail={vi.fn()}
                />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /Send Email/i }));

        expect(screen.getByText((content) =>
            content.startsWith('SendEmailForm:') &&
            content.includes(defaultPlayerEmailData.name),
        )).toBeInTheDocument();
    });
});
