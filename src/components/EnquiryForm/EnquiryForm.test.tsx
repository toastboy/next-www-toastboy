import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { sendEnquiry } from '@/actions/sendEnquiry';
import { EnquiryForm } from '@/components/EnquiryForm/EnquiryForm';

import { Wrapper } from '@/tests/components/lib/common';

jest.mock('@/actions/sendEnquiry', () => ({
    sendEnquiry: jest.fn(),
}));

const mockSendEnquiry = sendEnquiry as jest.MockedFunction<typeof sendEnquiry>;

describe('EnquiryForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSendEnquiry.mockResolvedValue(undefined);
    });

    it('renders the form fields', async () => {
        render(<Wrapper><EnquiryForm redirectUrl='redirect-url' /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByTestId('enquiry-name')).toBeInTheDocument();
            expect(screen.getByTestId('enquiry-email')).toBeInTheDocument();
            expect(screen.getByTestId('enquiry-message')).toBeInTheDocument();
            expect(screen.getByTestId('enquiry-submit')).toBeInTheDocument();
        });
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        render(<Wrapper><EnquiryForm redirectUrl='redirect-url' /></Wrapper>);

        await user.click(screen.getByTestId('enquiry-submit'));

        expect(await screen.findByText('Name is required')).toBeInTheDocument();
        expect(await screen.findByText('Invalid email')).toBeInTheDocument();
        expect(await screen.findByText('Message is required')).toBeInTheDocument();
    });

    it('submits valid data', async () => {
        const user = userEvent.setup();
        render(<Wrapper><EnquiryForm redirectUrl='redirect-url' /></Wrapper>);

        await user.type(screen.getByTestId('enquiry-name'), 'Test User');
        await user.type(screen.getByTestId('enquiry-email'), 'test@example.com');
        await user.type(screen.getByTestId('enquiry-message'), 'Hello there');
        await user.click(screen.getByTestId('enquiry-submit'));

        await waitFor(() => {
            expect(mockSendEnquiry).toHaveBeenCalledWith({
                name: 'Test User',
                email: 'test@example.com',
                message: 'Hello there',
            }, 'redirect-url');
        });
    });
});
