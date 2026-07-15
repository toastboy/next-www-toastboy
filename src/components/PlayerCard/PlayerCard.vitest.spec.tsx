import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { PlayerCard } from '@/components/PlayerCard/PlayerCard';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultClubSupporterDataList } from '@/tests/mocks/data/clubSupporterData';
import { defaultCountrySupporterDataList } from '@/tests/mocks/data/countrySupporterData';
import { createMockPlayer, defaultPlayer } from '@/tests/mocks/data/player';
import { defaultTrophiesList } from '@/tests/mocks/data/playerRecord';

vi.mock('@/components/PlayerClubs/PlayerClubs');
vi.mock('@/components/PlayerCountries/PlayerCountries');
vi.mock('@/components/PlayerMugshot/PlayerMugshot');
vi.mock('@/components/PlayerTrophies/PlayerTrophies');

describe('PlayerCard', () => {
    const defaultProps = {
        player: defaultPlayer,
        clubs: defaultClubSupporterDataList,
        countries: defaultCountrySupporterDataList,
        trophies: defaultTrophiesList,
    };

    it('renders PlayerMugshot', () => {
        render(
            <Wrapper>
                <PlayerCard {...defaultProps} />
            </Wrapper>,
        );

        expect(screen.getByText(/PlayerMugshot:/)).toBeInTheDocument();
    });

    it('renders PlayerTrophies', () => {
        render(
            <Wrapper>
                <PlayerCard {...defaultProps} />
            </Wrapper>,
        );

        expect(screen.getByText(/PlayerTrophies:/)).toBeInTheDocument();
    });

    it('renders PlayerClubs', () => {
        render(
            <Wrapper>
                <PlayerCard {...defaultProps} />
            </Wrapper>,
        );

        expect(screen.getByText(/PlayerClubs:/)).toBeInTheDocument();
    });

    it('renders PlayerCountries', () => {
        render(
            <Wrapper>
                <PlayerCard {...defaultProps} />
            </Wrapper>,
        );

        expect(screen.getByText(/PlayerCountries:/)).toBeInTheDocument();
    });

    it('reveals the trophies, clubs and countries overlays once the mugshot is ready', () => {
        render(
            <Wrapper>
                <PlayerCard {...defaultProps} />
            </Wrapper>,
        );

        const trophies = screen.getByText(/PlayerTrophies:/).closest('div[style]');
        const clubs = screen.getByText(/PlayerClubs:/).closest('div[style]');
        const countries = screen.getByText(/PlayerCountries:/).closest('div[style]');
        expect(trophies).toHaveStyle({ opacity: '0', pointerEvents: 'none' });
        expect(trophies).toHaveAttribute('aria-hidden', 'true');
        expect(trophies).toHaveAttribute('inert', '');
        expect(clubs).toHaveStyle({ opacity: '0', pointerEvents: 'none' });
        expect(clubs).toHaveAttribute('aria-hidden', 'true');
        expect(clubs).toHaveAttribute('inert', '');
        expect(countries).toHaveStyle({ opacity: '0', pointerEvents: 'none' });
        expect(countries).toHaveAttribute('aria-hidden', 'true');
        expect(countries).toHaveAttribute('inert', '');

        fireEvent.click(screen.getByRole('button', { name: /Mark PlayerMugshot ready/i }));

        expect(trophies).toHaveStyle({ opacity: '1', pointerEvents: 'auto' });
        expect(trophies).toHaveAttribute('aria-hidden', 'false');
        expect(trophies).not.toHaveAttribute('inert');
        expect(clubs).toHaveStyle({ opacity: '1', pointerEvents: 'auto' });
        expect(clubs).toHaveAttribute('aria-hidden', 'false');
        expect(clubs).not.toHaveAttribute('inert');
        expect(countries).toHaveStyle({ opacity: '1', pointerEvents: 'auto' });
        expect(countries).toHaveAttribute('aria-hidden', 'false');
        expect(countries).not.toHaveAttribute('inert');
    });

    it('re-hides the overlays if reused for a different player', () => {
        const { rerender } = render(
            <Wrapper>
                <PlayerCard {...defaultProps} />
            </Wrapper>,
        );

        fireEvent.click(screen.getByRole('button', { name: /Mark PlayerMugshot ready/i }));
        expect(screen.getByText(/PlayerTrophies:/).closest('div[style]')).toHaveStyle({ opacity: '1' });

        const otherPlayer = createMockPlayer({ id: defaultPlayer.id + 1 });
        rerender(
            <Wrapper>
                <PlayerCard {...defaultProps} player={otherPlayer} />
            </Wrapper>,
        );

        const trophies = screen.getByText(/PlayerTrophies:/).closest('div[style]');
        expect(trophies).toHaveStyle({ opacity: '0', pointerEvents: 'none' });
        expect(trophies).toHaveAttribute('aria-hidden', 'true');
        expect(trophies).toHaveAttribute('inert', '');
    });
});
