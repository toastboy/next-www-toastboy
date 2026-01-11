import { z } from 'zod';

export const EnquirySchema = z.object({
    name: z.string().trim().min(1, { message: 'Name is required' }),
    email: z.preprocess(
        (value) => (typeof value === 'string' ? value.trim().toLowerCase() : value),
        z.string()
            .min(1, { message: 'Email is required' })
            .email({ message: 'Invalid email' }),
    ),
    message: z.string().trim().min(1, { message: 'Message is required' }),
});

export type EnquiryInput = z.infer<typeof EnquirySchema>;
