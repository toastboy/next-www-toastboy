import { vi } from 'vitest';

vi.mock('@/actions/auth');
vi.mock('@/lib/observability/sentry');

describe('Admin Users page', () => {
    it.todo('fetches all users via listUsersAction');
    it.todo('passes users and setAdminRole to AdminUserList');
    it.todo('renders an error message when listUsersAction throws');
    it.todo('calls captureUnexpectedError when listUsersAction throws');
});
