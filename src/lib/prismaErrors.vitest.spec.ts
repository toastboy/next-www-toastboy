import { Prisma } from 'prisma/generated/client';
import { describe, expect, it } from 'vitest';

import { isPrismaNotFoundError } from '@/lib/prismaErrors';

describe('isPrismaNotFoundError', () => {
    it('returns true for a PrismaClientKnownRequestError with code P2025', () => {
        const error = new Prisma.PrismaClientKnownRequestError('Record not found', {
            code: 'P2025',
            clientVersion: '5.0.0',
        });

        expect(isPrismaNotFoundError(error)).toBe(true);
    });

    it.todo('returns false for a PrismaClientKnownRequestError with a different code');
    it.todo('returns false for a plain Error');
    it.todo('returns false for null');
    it.todo('returns false for undefined');
});
