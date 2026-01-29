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

/**
 * Server action proxy type for the sendEnquiry action.
 * Enables dependency injection for components and stories without importing
 * the server-only action directly.
 *
 * Validates enquiry data against EnquirySchema, creates and persists a
 * verification token with a pending contact enquiry, then sends a confirmation
 * email to the enquirer.
 *
 * @param data - Validated enquiry input including name, email, and message.
 * @param redirectUrl - URL to redirect to after email verification.
 */
export type SendEnquiryProxy = (
    data: EnquiryInput,
    redirectUrl: string,
) => Promise<void>;
