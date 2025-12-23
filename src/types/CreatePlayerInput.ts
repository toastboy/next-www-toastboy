import { z } from 'zod';

export const CreatePlayerSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email' }),
    introducedBy: z.string(),
});

export type CreatePlayerInput = z.infer<typeof CreatePlayerSchema>;
