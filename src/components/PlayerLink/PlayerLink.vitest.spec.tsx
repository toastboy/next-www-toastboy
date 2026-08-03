import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayer } from '@/tests/mocks/data/player';
import { theme } from '@/theme';

describe('PlayerLink', () => {
    describe('format="name" (default)', () => {
        it('renders link to player page', () => {
            render(
                <Wrapper>
                    <PlayerLink player={defaultPlayer} year={2024} />
                </Wrapper>,
            );

            const link = screen.getByRole('link', { name: defaultPlayer.name });
            expect(link).toHaveAttribute('href', `/footy/player/${defaultPlayer.id}/2024`);
        });

        it('renders link without year when year is 0', () => {
            render(
                <Wrapper>
                    <PlayerLink player={defaultPlayer} year={0} />
                </Wrapper>,
            );

            const link = screen.getByRole('link', { name: defaultPlayer.name });
            expect(link).toHaveAttribute('href', `/footy/player/${defaultPlayer.id}`);
        });

        it('uses the single-line min-width by default', () => {
            render(
                <Wrapper>
                    <PlayerLink player={defaultPlayer} year={2024} />
                </Wrapper>,
            );

            const link = screen.getByRole<HTMLAnchorElement>('link', { name: defaultPlayer.name });
            expect(link.style.minWidth).toBe(theme.other?.playerNameMinWidthSingleLine);
        });

        it('uses the multi-line min-width when wrap is enabled', () => {
            render(
                <Wrapper>
                    <PlayerLink player={defaultPlayer} year={2024} wrap />
                </Wrapper>,
            );

            const link = screen.getByRole<HTMLAnchorElement>('link', { name: defaultPlayer.name });
            expect(link).toHaveAttribute('href', `/footy/player/${defaultPlayer.id}/2024`);
            expect(link.style.minWidth).toBe(theme.other?.playerNameMinWidthMultiLine);
        });
    });

    describe('format="left-arrow"', () => {
        it('renders a labelled icon link to the player page', () => {
            render(
                <Wrapper>
                    <PlayerLink player={defaultPlayer} year={2024} format="left-arrow" />
                </Wrapper>,
            );

            const link = screen.getByRole('link', {
                name: `Previous player: ${defaultPlayer.name}`,
            });
            expect(link).toHaveAttribute('href', `/footy/player/${defaultPlayer.id}/2024`);
        });

        it('shows a tooltip with the player name on hover', async () => {
            render(
                <Wrapper>
                    <PlayerLink player={defaultPlayer} year={2024} format="left-arrow" />
                </Wrapper>,
            );

            fireEvent.mouseEnter(screen.getByRole('link', { name: `Previous player: ${defaultPlayer.name}` }));

            await waitFor(() => {
                expect(screen.getByRole('tooltip')).toHaveTextContent(defaultPlayer.name);
            });
        });
    });

    describe('format="right-arrow"', () => {
        it('renders a labelled icon link to the player page', () => {
            render(
                <Wrapper>
                    <PlayerLink player={defaultPlayer} year={2024} format="right-arrow" />
                </Wrapper>,
            );

            const link = screen.getByRole('link', { name: `Next player: ${defaultPlayer.name}` });
            expect(link).toHaveAttribute('href', `/footy/player/${defaultPlayer.id}/2024`);
        });

        it('shows a tooltip with the player name on hover', async () => {
            render(
                <Wrapper>
                    <PlayerLink player={defaultPlayer} year={2024} format="right-arrow" />
                </Wrapper>,
            );

            fireEvent.mouseEnter(screen.getByRole('link', { name: `Next player: ${defaultPlayer.name}` }));

            await waitFor(() => {
                expect(screen.getByRole('tooltip')).toHaveTextContent(defaultPlayer.name);
            });
        });
    });

    describe('null player name fallback', () => {
        it('uses "Unknown" in left-arrow aria-label when player name is null', () => {
            const namelessPlayer = { ...defaultPlayer, name: null as unknown as string };
            render(
                <Wrapper>
                    <PlayerLink player={namelessPlayer} year={2024} format="left-arrow" />
                </Wrapper>,
            );
            expect(screen.getByRole('link', { name: 'Previous player: Unknown' })).toBeInTheDocument();
        });

        it('uses "Unknown" in right-arrow aria-label when player name is null', () => {
            const namelessPlayer = { ...defaultPlayer, name: null as unknown as string };
            render(
                <Wrapper>
                    <PlayerLink player={namelessPlayer} year={2024} format="right-arrow" />
                </Wrapper>,
            );
            expect(screen.getByRole('link', { name: 'Next player: Unknown' })).toBeInTheDocument();
        });
    });
});
