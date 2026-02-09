import type { SendMailOptions } from 'nodemailer';
import { z } from 'zod';

/**
 * Schema describing the payload for the sendEmail action.
 * Guarantees required fields are present before invoking the server action.
 */
export const SendEmailSchema = z.object({
    to: z.email({ message: 'Invalid recipient email' }),
    cc: z.string().optional().default(''),
    subject: z.string().min(1, { message: 'Subject is required' }),
    html: z.string().min(1, { message: 'Body is required' }),
});

/**
 * Input type inferred from the send email schema.
 */
export type SendEmailInput = z.infer<typeof SendEmailSchema>;

/**
 * Server action proxy type for the sendEmail action.
 * Enables dependency injection for components and stories without importing
 * the server-only action directly.
 *
 * @param mailOptions - Nodemailer mail options payload.
 */
export type SendEmailProxy = (mailOptions: SendMailOptions) => Promise<void>;
