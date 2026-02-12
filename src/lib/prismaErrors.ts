import { Prisma } from 'prisma/generated/client';

export const PRISMA_NOT_FOUND_CODE = 'P2025';

export const isPrismaKnownRequestError = (
    error: unknown,
): error is Prisma.PrismaClientKnownRequestError =>
    error instanceof Prisma.PrismaClientKnownRequestError;

export const isPrismaNotFoundError = (error: unknown): boolean =>
    isPrismaKnownRequestError(error) &&
    error.code === PRISMA_NOT_FOUND_CODE;
