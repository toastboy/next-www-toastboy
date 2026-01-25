import { render, screen } from '@testing-library/react';

import { PlayerMugshot } from '@/components/PlayerMugshot/PlayerMugshot';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayer } from '@/tests/mocks/data/player';

describe('PlayerMugshot', () => {
    it('renders mugshot image with link to player', () => {
        render(
            <Wrapper>
                <PlayerMugshot player={defaultPlayer} />
            </Wrapper>,
        );

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', `/footy/player/${defaultPlayer.id}`);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', `/api/footy/player/${defaultPlayer.id}/mugshot`);
    });
});
