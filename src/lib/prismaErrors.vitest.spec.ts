import { Prisma } from 'prisma/generated/client';
import { describe, expect, it } from 'vitest';

import { isPrismaNotFoundError } from '@/lib/prismaErrors';

describe('isPrismaNotFoundError', () => {
    it('returns true for a PrismaClientKnownRequestError with code P2025', () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            'Record not found',
            {
                code: 'P2025',
                clientVersion: '5.0.0',
            },
        );

        expect(isPrismaNotFoundError(error)).toBe(true);
    });

    it('returns false for a PrismaClientKnownRequestError with a different code', () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            'Unique constraint failed',
            {
                code: 'P2002',
                clientVersion: '5.0.0',
            },
        );

        expect(isPrismaNotFoundError(error)).toBe(false);
    });

    it('returns false for a plain Error', () => {
        expect(isPrismaNotFoundError(new Error('Record not found'))).toBe(
            false,
        );
    });

    it('returns false for null', () => {
        expect(isPrismaNotFoundError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
        expect(isPrismaNotFoundError(undefined)).toBe(false);
    });
});
