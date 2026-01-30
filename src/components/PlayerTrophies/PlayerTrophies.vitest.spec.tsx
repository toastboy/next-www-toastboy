
import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { PlayerTrophies } from '@/components/PlayerTrophies/PlayerTrophies';
import { Props as PlayerTrophyTallyProps } from '@/components/PlayerTrophyTally/PlayerTrophyTally';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultTrophiesList } from '@/tests/mocks/data/playerRecord';

vi.mock('@/components/PlayerTrophyTally/PlayerTrophyTally');

describe('PlayerTrophies', () => {
    it('renders trophy tally for each table', () => {
        render(
            <Wrapper>
                <PlayerTrophies trophies={defaultTrophiesList} />
            </Wrapper>,
        );

        {
            const props = extractMockProps<PlayerTrophyTallyProps>('PlayerTrophyTally');
            expect(props.length).toBe(5);
            expect(props[0].table).toEqual("points");
            // With varied mock data, each table now has ~20 winners (every 5th record has rank 1)
            expect(props[0].trophies.length).toBe(20);
            expect(props[4].table).toEqual("pub");
            expect(props[4].trophies.length).toBe(20);
        }
    });
});
