jest.mock('lib/mail', () => ({
    sendEmail: jest.fn().mockResolvedValue(undefined),
}));

import { render, screen, waitFor } from '@testing-library/react';

import { SendEmailForm } from '@/components/SendEmailForm/SendEmailForm';
import { defaultPlayer } from '@/tests/mocks';

import { Wrapper } from './lib/common';

jest.mock('@tiptap/react', () => ({
    useEditor: jest.fn(() => ({
        getHTML: () => '<p>Test message</p>',
    })),
}));

describe('SendEmailForm', () => {
    it('renders modal with subject input and send button', async () => {
        const onClose = jest.fn();
        render(
            <Wrapper>
                <SendEmailForm opened={true} onClose={onClose} players={[defaultPlayer]} />
            </Wrapper>,
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Send Mail/i })).toBeInTheDocument();
        });
    });
});
