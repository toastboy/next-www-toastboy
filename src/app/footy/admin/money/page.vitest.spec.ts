import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('services/Money');
vi.mock('@/actions/payDebt', () => ({
    payDebt: vi.fn(),
}));

import { payDebt } from '@/actions/payDebt';
import MoneyPage from '@/app/footy/admin/money/page';
import moneyService from '@/services/Money';
import { createMockDebtsSummary, defaultDebtsSummary } from '@/tests/mocks/data/money';

interface AnyElement { type: unknown; props: Record<string, unknown> }

// Helper to find a named component element anywhere in a JSX tree
const findElement = (node: unknown, displayName: string): AnyElement | null => {
    if (!node || typeof node !== 'object') return null;
    const el = node as AnyElement;
    if (typeof el.type === 'function') {
        const fn = el.type as { displayName?: string; name?: string };
        const name = fn.displayName ?? fn.name;
        if (name === displayName) return el;
    }
    const children = (el.props as { children?: unknown }).children;
    if (Array.isArray(children)) {
        for (const child of children) {
            const found = findElement(child, displayName);
            if (found) return found;
        }
    }
    return findElement(children, displayName);
};

describe('Admin Money page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (moneyService.getDebts as Mock).mockResolvedValue(defaultDebtsSummary);
    });

    it('calls moneyService.getDebts', async () => {
        await MoneyPage();

        expect(moneyService.getDebts).toHaveBeenCalledOnce();
    });

    it('passes debts.players to MoneyForm as playerDebts', async () => {
        const summary = createMockDebtsSummary();
        (moneyService.getDebts as Mock).mockResolvedValue(summary);

        const result = await MoneyPage();

        const form = findElement(result, 'MoneyForm');
        expect(form?.props.playerDebts).toEqual(summary.players);
    });

    it('passes the payDebt action to MoneyForm', async () => {
        const result = await MoneyPage();

        const form = findElement(result, 'MoneyForm');
        expect(form?.props.payDebt).toBe(payDebt);
    });

    it('propagates errors from moneyService.getDebts', async () => {
        (moneyService.getDebts as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(MoneyPage()).rejects.toThrow('DB failed');
    });
});
