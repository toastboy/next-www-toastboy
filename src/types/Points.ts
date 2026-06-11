import z from 'zod';

/**
 * Valid points outcomes for a footy match: 0 = loss, 1 = draw, 3 = win.
 */
export const PointsSchema = z.union([z.literal(0), z.literal(1), z.literal(3)]);
export type PointsValue = z.infer<typeof PointsSchema>;

/**
 * Coercing variant for use at API / query-param boundaries where the value
 * arrives as a string. Converts to an integer first, then rejects anything
 * outside the valid set with a human-readable message.
 *
 * Empty strings are treated as absent (undefined) before coercion so that a
 * missing query param is rejected rather than silently coerced to 0 (loss).
 */
export const CoercedPointsSchema = z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.coerce.number().int()
        .refine((v): v is PointsValue => [0, 1, 3].includes(v), {
            message: 'points must be 0 (loss), 1 (draw), or 3 (win)',
        }),
);
