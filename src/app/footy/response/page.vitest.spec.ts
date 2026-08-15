import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
    redirect: vi.fn(() => {
        throw new Error('redirected');
    }),
}));

import { redirect } from 'next/navigation';

import Page from '@/app/footy/response/page';

describe('Game Invitation Response landing page', () => {
    it('redirects to /footy/game', () => {
        expect(() => Page()).toThrow('redirected');

        expect(redirect).toHaveBeenCalledWith('/footy/game');
    });
});
