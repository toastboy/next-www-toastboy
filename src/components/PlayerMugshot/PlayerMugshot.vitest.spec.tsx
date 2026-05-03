import { render, screen } from '@testing-library/react';
import type { PlayerType } from 'prisma/zod/schemas/models/Player.schema';

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
        expect(img).toHaveAttribute('alt', defaultPlayer.name);
        expect(img).toHaveAttribute('title', defaultPlayer.name);
    });

    it('uses "Player {id}" as alt and title when name is null', () => {
        const player: PlayerType = { ...defaultPlayer, name: null };
        render(
            <Wrapper>
                <PlayerMugshot player={player} />
            </Wrapper>,
        );

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', `Player ${player.id}`);
        expect(img).toHaveAttribute('title', `Player ${player.id}`);
    });
});
