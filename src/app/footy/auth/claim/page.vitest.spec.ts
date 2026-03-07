import { vi } from 'vitest';

vi.mock('next/navigation');

describe('Claim Sign Up page', () => {
    it.todo('renders ClaimSignup when name, email, and token are all present');
    it.todo('redirects with an error param when any of name, email, or token is missing');
    it.todo('renders the error from the error param without redirecting again');
    it.todo('passes name, email, and token through to ClaimSignup');
});
