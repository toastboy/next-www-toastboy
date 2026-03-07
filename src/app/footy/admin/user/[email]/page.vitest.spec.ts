import { vi } from 'vitest';

vi.mock('@/actions/auth');
vi.mock('@/lib/observability/sentry');
vi.mock('next/navigation');

describe('Admin User [email] page', () => {
    it.todo('URL-decodes the email param before passing it to listUsersAction');
    it.todo('renders AdminUserData when the user is found');
    it.todo('calls notFound when listUsersAction returns an empty result');
    it.todo('calls captureUnexpectedError and calls notFound when listUsersAction throws');
});
