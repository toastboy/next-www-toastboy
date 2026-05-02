import type { SendMailOptions } from 'nodemailer';

/**
 * Server action proxy type for the sendEmail action.
 * Enables dependency injection for components and stories without importing
 * the server-only action directly.
 *
 * @param mailOptions - Nodemailer mail options payload.
 */
export type SendEmailProxy = (mailOptions: SendMailOptions) => Promise<void>;
