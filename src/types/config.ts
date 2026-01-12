import z from 'zod';

/**
 * Zod schema and typed configuration for application settings.
 */
export interface ConfigType {
    /** Minimum games required to qualify for the averages table. */
    minGamesForAveragesTable: number;
    /** Minimum replies required to qualify for the speedy table. */
    minRepliesForSpeedyTable: number;
    /** Destination address for contact enquiries. */
    contactEmailDestination: string;
    /** Session revalidation interval in milliseconds. */
    sessionRevalidate: number;
}

export const ConfigSchema: z.ZodType<ConfigType> = z.object({
    minGamesForAveragesTable: z.number().int().nonnegative(),
    minRepliesForSpeedyTable: z.number().int().nonnegative(),
    contactEmailDestination: z.email(),
    sessionRevalidate: z.number().int().nonnegative(),
});
