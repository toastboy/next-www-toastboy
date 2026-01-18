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
    /** Notification auto close interval in milliseconds. */
    notificationAutoClose: number;
    /** Icon size for notifications. */
    notificationIconSize: number;
    /** Organiser's phone number for contact. */
    organiserPhoneNumber: string;
}

export const ConfigSchema: z.ZodType<ConfigType> = z.object({
    minGamesForAveragesTable: z.number().int().nonnegative(),
    minRepliesForSpeedyTable: z.number().int().nonnegative(),
    contactEmailDestination: z.email(),
    sessionRevalidate: z.number().int().nonnegative(),
    notificationAutoClose: z.number().int().nonnegative(),
    notificationIconSize: z.number().int().nonnegative(),
    organiserPhoneNumber: z.string().min(1),
});
