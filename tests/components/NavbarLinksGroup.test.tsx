import { render, screen } from '@testing-library/react';
import NYI from 'components/NYI';
import { Wrapper, errorText, loaderClass } from "./lib/common";
// import { useNYI } from 'lib/swr';

jest.mock('lib/swr');

describe('NYI', () => {
    it('renders loading state', () => {
        // (useNYI as jest.Mock).mockReturnValue({
        //     data: undefined,
        //     error: undefined,
        //     isLoading: true,
        // });

        const { container } = render(<Wrapper><NYI /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        // (useNYI as jest.Mock).mockReturnValue({
        //     data: undefined,
        //     error: new Error(errorText),
        //     isLoading: false,
        // });

        const { container } = render(<Wrapper><NYI /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        // (useNYI as jest.Mock).mockReturnValue({
        //     data: null,
        //     error: undefined,
        //     isLoading: false,
        // });

        const { container } = render(<Wrapper><NYI /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        // (useNYI as jest.Mock).mockReturnValue({
        //     data: [2001, 2002, 2003, 0],
        //     error: undefined,
        //     isLoading: false,
        // });

        const { container } = render(<Wrapper><NYI /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("NYI")).toBeInTheDocument();
    });
});
