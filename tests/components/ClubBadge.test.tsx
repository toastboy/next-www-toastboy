jest.mock('swr');

import { render, screen } from '@testing-library/react';
import ClubBadge from 'components/ClubBadge';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

describe('ClubBadge', () => {
    const clubId = 4000;

    it('renders loading state', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><ClubBadge clubId={clubId} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><ClubBadge clubId={clubId} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><ClubBadge clubId={clubId} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: {
                id: 4000,
                club_name: "Nonsense Potters",
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><ClubBadge clubId={clubId} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByAltText("Nonsense Potters")).toHaveAttribute("src", "/api/footy/club/4000/badge");
    });
});
