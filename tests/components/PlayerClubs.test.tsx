import { render, screen } from '@testing-library/react';
import PlayerClubs from 'components/PlayerClubs';
import { usePlayerClubs } from 'lib/swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

jest.mock('lib/swr');
jest.mock('components/ClubBadge', () => {
    const ClubBadge = ({ clubId }: { clubId: number }) => (
        <div>ClubBadge (clubId: {clubId})</div>
    );
    ClubBadge.displayName = 'ClubBadge';
    return ClubBadge;
});

describe('PlayerClubs', () => {
    const idOrLogin = "160";

    it('renders loading state', () => {
        (usePlayerClubs as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerClubs idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (usePlayerClubs as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerClubs idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (usePlayerClubs as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerClubs idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (usePlayerClubs as jest.Mock).mockReturnValue({
            data: [1000, 2000],
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerClubs idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("ClubBadge (clubId: 1000)")).toBeInTheDocument();
        expect(screen.getByText("ClubBadge (clubId: 2000)")).toBeInTheDocument();
    });
});
