import { APIRequestContext } from '@playwright/test';

export const MAILPIT_URL = 'http://localhost:8025';

export interface MailpitMessage {
    ID: string;
    Subject: string;
}

export interface MailpitMessageDetail {
    HTML?: string;
    Text?: string;
}

/**
 * Polls the Mailpit API until a message with the given subject arrives, then
 * returns its summary. Returns undefined if no match is found after all attempts.
 */
export async function waitForMessage(
    request: APIRequestContext,
    subject: string,
    { attempts = 30, intervalMs = 1000 }: { attempts?: number; intervalMs?: number } = {},
): Promise<MailpitMessage | undefined> {
    for (let i = 0; i < attempts; i++) {
        const res = await request.get(`${MAILPIT_URL}/api/v1/messages?limit=50`);
        const data = await res.json() as { messages?: MailpitMessage[] };
        const match = data.messages?.find((m) => m.Subject === subject);
        if (match) return match;
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    return undefined;
}

/**
 * Fetches full detail for a specific Mailpit message by ID.
 */
export async function getMessageDetail(
    request: APIRequestContext,
    id: string,
): Promise<MailpitMessageDetail> {
    const res = await request.get(`${MAILPIT_URL}/api/v1/message/${id}`);
    return res.json() as Promise<MailpitMessageDetail>;
}

/**
 * Deletes all messages from Mailpit.
 */
export async function deleteAllMessages(request: APIRequestContext): Promise<void> {
    await request.delete(`${MAILPIT_URL}/api/v1/messages`);
}
