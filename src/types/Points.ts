import z from 'zod';

/**
 * Valid points outcomes for a footy match: 0 = loss, 1 = draw, 3 = win.
 */
export const PointsSchema = z.union([z.literal(0), z.literal(1), z.literal(3)]);
export type PointsValue = z.infer<typeof PointsSchema>;
