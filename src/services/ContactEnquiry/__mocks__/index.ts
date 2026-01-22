import { vi } from 'vitest';

const contactEnquiryService = {
    create: vi.fn(),
    getByToken: vi.fn(),
    markDelivered: vi.fn(),
};

export default contactEnquiryService;
