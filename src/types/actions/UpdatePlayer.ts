import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { z } from 'zod';

const emailListSchema = z.array(z.preprocess(
    (value: unknown) => {
        return typeof value === 'string' ? value.trim().toLowerCase() : value;
    },
    z.union([
        z.email({ message: 'Invalid email' }),
        z.literal(''),
    ]),
));

export const UpdatePlayerSchema = z.object({
    name: z.string()
        .min(1, { message: 'Name is required' }),
    anonymous: z.boolean().optional(),
    finished: z.preprocess(
        (value: unknown) => {
            if (value === '' || value === null || value === undefined) {
                return null;
            }
            if (typeof value === 'string') {
                return new Date(value);
            }
            return value;
        },
        z.date().nullish(),
    ),
    born: z.preprocess(
        (value: unknown) => {
            if (value === '' || value === null || value === undefined) {
                return null;
            }
            if (typeof value === 'string') {
                const parsed = Number(value);
                // If the string is not a valid number, return the original string
                // so that z.number() will fail validation explicitly.
                if (Number.isNaN(parsed)) {
                    return value;
                }
                return parsed;
            }
            return value;
        },
        z.number()
            .min(1900, { message: 'Year must be 1900 or later' })
            .max(new Date().getFullYear(), { message: 'Year cannot be in the future' })
            .optional()
            .nullable(),
    ),
    extraEmails: emailListSchema,
    addedExtraEmails: emailListSchema,
    removedExtraEmails: emailListSchema,
    countries: z.array(z.string()),
    clubs: z.array(z.preprocess(
        (value: unknown) => {
            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (trimmed === '') {
                    // Let z.number() fail validation for empty strings by returning the original value
                    return value;
                }
                return Number(trimmed);
            }
            return value;
        },
        z.number(),
    )),
    comment: z.string().optional(),
});

export type UpdatePlayerInput = z.infer<typeof UpdatePlayerSchema>;

/**
 * Server action proxy type for the updatePlayer action.
 * Allows components to accept a custom implementation without directly importing the real action,
 * making them testable and Storybook-friendly.
 *
 * @param playerId - The ID of the player to update
 * @param data - The update data conforming to UpdatePlayerInput
 * @returns Promise resolving to the updated player or undefined
 */
export type UpdatePlayerProxy = (
    playerId: number,
    data: UpdatePlayerInput,
) => Promise<PlayerType | undefined>;
