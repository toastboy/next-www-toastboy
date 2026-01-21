import prisma from 'prisma/prisma';
import { ContactEnquiryType } from 'prisma/zod/schemas/models/ContactEnquiry.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { hashVerificationToken } from '@/lib/verificationToken';
import contactEnquiryService from '@/services/ContactEnquiry';


describe('ContactEnquiryService', () => {
    const token = 'deadbeef'.repeat(8);
    const tokenHash = hashVerificationToken(token);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('create', () => {
        it('should create a contact enquiry from raw input', async () => {
            const rawInput = {
                name: 'Test User',
                email: 'test@example.com',
                message: 'Hello there',
                token,
            };
            const expectedData = {
                name: rawInput.name,
                email: rawInput.email,
                message: rawInput.message,
                tokenHash,
            };
            const createdEnquiry: ContactEnquiryType = {
                ...expectedData,
                id: 1,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                verifiedAt: null,
                deliveredAt: null,
            };

            (prisma.contactEnquiry.create as Mock).mockResolvedValueOnce(createdEnquiry);

            const result = await contactEnquiryService.create(rawInput);

            expect(prisma.contactEnquiry.create).toHaveBeenCalledWith({
                data: expectedData,
            });
            expect(result).toEqual(createdEnquiry);
        });

        it('should reject when the input data fails validation', async () => {
            const invalidInput = {
                name: '',
                email: 'invalid-email',
                message: '',
                token: '',
            };

            await expect(contactEnquiryService.create(invalidInput)).rejects.toThrow();
            expect(prisma.contactEnquiry.create).not.toHaveBeenCalled();
        });

        it('should reject when tokenHash is provided', async () => {
            const invalidInput = {
                name: 'Test User',
                email: 'test@example.com',
                message: 'Hello there',
                token,
                tokenHash,
            };

            await expect(contactEnquiryService.create(invalidInput)).rejects.toThrow();
            expect(prisma.contactEnquiry.create).not.toHaveBeenCalled();
        });
    });

    describe('getByVerificationId', () => {
        it('should retrieve a contact enquiry by verification id', async () => {
            const enquiry: ContactEnquiryType = {
                id: 2,
                name: 'Test User',
                email: 'test@example.com',
                message: 'Hello there',
                createdAt: new Date(),
                verifiedAt: null,
                deliveredAt: null,
                tokenHash,
            };

            (prisma.contactEnquiry.findUnique as Mock).mockResolvedValueOnce(enquiry);

            const result = await contactEnquiryService.getByToken(token);
            expect(prisma.contactEnquiry.findUnique).toHaveBeenCalledWith({
                where: { tokenHash },
            });
            expect(result).toEqual(enquiry);
        });
    });

    describe('markDelivered', () => {
        it('should mark a contact enquiry as delivered', async () => {
            const enquiry: ContactEnquiryType = {
                id: 3,
                name: 'Test User',
                email: 'test@example.com',
                message: 'Hello there',
                createdAt: new Date(),
                verifiedAt: new Date(),
                deliveredAt: new Date(),
                tokenHash,
            };

            (prisma.contactEnquiry.update as Mock).mockResolvedValueOnce(enquiry);

            const result = await contactEnquiryService.markDelivered(3);

            expect(prisma.contactEnquiry.update).toHaveBeenCalledTimes(1);
            const [call] = (prisma.contactEnquiry.update as Mock).mock.calls;
            const callArgs = call[0] as { where: { id: number }; data: { verifiedAt: Date; deliveredAt: Date } };
            expect(callArgs).toMatchObject({
                where: { id: 3 },
                data: {},
            });
            expect(callArgs.data.verifiedAt).toBeInstanceOf(Date);
            expect(callArgs.data.deliveredAt).toBeInstanceOf(Date);
            expect(result).toEqual(enquiry);
        });
    });
});
