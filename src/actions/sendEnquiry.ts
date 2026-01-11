'use server';

import { sendEmail } from '@/actions/sendEmail';
import { EnquirySchema } from '@/types/EnquiryInput';

const ENQUIRY_RECIPIENT = 'footy@toastboy.co.uk';

export async function sendEnquiry(rawData: unknown) {
    const data = EnquirySchema.parse(rawData);
    const messageLines = data.message.split(/\r?\n/).map((line) => line.trim());
    const formattedMessage = messageLines.filter(Boolean).join('<br />');
    const subject = `Enquiry from ${data.name}`;

    const html = [
        '<p>New enquiry received:</p>',
        `<p><strong>Name:</strong> ${data.name}</p>`,
        `<p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>`,
        `<p><strong>Message:</strong><br />${formattedMessage || '-'}</p>`,
    ].join('');

    await sendEmail(ENQUIRY_RECIPIENT, '', subject, html);
}
