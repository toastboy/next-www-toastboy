import type { EnquiryInput } from '@/types/EnquiryInput';

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
