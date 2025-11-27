import { render, screen, waitFor } from '@testing-library/react';
import EnquiryForm from 'components/EnquiryForm/EnquiryForm';

import { loaderClass,Wrapper } from "./lib/common";

describe('EnquiryForm', () => {
    it('renders correctly', async () => {
        const { container } = render(<Wrapper><EnquiryForm /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("(Not yet implemented)")).toBeInTheDocument();
        });
    });
});
