import 'server-only';

import { sendEmailCore } from '@/lib/actions/sendEmail';
import { config } from '@/lib/config';
import { getPublicBaseUrl } from '@/lib/urls';
import { createVerificationToken } from '@/lib/verificationToken';
import contactEnquiryService from '@/services/ContactEnquiry';
import emailVerificationService from '@/services/EmailVerification';
import type { EnquiryInput } from '@/types/EnquiryInput';

interface SendEnquiryDeps {
    contactEnquiryService: Pick<typeof contactEnquiryService, 'create' | 'getByToken' | 'markDelivered'>;
    emailVerificationService: Pick<typeof emailVerificationService, 'create' | 'markUsed'>;
    sendEmailCore: typeof sendEmailCore;
}

const defaultDeps: SendEnquiryDeps = {
    contactEnquiryService,
    emailVerificationService,
    sendEmailCore,
};

const formatMessage = (message: string) => {
    const messageLines = message.split(/\r?\n/).map((line) => line.trim());
    return messageLines.filter(Boolean).join('<br />');
};

/**
 * Handles the core logic for sending an enquiry and initiating email
 * verification.
 *
 * This function performs the following steps:
 * 1. Generates a verification token and expiration time.
 * 2. Stores the verification token associated with the user's email.
 * 3. Creates a contact enquiry record with the provided details and token.
 * 4. Constructs a verification link for the user to confirm their enquiry.
 * 5. Sends a verification email to the user with the confirmation link.
 *
 * @param data - The enquiry input containing the user's name, email, and
 * message.
 * @param redirectUrl - The URL to redirect the user to after successful
 * verification.
 * @param deps - Optional dependencies for email verification, contact enquiry,
 * and email sending services. Defaults to `defaultDeps`.
 *
 * @returns A promise that resolves when all operations are complete.
 */
export async function sendEnquiryCore(
    data: EnquiryInput,
    redirectUrl: string,
    deps: SendEnquiryDeps = defaultDeps,
) {
    const { token, expiresAt } = createVerificationToken();

    await deps.emailVerificationService.create({
        email: data.email,
        token,
        expiresAt,
    });

    await deps.contactEnquiryService.create({
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

    await deps.sendEmailCore(data.email, '', 'Confirm your enquiry', html);
}

/**
 * Delivers a contact enquiry by sending an email with the enquiry details and
 * marking the enquiry as delivered.
 *
 * @param token - The unique token identifying the contact enquiry.
 * @param deps - Optional dependencies required for delivering the enquiry.
 * Defaults to `defaultDeps`.
 * @returns An object indicating the result of the operation:
 *   - `{ enquiry: 'already-delivered' }` if the enquiry has already been
 *     delivered.
 *   - `{ enquiry: 'verified' }` if the enquiry was successfully delivered and
 *     verified.
 * @throws If the enquiry cannot be found for the provided token.
 */
export async function deliverContactEnquiryCore(
    token: string,
    deps: SendEnquiryDeps = defaultDeps,
) {
    const enquiry = await deps.contactEnquiryService.getByToken(token);

    if (!enquiry) {
        throw new Error('Enquiry not found for this verification.');
    }

    if (enquiry.deliveredAt) {
        return { enquiry: 'already-delivered' } as const;
    }

    const formattedMessage = formatMessage(enquiry.message);
    const subject = `Enquiry from ${enquiry.name}`;

    const html = [
        '<p>New enquiry received:</p>',
        `<p><strong>Name:</strong> ${enquiry.name}</p>`,
        `<p><strong>Email:</strong> <a href="mailto:${enquiry.email}">${enquiry.email}</a></p>`,
        `<p><strong>Message:</strong><br />${formattedMessage || '-'}</p>`,
    ].join('');

    await deps.sendEmailCore(config.contactEmailDestination, '', subject, html);

    await deps.emailVerificationService.markUsed(token);
    await deps.contactEnquiryService.markDelivered(enquiry.id);

    return { enquiry: 'verified' } as const;
}
