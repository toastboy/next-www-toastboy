import { render, screen } from '@testing-library/react';

import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { defaultPlayer } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('PlayerLink', () => {
    it('renders link to player page', () => {
        render(
            <Wrapper>
                <PlayerLink player={defaultPlayer} year={2024} />
            </Wrapper>,
        );

        const link = screen.getByRole('link', { name: defaultPlayer.name! });
        expect(link).toHaveAttribute('href', `/footy/player/${defaultPlayer.id}/2024`);
    });

    it('renders link without year when year is 0', () => {
        render(
            <Wrapper>
                <PlayerLink player={defaultPlayer} year={0} />
            </Wrapper>,
        );

        const link = screen.getByRole('link', { name: defaultPlayer.name! });
        expect(link).toHaveAttribute('href', `/footy/player/${defaultPlayer.id}`);
    });
});
