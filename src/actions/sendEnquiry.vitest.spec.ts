import { beforeEach, describe, expect, it, vi } from 'vitest';

const { sendEnquiryCoreMock, deliverContactEnquiryCoreMock } = vi.hoisted(() => ({
    sendEnquiryCoreMock: vi.fn().mockResolvedValue(undefined),
    deliverContactEnquiryCoreMock: vi.fn(),
}));

vi.mock('@/lib/core/sendEnquiry', () => ({
    sendEnquiryCore: sendEnquiryCoreMock,
    deliverContactEnquiryCore: deliverContactEnquiryCoreMock,
}));

import { deliverContactEnquiry, sendEnquiry } from '@/actions/sendEnquiry';

const validInput = {
    name: 'Alice',
    email: 'alice@example.com',
    message: 'Interested in joining the league.',
};

describe('sendEnquiry action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('validates input and delegates to sendEnquiryCore with the redirect URL', async () => {
        await sendEnquiry(validInput, '/footy/enquiry/thanks');

        expect(sendEnquiryCoreMock).toHaveBeenCalledWith(validInput, '/footy/enquiry/thanks');
    });

    it('propagates ZodError when input validation fails', async () => {
        await expect(sendEnquiry({ ...validInput, name: '' }, '/footy/enquiry/thanks')).rejects.toThrow();
        expect(sendEnquiryCoreMock).not.toHaveBeenCalled();
    });

    it('propagates errors from sendEnquiryCore', async () => {
        const coreError = new Error('failed to persist enquiry');
        sendEnquiryCoreMock.mockRejectedValueOnce(coreError);

        await expect(sendEnquiry(validInput, '/footy/enquiry/thanks')).rejects.toBe(coreError);
    });
});

describe('deliverContactEnquiry action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('delegates to deliverContactEnquiryCore with the token', async () => {
        await deliverContactEnquiry('token-abc');

        expect(deliverContactEnquiryCoreMock).toHaveBeenCalledWith('token-abc');
    });

    it('returns the result from deliverContactEnquiryCore', async () => {
        deliverContactEnquiryCoreMock.mockResolvedValueOnce({ enquiry: 'verified' });

        const result = await deliverContactEnquiry('token-abc');

        expect(result).toEqual({ enquiry: 'verified' });
    });

    it('propagates errors from deliverContactEnquiryCore', async () => {
        const coreError = new Error('enquiry not found');
        deliverContactEnquiryCoreMock.mockRejectedValueOnce(coreError);

        await expect(deliverContactEnquiry('bad-token')).rejects.toBe(coreError);
    });
});
