import { render, screen } from '@testing-library/react';

import NYI from '@/components/NYI/NYI';

import { Wrapper } from "./lib/common";

describe('NYI', () => {
    it('renders correctly', () => {
        render(<Wrapper><NYI /></Wrapper>);
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        expect(screen.getByText("(Not yet implemented)")).toBeInTheDocument();
    });
});
