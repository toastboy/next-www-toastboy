import { describe, expect, it } from 'vitest';

import { toPounds } from '@/lib/money';

describe('toPounds', () => {
    it('converts pence to pounds', () => {
        expect(toPounds(100)).toBe(1);
        expect(toPounds(250)).toBe(2.5);
        expect(toPounds(0)).toBe(0);
    });
});

describe('fromPounds', () => {
    it.todo('converts pounds to pence, rounding fractional values to the nearest integer');
    it.todo('handles floating-point imprecision correctly');
});

describe('formatCurrency', () => {
    it.todo('prefixes the amount with a £ sign and formats to two decimal places');
    it.todo('formats zero as £0.00');
    it.todo('formats negative pence amounts');
});

describe('formatCurrencySigned', () => {
    it.todo('returns a plain £-prefixed string for positive amounts');
    it.todo('returns a -£-prefixed string for negative amounts');
    it.todo('formats zero without a sign prefix');
});

describe('getBalanceColor', () => {
    it.todo('returns red for negative balances');
    it.todo('returns teal for positive balances');
    it.todo('returns dimmed for a zero balance');
});
