import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Props as GameDayLinkProps } from '@/components/GameDayLink/GameDayLink';
import { GameDayList } from '@/components/GameDayList/GameDayList';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultGameDayList } from '@/tests/mocks/data/gameDay';

vi.mock('@/components/GameDayLink/GameDayLink');

describe('GameDayList', () => {
    it('renders one GameDayLink per game day', () => {
        const gameDays = defaultGameDayList.slice(0, 3);

        render(
            <Wrapper>
                <GameDayList gameDays={gameDays} />
            </Wrapper>,
        );

        const props = extractMockProps<GameDayLinkProps>('GameDayLink');
        expect(props).toHaveLength(gameDays.length);
        expect(props[0].gameDay.id).toBe(gameDays[0].id);
        expect(props[2].gameDay.id).toBe(gameDays[2].id);
    });

    it('renders an empty state when no game days exist', () => {
        render(
            <Wrapper>
                <GameDayList gameDays={[]} />
            </Wrapper>,
        );

        expect(screen.getByText('No results yet.')).toBeInTheDocument();
    });
});
