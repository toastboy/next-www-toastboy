import { z } from 'zod';

export const UpdatePlayerSchema = z.object({
    name: z.string()
        .min(1, { message: 'Name is required' }),
    born: z.preprocess(
        (value) => {
            if (value === '' || value === null || value === undefined) {
                return undefined;
            }
            return typeof value === 'string' ? Number(value) : value;
        },
        z.number()
            .min(1900, { message: 'Year must be 1900 or later' })
            .max(new Date().getFullYear(), { message: 'Year cannot be in the future' })
            .optional(),
    ),
    emails: z.array(z.preprocess(
        (value) => {
            return typeof value === 'string' ? value.trim().toLowerCase() : value;
        },
        z.union([
            z.email({ message: 'Invalid email' }),
            z.literal(''),
        ]),
    )),
    countries: z.array(z.string()),
    clubs: z.array(z.coerce.number()),
});

export type UpdatePlayerInput = z.infer<typeof UpdatePlayerSchema>;
