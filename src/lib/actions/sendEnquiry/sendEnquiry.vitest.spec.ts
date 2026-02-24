import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotFoundError } from '@/lib/errors';

const { createVerificationTokenMock, getPublicBaseUrlMock } = vi.hoisted(() => ({
    createVerificationTokenMock: vi.fn(() => ({
        token: 'enquiry-token',
        expiresAt: new Date('2030-01-01T00:00:00.000Z'),
    })),
    getPublicBaseUrlMock: vi.fn(() => 'https://example.test'),
}));

vi.mock('@/lib/verificationToken', () => ({
    createVerificationToken: createVerificationTokenMock,
}));

vi.mock('@/lib/urls', () => ({
    getPublicBaseUrl: getPublicBaseUrlMock,
}));

import { deliverContactEnquiryCore, sendEnquiryCore } from '@/lib/actions/sendEnquiry';

describe('sendEnquiryCore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('creates verification + enquiry and sends confirmation email', async () => {
        const deps = {
            contactEnquiryService: {
                create: vi.fn().mockResolvedValue(undefined),
                getByToken: vi.fn(),
                markDelivered: vi.fn(),
            },
            emailVerificationService: {
                create: vi.fn().mockResolvedValue(undefined),
                markUsed: vi.fn(),
            },
            sendEmailCore: vi.fn().mockResolvedValue(undefined),
        };

        await sendEnquiryCore(
            {
                name: 'Alex',
                email: 'alex@example.com',
                message: 'Need details',
            },
            '/footy/contact/thanks',
            deps,
        );

        expect(createVerificationTokenMock).toHaveBeenCalledTimes(1);
        expect(deps.emailVerificationService.create).toHaveBeenCalledWith({
            email: 'alex@example.com',
            token: 'enquiry-token',
            expiresAt: new Date('2030-01-01T00:00:00.000Z'),
        });
        expect(deps.contactEnquiryService.create).toHaveBeenCalledWith({
            name: 'Alex',
            email: 'alex@example.com',
            message: 'Need details',
            token: 'enquiry-token',
        });
        const [verificationEmailPayload] = vi.mocked(deps.sendEmailCore).mock.calls[0] as [{
            to: string;
            subject: string;
            html: string;
        }];
        expect(verificationEmailPayload.to).toBe('alex@example.com');
        expect(verificationEmailPayload.subject).toBe('Confirm your enquiry');
        expect(verificationEmailPayload.html).toContain(
            'https://example.test/api/footy/auth/verify/enquiry/enquiry-token?redirect=%2Ffooty%2Fcontact%2Fthanks',
        );
    });
});

describe('deliverContactEnquiryCore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('delivers enquiry message and marks records used', async () => {
        const deps = {
            contactEnquiryService: {
                create: vi.fn(),
                getByToken: vi.fn().mockResolvedValue({
                    id: 3,
                    name: 'Alex',
                    email: 'alex@example.com',
                    message: ' Line one \n\n Line two ',
                    deliveredAt: null,
                }),
                markDelivered: vi.fn().mockResolvedValue(undefined),
            },
            emailVerificationService: {
                create: vi.fn(),
                markUsed: vi.fn().mockResolvedValue(undefined),
            },
            sendEmailCore: vi.fn().mockResolvedValue(undefined),
        };

        const result = await deliverContactEnquiryCore('enquiry-token', deps);

        expect(result).toEqual({ enquiry: 'verified' });
        const [deliveryEmailPayload] = vi.mocked(deps.sendEmailCore).mock.calls[0] as [{
            to: string;
            subject: string;
            html: string;
        }];
        expect(deliveryEmailPayload.to).toBe('footy@toastboy.co.uk');
        expect(deliveryEmailPayload.subject).toBe('Enquiry from Alex');
        expect(deliveryEmailPayload.html).toContain('Line one<br />Line two');
        expect(deps.emailVerificationService.markUsed).toHaveBeenCalledWith('enquiry-token');
        expect(deps.contactEnquiryService.markDelivered).toHaveBeenCalledWith(3);
    });

    it('returns already-delivered without sending when enquiry was already processed', async () => {
        const deps = {
            contactEnquiryService: {
                create: vi.fn(),
                getByToken: vi.fn().mockResolvedValue({
                    id: 3,
                    deliveredAt: new Date('2029-01-01T00:00:00.000Z'),
                }),
                markDelivered: vi.fn(),
            },
            emailVerificationService: {
                create: vi.fn(),
                markUsed: vi.fn(),
            },
            sendEmailCore: vi.fn(),
        };

        const result = await deliverContactEnquiryCore('enquiry-token', deps);

        expect(result).toEqual({ enquiry: 'already-delivered' });
        expect(deps.sendEmailCore).not.toHaveBeenCalled();
        expect(deps.emailVerificationService.markUsed).not.toHaveBeenCalled();
        expect(deps.contactEnquiryService.markDelivered).not.toHaveBeenCalled();
    });

    it('throws NotFoundError when no enquiry exists for token', async () => {
        const deps = {
            contactEnquiryService: {
                create: vi.fn(),
                getByToken: vi.fn().mockResolvedValue(null),
                markDelivered: vi.fn(),
            },
            emailVerificationService: {
                create: vi.fn(),
                markUsed: vi.fn(),
            },
            sendEmailCore: vi.fn(),
        };

        await expect(deliverContactEnquiryCore('enquiry-token', deps))
            .rejects.toBeInstanceOf(NotFoundError);
        expect(deps.sendEmailCore).not.toHaveBeenCalled();
        expect(deps.emailVerificationService.markUsed).not.toHaveBeenCalled();
        expect(deps.contactEnquiryService.markDelivered).not.toHaveBeenCalled();
    });
});
