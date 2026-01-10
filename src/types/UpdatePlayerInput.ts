import { z } from 'zod';

const emailList = z.array(z.preprocess(
    (value) => {
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
    born: z.preprocess(
        (value) => {
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
    extraEmails: emailList,
    addedExtraEmails: emailList,
    removedExtraEmails: emailList,
    countries: z.array(z.string()),
    clubs: z.array(z.preprocess(
        (value) => {
            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (trimmed === '') {
                    // Let z.number() fail validation for empty strings
                    return NaN;
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
