import { describe, expect, it } from 'vitest';

import { formatCurrency, formatCurrencySigned, fromPounds, getBalanceColor, toPounds } from '@/lib/money';

describe('toPounds', () => {
    it('converts pence to pounds', () => {
        expect(toPounds(100)).toBe(1);
        expect(toPounds(250)).toBe(2.5);
        expect(toPounds(0)).toBe(0);
    });
});

describe('fromPounds', () => {
    it('converts pounds to pence', () => {
        expect(fromPounds(1)).toBe(100);
        expect(fromPounds(2.5)).toBe(250);
        expect(fromPounds(0)).toBe(0);
    });

    it('rounds fractional pence to the nearest integer', () => {
        expect(fromPounds(0.666)).toBe(67);
        expect(fromPounds(0.334)).toBe(33);
    });
});

describe('formatCurrency', () => {
    it('prefixes the amount with a £ sign and formats to two decimal places', () => {
        expect(formatCurrency(1050)).toBe('£10.50');
        expect(formatCurrency(100)).toBe('£1.00');
        expect(formatCurrency(1)).toBe('£0.01');
    });

    it('formats zero as £0.00', () => {
        expect(formatCurrency(0)).toBe('£0.00');
    });
});

describe('formatCurrencySigned', () => {
    it('returns a plain £-prefixed string for positive amounts', () => {
        expect(formatCurrencySigned(1050)).toBe('£10.50');
    });

    it('returns a -£-prefixed string for negative amounts', () => {
        expect(formatCurrencySigned(-1050)).toBe('-£10.50');
    });

    it('formats zero without a sign prefix', () => {
        expect(formatCurrencySigned(0)).toBe('£0.00');
    });
});

describe('getBalanceColor', () => {
    it('returns red for negative balances', () => {
        expect(getBalanceColor(-1)).toBe('red');
        expect(getBalanceColor(-100)).toBe('red');
    });

    it('returns teal for positive balances', () => {
        expect(getBalanceColor(1)).toBe('teal');
        expect(getBalanceColor(100)).toBe('teal');
    });

    it('returns dimmed for a zero balance', () => {
        expect(getBalanceColor(0)).toBe('dimmed');
    });
});
