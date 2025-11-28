import { z } from 'zod';

export const HealthResponseSchema = z.discriminatedUnion('status', [
    z.object({
        status: z.literal('healthy'),
        database: z.literal('connected'),
        error: z.string().optional(),
        timestamp: z.iso.datetime(),
    }),
    z.object({
        status: z.literal('unhealthy'),
        database: z.literal('disconnected'),
        error: z.string(),
        timestamp: z.iso.datetime(),
    }),
]);

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
