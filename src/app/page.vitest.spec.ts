import { vi } from 'vitest';

vi.mock('next/navigation');

describe('Root page', () => {
    it('redirects to /footy', async () => {
        const { redirect } = await import('next/navigation');
        const HomePage = (await import('./page')).default;

        HomePage();

        expect(redirect).toHaveBeenCalledWith('/footy');
    });
});
