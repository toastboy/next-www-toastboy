import { z } from 'zod';

import type { AuthUserSummary } from '@/types/AuthUser';

/** Collapses a missing, empty, or whitespace-only string to `null`. */
const blankToNull = (value: string | null | undefined): string | null =>
    value && value.trim() !== '' ? value : null;

/**
 * Runtime schema that coerces an untrusted auth-user-shaped value — the user
 * Better Auth hands to lifecycle hooks, or a decoded session — into an
 * {@link AuthUserSummary}.
 *
 * Missing, empty, or whitespace-only `name`, `email` and `impersonatedBy`
 * become `null`, a missing `playerId` becomes `0`, and any role other than
 * `'admin'` collapses to `'user'` (mirroring the session mapping in
 * `getCurrentUser`). Unknown fields are dropped. A value that is not an
 * object, or one whose `playerId` is not a number, fails to parse — so callers
 * get a thrown error rather than a silently malformed summary.
 */
export const authUserSummarySchema = z
    .object({
        name: z.string().nullish(),
        email: z.string().nullish(),
        playerId: z.number().int().nullish(),
        role: z.string().nullish(),
        impersonatedBy: z.string().nullish(),
    })
    .transform((user): AuthUserSummary => ({
        name: blankToNull(user.name),
        email: blankToNull(user.email),
        playerId: user.playerId ?? 0,
        role: user.role === 'admin' ? 'admin' : 'user',
        impersonatedBy: blankToNull(user.impersonatedBy),
    }));

/**
 * Maps an untrusted auth-user-shaped value to an {@link AuthUserSummary} using
 * {@link authUserSummarySchema}, replacing unsafe `as unknown as
 * AuthUserSummary` casts in the auth flows.
 *
 * @throws {z.ZodError} When `user` is not an object or a field has the wrong
 * type (e.g. a non-numeric `playerId`).
 */
export function toAuthUserSummary(user: unknown): AuthUserSummary {
    return authUserSummarySchema.parse(user);
}
