import { render, screen, waitFor } from '@testing-library/react';

import { EnquiryForm } from '@/components/EnquiryForm/EnquiryForm';

import { Wrapper } from './lib/common';

describe('EnquiryForm', () => {
    it('renders correctly', async () => {
        render(<Wrapper><EnquiryForm /></Wrapper>);
        await waitFor(() => {
            expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
            expect(screen.getByText("(Not yet implemented)")).toBeInTheDocument();
        });
    });
});
