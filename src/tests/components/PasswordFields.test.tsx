import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasswordFields } from '@/components/PasswordFields/PasswordFields';
import { Wrapper } from '@/tests/components/lib/common';

describe('PasswordFields', () => {
    it('renders default labels and placeholders', () => {
        render(
            <Wrapper>
                <PasswordFields
                    passwordProps={{ name: 'password' }}
                    confirmPasswordProps={{ name: 'confirmPassword' }}
                />
            </Wrapper>,
        );

        const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/password/i);
        expect(passwordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
    });

    it('renders custom labels and placeholders', () => {
        render(
            <Wrapper>
                <PasswordFields
                    passwordProps={{ name: 'password' }}
                    confirmPasswordProps={{ name: 'confirmPassword' }}
                    passwordLabel="New password"
                    confirmPasswordLabel="Repeat password"
                    passwordPlaceholder="Choose a password"
                    confirmPasswordPlaceholder="Repeat your password"
                />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/New password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Repeat password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Choose a password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Repeat your password/i)).toBeInTheDocument();
    });

    it('accepts user input for both fields', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <PasswordFields
                    passwordProps={{ name: 'password' }}
                    confirmPasswordProps={{ name: 'confirmPassword' }}
                />
            </Wrapper>,
        );

        const [passwordInput, confirmInput] = screen.getAllByLabelText(/password/i);

        await user.type(passwordInput, 'Password123');
        await user.type(confirmInput, 'Password123');

        expect(passwordInput).toHaveValue('Password123');
        expect(confirmInput).toHaveValue('Password123');
    });
});
