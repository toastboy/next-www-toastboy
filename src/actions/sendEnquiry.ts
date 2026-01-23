'use server';

import { deliverContactEnquiryCore, sendEnquiryCore } from '@/lib/actions/sendEnquiry';
import { EnquirySchema } from '@/types/EnquiryInput';

/**
 * Validate and initiate an enquiry verification flow.
 *
 * Validates the provided rawData against EnquirySchema, creates a verification
 * token, persists an email verification record and a pending contact enquiry
 * tied to that token, constructs a verification URL (including the provided
 * redirectUrl as a URL-encoded `redirect` query parameter), and sends a
 * confirmation email containing the link.
 *
 * @param rawData - Unvalidated enquiry payload. Expected to match the shape
 * enforced by EnquirySchema; parsing will throw if invalid.
 * @param redirectUrl - Destination URL to redirect the user to after successful
 * verification; will be URL-encoded and appended to the verification endpoint.
 * @returns A Promise that resolves once the verification record and contact
 * enquiry are stored and the confirmation email has been sent.
 * @throws {ZodError|Error} If validation (EnquirySchema.parse) fails.
 * @throws {Error} If token creation, persistence via
 * emailVerificationService/contactEnquiryService, or sending the email fails.
 * @remarks
 * - Side effects: persists records via emailVerificationService.create and
 *   contactEnquiryService.create, and sends an email via sendEmail.
 * - The verification link targets:
 *   `${getPublicBaseUrl()}/api/footy/auth/verify/enquiry/{token}?redirect={encodedRedirectUrl}`.
 */
export async function sendEnquiry(rawData: unknown, redirectUrl: string) {
    const data = EnquirySchema.parse(rawData);
    await sendEnquiryCore(data, redirectUrl);
}

/**
 * Deliver a contact enquiry identified by a verification token.
 *
 * Looks up the enquiry by token and throws if none is found. If the enquiry has
 * already been delivered (deliveredAt is set) the function resolves with `{
 * enquiry: 'already-delivered' }` and performs no further actions. Otherwise,
 * it formats the enquiry message, builds an HTML email (subject includes the
 * enquirer's name), sends the email to the configured recipient, marks the
 * verification token as used, and marks the enquiry as delivered.
 *
 * @param token - The verification token associated with the contact enquiry.
 * @returns A promise that resolves to `{ enquiry: 'already-delivered' }` if the
 *          enquiry was already delivered, or `{ enquiry: 'verified' }` after
 *          successful delivery and updates.
 * @throws {Error} If no enquiry is found for the provided token.
 */
export async function deliverContactEnquiry(token: string) {
    return await deliverContactEnquiryCore(token);
}
