import { render, screen } from '@testing-library/react';
import GameDay from 'components/GameDay';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { FootyTeam, useGameDay } from 'lib/swr';

jest.mock('lib/swr');
jest.mock('components/GameDayLink', () => {
    const GameDayLink = ({ id }: { id: number }) => (
        <div>GameDayLink (id: {id})</div>
    );
    GameDayLink.displayName = 'GameDayLink';
    return GameDayLink;
});
jest.mock('components/Team', () => {
    const Team = ({ gameDayId, team }: { gameDayId: number, team: FootyTeam }) => (
        <div>Team (gameDayId: {gameDayId}, team: {team})</div>
    );
    Team.displayName = 'Team';
    return Team;
});

describe('GameDay', () => {
    const id = 123;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state', () => {
        (useGameDay as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><GameDay id={id} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useGameDay as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><GameDay id={id} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (useGameDay as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><GameDay id={id} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    const gameData = {
        id: 123,
        year: 2001,
        date: new Date('2001-01-02'),
        game: true,
        mailSent: new Date('2001-01-01'),
        comment: null,
        bibs: 'A',
        picker_games_history: 10,
    };

    it('renders with data', () => {
        (useGameDay as jest.Mock).mockReturnValueOnce({
            data: {
                ...gameData,
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><GameDay id={id} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("Team (gameDayId: 123, team: A)")).toBeInTheDocument();
        expect(screen.getByText("vs.")).toBeInTheDocument();
        expect(screen.getByText("Team (gameDayId: 123, team: B)")).toBeInTheDocument();
    });

    it('renders with data + comment', () => {
        (useGameDay as jest.Mock).mockReturnValueOnce({
            data: {
                ...gameData,
                comment: "What a time to be alive",
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><GameDay id={id} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("(What a time to be alive)")).toBeInTheDocument();
    });

    it('renders with data (no game)', () => {
        (useGameDay as jest.Mock).mockReturnValueOnce({
            data: {
                ...gameData,
                comment: "Happy New Year",
                game: false,
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><GameDay id={id} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("No game (Happy New Year)")).toBeInTheDocument();
    });

    it('renders with data (no game, no comment)', () => {
        (useGameDay as jest.Mock).mockReturnValueOnce({
            data: {
                ...gameData,
                game: false,
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><GameDay id={id} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
    });
});
