import { render, screen } from '@testing-library/react';
import EnquiryForm from 'components/EnquiryForm';
import { Wrapper, loaderClass } from "./lib/common";

describe('EnquiryForm', () => {
    it('renders correctly', () => {
        const { container } = render(<Wrapper><EnquiryForm /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("(Not yet implemented)")).toBeInTheDocument();
    });
});
