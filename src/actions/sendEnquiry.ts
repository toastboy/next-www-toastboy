'use server';

import { sendEmail } from '@/actions/sendEmail';
import config from '@/lib/config';
import { getPublicBaseUrl } from '@/lib/urls';
import { createVerificationToken } from '@/lib/verificationToken';
import contactEnquiryService from '@/services/ContactEnquiry';
import emailVerificationService from '@/services/EmailVerification';
import { EnquirySchema } from '@/types/EnquiryInput';

const formatMessage = (message: string) => {
    const messageLines = message.split(/\r?\n/).map((line) => line.trim());
    return messageLines.filter(Boolean).join('<br />');
};

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
    const { token, expiresAt } = createVerificationToken();

    await emailVerificationService.create({
        email: data.email,
        token,
        expiresAt,
    });

    await contactEnquiryService.create({
        name: data.name,
        email: data.email,
        message: data.message,
        token,
    });

    const verificationLink = new URL(
        `/api/footy/auth/verify/enquiry/${token}?redirect=${encodeURIComponent(redirectUrl)}`,
        getPublicBaseUrl(),
    ).toString();

    const html = [
        `<p>Hello ${data.name},</p>`,
        '<p>Please confirm your enquiry by clicking the link below:</p>',
        `<p><a href="${verificationLink}">Verify your email</a></p>`,
        '<p>We will send your message once this is confirmed.</p>',
        '<p>If you did not request this, you can ignore this message.</p>',
    ].join('');

    await sendEmail(data.email, '', 'Confirm your enquiry', html);
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
    const enquiry = await contactEnquiryService.getByToken(token);

    if (!enquiry) {
        throw new Error('Enquiry not found for this verification.');
    }

    if (enquiry.deliveredAt) {
        return { enquiry: 'already-delivered' };
    }

    const formattedMessage = formatMessage(enquiry.message);
    const subject = `Enquiry from ${enquiry.name}`;

    const html = [
        '<p>New enquiry received:</p>',
        `<p><strong>Name:</strong> ${enquiry.name}</p>`,
        `<p><strong>Email:</strong> <a href="mailto:${enquiry.email}">${enquiry.email}</a></p>`,
        `<p><strong>Message:</strong><br />${formattedMessage || '-'}</p>`,
    ].join('');

    await sendEmail(config.contactEmailDestination, '', subject, html);

    await emailVerificationService.markUsed(token);
    await contactEnquiryService.markDelivered(enquiry.id);

    return { enquiry: 'verified' };
}
