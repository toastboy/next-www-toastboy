import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/Outcome');
vi.mock('@mantine/core', () => ({
    Stack: ({ children }: { children?: unknown }) => children,
}));
vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: vi.fn(() => null),
}));
vi.mock('@/components/Turnout/Turnout', () => ({
    Turnout: vi.fn(() => null),
}));

import { renderToStaticMarkup } from 'react-dom/server';

import TurnoutPage from '@/app/footy/turnout/page';
import { Turnout } from '@/components/Turnout/Turnout';
import outcomeService from '@/services/Outcome';

describe('Turnout page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (outcomeService.getTurnoutByYear as Mock).mockResolvedValue([]);
    });

    it('calls outcomeService.getTurnoutByYear', async () => {
        await TurnoutPage();

        expect(outcomeService.getTurnoutByYear).toHaveBeenCalledTimes(1);
    });

    it('passes the turnout data to the Turnout component', async () => {
        const turnout = [{ year: 2021, count: 10 }];
        (outcomeService.getTurnoutByYear as Mock).mockResolvedValue(turnout);

        renderToStaticMarkup(await TurnoutPage());

        const [[props]] = (Turnout as Mock).mock.calls as [{ turnout: unknown }][];
        expect(props.turnout).toEqual(turnout);
    });

    it('propagates errors from outcomeService.getTurnoutByYear', async () => {
        (outcomeService.getTurnoutByYear as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(TurnoutPage()).rejects.toThrow('DB failed');
    });
});
