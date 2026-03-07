import { vi } from 'vitest';

vi.mock('next/navigation');

describe('Reset Password page', () => {
    it.todo('renders PasswordResetForm when a token is present in searchParams');
    it.todo('renders an error notification when the token is absent');
    it.todo('renders an error notification when searchParams is undefined');
});
