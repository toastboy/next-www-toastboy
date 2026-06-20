import { describe, expect, it } from 'vitest';

import { normalizeEmail } from './normalizeEmail';

describe('normalizeEmail', () => {
    it('trims leading and trailing whitespace', () => {
        expect(normalizeEmail(' alice@example.com ')).toBe('alice@example.com');
    });

    it('converts to lower case', () => {
        expect(normalizeEmail('Alice@EXAMPLE.COM')).toBe('alice@example.com');
    });

    it('trims and lowercases together', () => {
        expect(normalizeEmail('  Alice@Example.Com  ')).toBe('alice@example.com');
    });

    it('returns empty string for null', () => {
        expect(normalizeEmail(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
        expect(normalizeEmail(undefined)).toBe('');
    });

    it('returns empty string for whitespace-only input', () => {
        expect(normalizeEmail('   ')).toBe('');
    });

    it('leaves an already-normalised address unchanged', () => {
        expect(normalizeEmail('alice@example.com')).toBe('alice@example.com');
    });
});
