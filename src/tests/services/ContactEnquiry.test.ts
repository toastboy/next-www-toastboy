import prisma from 'prisma/prisma';
import { ContactEnquiryType } from 'prisma/zod/schemas/models/ContactEnquiry.schema';

import { hashVerificationToken } from '@/lib/verificationToken';
import contactEnquiryService from '@/services/ContactEnquiry';

describe('ContactEnquiryService', () => {
    const token = 'deadbeef'.repeat(8);
    const tokenHash = hashVerificationToken(token);

    beforeEach(() => {
        jest.clearAllMocks();
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

            (prisma.contactEnquiry.create as jest.Mock).mockResolvedValueOnce(createdEnquiry);

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

            (prisma.contactEnquiry.findUnique as jest.Mock).mockResolvedValueOnce(enquiry);

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

            (prisma.contactEnquiry.update as jest.Mock).mockResolvedValueOnce(enquiry);

            const result = await contactEnquiryService.markDelivered(3);

            expect(prisma.contactEnquiry.update).toHaveBeenCalledWith({
                where: { id: 3 },
                data: {
                    verifiedAt: expect.any(Date),
                    deliveredAt: expect.any(Date),
                },
            });
            expect(result).toEqual(enquiry);
        });
    });
});
