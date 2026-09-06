import { beforeEach, describe, expect, it, vi } from 'vitest';

const { coreSendEnquiryMock, coreDeliverContactEnquiryMock } = vi.hoisted(
    () => ({
        coreSendEnquiryMock: vi.fn().mockResolvedValue(undefined),
        coreDeliverContactEnquiryMock: vi.fn(),
    }),
);

vi.mock('@/lib/core/sendEnquiry', () => ({
    coreSendEnquiry: coreSendEnquiryMock,
    coreDeliverContactEnquiry: coreDeliverContactEnquiryMock,
}));

import { deliverContactEnquiry, sendEnquiry } from '@/actions/sendEnquiry';

const validInput = {
    name: 'Alice',
    email: 'alice@example.com',
    message: 'Interested in joining the league.',
};

describe('sendEnquiry action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('validates input and delegates to coreSendEnquiry', async () => {
        await sendEnquiry(validInput);

        expect(coreSendEnquiryMock).toHaveBeenCalledWith(validInput);
    });

    it('propagates ZodError when input validation fails', async () => {
        await expect(
            sendEnquiry({ ...validInput, name: '' }),
        ).rejects.toThrow();
        expect(coreSendEnquiryMock).not.toHaveBeenCalled();
    });

    it('propagates errors from coreSendEnquiry', async () => {
        const coreError = new Error('failed to persist enquiry');
        coreSendEnquiryMock.mockRejectedValueOnce(coreError);

        await expect(sendEnquiry(validInput)).rejects.toBe(coreError);
    });
});

describe('deliverContactEnquiry action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('delegates to coreDeliverContactEnquiry with the token', async () => {
        await deliverContactEnquiry('token-abc');

        expect(coreDeliverContactEnquiryMock).toHaveBeenCalledWith('token-abc');
    });

    it('returns the result from coreDeliverContactEnquiry', async () => {
        coreDeliverContactEnquiryMock.mockResolvedValueOnce({
            enquiry: 'verified',
        });

        const result = await deliverContactEnquiry('token-abc');

        expect(result).toEqual({ enquiry: 'verified' });
    });

    it('propagates errors from coreDeliverContactEnquiry', async () => {
        const coreError = new Error('enquiry not found');
        coreDeliverContactEnquiryMock.mockRejectedValueOnce(coreError);

        await expect(deliverContactEnquiry('bad-token')).rejects.toBe(
            coreError,
        );
    });
});
