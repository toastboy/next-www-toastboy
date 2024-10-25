import { render, screen } from '@testing-library/react';
import NYI from 'components/NYI';
import { Wrapper, loaderClass } from "./lib/common";

describe('NYI', () => {
    it('renders correctly', () => {
        const { container } = render(<Wrapper><NYI /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("(Not yet implemented)")).toBeInTheDocument();
    });
});
