const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/auth-client', () => ({
    signInWithGoogle: jest.fn(),
    signInWithMicrosoft: jest.fn(),
}));

jest.mock('@/actions/auth', () => ({
    setPasswordAction: jest.fn(),
    updateUserNameAction: jest.fn(),
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { setPasswordAction, updateUserNameAction } from '@/actions/auth';
import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';
import { signInWithGoogle, signInWithMicrosoft } from '@/lib/auth-client';
import { Wrapper } from '@/tests/components/lib/common';

describe('ClaimSignup', () => {
    const props = {
        name: 'Sam Smith',
        email: 'sam@example.com',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form with the provided name and email', () => {
        render(
            <Wrapper>
                <ClaimSignup {...props} />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/Name/i)).toHaveValue(props.name);
        expect(screen.getByLabelText(/Email/i)).toHaveValue(props.email);
        expect(screen.getByLabelText(/Email/i)).toBeDisabled();
        expect(screen.getByRole('button', { name: /Create login/i })).toBeInTheDocument();
    });

    it('triggers social sign in with the claim redirect', async () => {
        const user = userEvent.setup();
        const redirect = '/footy/profile';

        render(
            <Wrapper>
                <ClaimSignup {...props} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /Continue with Google/i }));
        await user.click(screen.getByRole('button', { name: /Continue with Microsoft/i }));

        expect(signInWithGoogle).toHaveBeenCalledWith(redirect);
        expect(signInWithMicrosoft).toHaveBeenCalledWith(redirect);
    });

    it('submits valid credentials and redirects on success', async () => {
        const user = userEvent.setup();
        const redirect = '/footy/profile';
        const mockSetPassword = setPasswordAction as jest.Mock;
        const mockUpdateUserName = updateUserNameAction as jest.Mock;
        mockSetPassword.mockResolvedValueOnce(undefined);
        mockUpdateUserName.mockResolvedValueOnce(undefined);

        render(
            <Wrapper>
                <ClaimSignup {...props} />
            </Wrapper>,
        );

        await user.type(screen.getByPlaceholderText(/^Enter your password$/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm password/i), 'Password123');
        await user.click(screen.getByRole('button', { name: /Create login/i }));

        await waitFor(() => {
            expect(mockUpdateUserName).not.toHaveBeenCalled();
            expect(mockSetPassword).toHaveBeenCalledWith('Password123');
            expect(mockPush).toHaveBeenCalledWith(redirect);
        });
    });
});
