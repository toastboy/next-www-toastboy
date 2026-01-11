import prisma from 'prisma/prisma';
import { ContactEnquiryType } from 'prisma/zod/schemas/models/ContactEnquiry.schema';

import contactEnquiryService from '@/services/ContactEnquiry';

describe('ContactEnquiryService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a contact enquiry from raw input', async () => {
            const rawInput = {
                name: 'Test User',
                email: 'test@example.com',
                message: 'Hello there',
                verificationId: 10,
            };
            const createdEnquiry: ContactEnquiryType = {
                ...rawInput,
                id: 1,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                verifiedAt: null,
                deliveredAt: null,
            };

            (prisma.contactEnquiry.create as jest.Mock).mockResolvedValueOnce(createdEnquiry);

            const result = await contactEnquiryService.create(rawInput);

            expect(prisma.contactEnquiry.create).toHaveBeenCalledWith({
                data: rawInput,
            });
            expect(result).toEqual(createdEnquiry);
        });

        it('should reject when the input data fails validation', async () => {
            const invalidInput = {
                name: '',
                email: 'invalid-email',
                message: '',
                verificationId: 0,
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
                verificationId: 22,
            };

            (prisma.contactEnquiry.findUnique as jest.Mock).mockResolvedValueOnce(enquiry);

            const result = await contactEnquiryService.getByVerificationId(22);

            expect(prisma.contactEnquiry.findUnique).toHaveBeenCalledWith({
                where: { verificationId: 22 },
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
                verificationId: 33,
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
