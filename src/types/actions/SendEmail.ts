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
 * @param to - Primary recipient email address.
 * @param cc - Optional CC recipients, comma-separated when multiple.
 * @param subject - Email subject line.
 * @param html - Sanitized HTML body content.
 */
export type SendEmailProxy = (
    to: string,
    cc: string,
    subject: string,
    html: string,
) => Promise<void>;
