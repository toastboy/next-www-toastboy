import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';

import { authUserSummarySchema, toAuthUserSummary } from '@/lib/authUser';

describe('toAuthUserSummary', () => {
    it('maps a well-formed Better Auth user to a summary', () => {
        expect(
            toAuthUserSummary({
                id: 'abc',
                name: 'Alex',
                email: 'alex@example.com',
                playerId: 42,
                role: 'admin',
                createdAt: new Date(),
            }),
        ).toEqual({
            name: 'Alex',
            email: 'alex@example.com',
            playerId: 42,
            role: 'admin',
            impersonatedBy: null,
        });
    });

    it('collapses any non-admin role to "user"', () => {
        expect(
            toAuthUserSummary({ playerId: 1, role: 'superadmin' }).role,
        ).toBe('user');
        expect(toAuthUserSummary({ playerId: 1 }).role).toBe('user');
    });

    it('defaults missing name, email and playerId to safe values', () => {
        expect(toAuthUserSummary({})).toEqual({
            name: null,
            email: null,
            playerId: 0,
            role: 'user',
            impersonatedBy: null,
        });
    });

    it('normalises empty and whitespace-only name, email and impersonatedBy to null', () => {
        expect(
            toAuthUserSummary({
                name: '',
                email: '   ',
                playerId: 3,
                impersonatedBy: '\t\n',
            }),
        ).toEqual({
            name: null,
            email: null,
            playerId: 3,
            role: 'user',
            impersonatedBy: null,
        });
    });

    it('keeps a non-blank name and email untouched', () => {
        expect(
            toAuthUserSummary({ name: 'Sam', email: 'sam@example.com' }),
        ).toMatchObject({ name: 'Sam', email: 'sam@example.com' });
    });

    it('passes impersonatedBy through when present', () => {
        expect(
            toAuthUserSummary({ playerId: 1, impersonatedBy: 'admin-id' })
                .impersonatedBy,
        ).toBe('admin-id');
    });

    it('drops unknown fields rather than copying them onto the summary', () => {
        const summary = toAuthUserSummary({
            playerId: 1,
            isAdmin: true,
            token: 'secret',
        });

        expect(summary).not.toHaveProperty('isAdmin');
        expect(summary).not.toHaveProperty('token');
        expect(Object.keys(summary).sort()).toEqual([
            'email',
            'impersonatedBy',
            'name',
            'playerId',
            'role',
        ]);
    });

    it.each([
        ['a string', 'not-an-object'],
        ['null', null],
        ['a non-numeric playerId', { playerId: '42' }],
    ])('throws a ZodError for %s', (_label, value) => {
        expect(() => toAuthUserSummary(value)).toThrow(ZodError);
    });

    it('exposes the schema for reuse via safeParse', () => {
        const result = authUserSummarySchema.safeParse({ playerId: 7 });

        expect(result.success).toBe(true);
        expect(result.data).toMatchObject({ playerId: 7, role: 'user' });
    });
});
