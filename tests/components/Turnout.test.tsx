jest.mock('swr');

import { render, screen } from '@testing-library/react';
import Turnout from 'components/Turnout';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from './lib/common';

describe('Turnout', () => {
    it('renders loading state', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><Turnout /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><Turnout /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Turnout /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders table with data', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: [
                {
                    "year": 2023,
                    "gamesPlayed": 40,
                    "gamesCancelled": 1,
                    "responsesPerGameInitiated": 11.2,
                    "yessesPerGameInitiated": 10.3,
                    "playersPerGamePlayed": 10.1,
                },
                {
                    "year": 2022,
                    "gamesPlayed": 41,
                    "gamesCancelled": 0,
                    "responsesPerGameInitiated": 11.4,
                    "yessesPerGameInitiated": 10.1,
                    "playersPerGamePlayed": 9.9,
                },
                {
                    "year": 2021,
                    "gamesPlayed": 30,
                    "gamesCancelled": 11,
                    "responsesPerGameInitiated": 11.8,
                    "yessesPerGameInitiated": 9.6,
                    "playersPerGamePlayed": 8.8,
                },
            ],
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Turnout /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.queryByText(errorText)).not.toBeInTheDocument();
    });
});
