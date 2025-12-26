import { z } from 'zod';

export const CreatePlayerSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.preprocess(
        (value) => {

            return typeof value === 'string' ? value.trim().toLowerCase() : value;
        },
        z.union([
            z.email({ message: 'Invalid email' }),
            z.literal(''),
        ]),
    ),
    introducedBy: z.string(),
});

export type CreatePlayerInput = z.infer<typeof CreatePlayerSchema>;
