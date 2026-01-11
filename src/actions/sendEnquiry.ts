'use server';

import { sendEmail } from '@/actions/sendEmail';
import { getPublicBaseUrl } from '@/lib/urls';
import { createVerificationToken } from '@/lib/verificationToken';
import contactEnquiryService from '@/services/ContactEnquiry';
import emailVerificationService from '@/services/EmailVerification';
import { EnquirySchema } from '@/types/EnquiryInput';

const ENQUIRY_RECIPIENT = 'footy@toastboy.co.uk';

const formatMessage = (message: string) => {
    const messageLines = message.split(/\r?\n/).map((line) => line.trim());
    return messageLines.filter(Boolean).join('<br />');
};

export async function sendEnquiry(rawData: unknown) {
    const data = EnquirySchema.parse(rawData);

    const { token, tokenHash, expiresAt } = createVerificationToken();
    const verification = await emailVerificationService.create({
        email: data.email,
        tokenHash,
        expiresAt,
        purpose: 'contact_form',
    });

    await contactEnquiryService.create({
        name: data.name,
        email: data.email,
        message: data.message,
        verificationId: verification.id,
    });

    const verificationLink = new URL(
        `/api/footy/auth/verify?token=${token}&target=contact`,
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

export async function deliverContactEnquiry(verificationId: number) {
    const enquiry = await contactEnquiryService.getByVerificationId(verificationId);

    if (!enquiry) {
        throw new Error('Enquiry not found for this verification.');
    }

    if (enquiry.deliveredAt) {
        return;
    }

    const formattedMessage = formatMessage(enquiry.message);
    const subject = `Enquiry from ${enquiry.name}`;

    const html = [
        '<p>New enquiry received:</p>',
        `<p><strong>Name:</strong> ${enquiry.name}</p>`,
        `<p><strong>Email:</strong> <a href="mailto:${enquiry.email}">${enquiry.email}</a></p>`,
        `<p><strong>Message:</strong><br />${formattedMessage || '-'}</p>`,
    ].join('');

    await sendEmail(ENQUIRY_RECIPIENT, '', subject, html);

    await contactEnquiryService.markDelivered(enquiry.id);
}
