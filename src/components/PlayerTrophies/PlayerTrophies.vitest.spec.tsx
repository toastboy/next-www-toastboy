
import { render } from '@testing-library/react';
import { TableNameSchema } from 'prisma/zod/schemas';
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
            // With varied mock data, points table has 20 winners (defaultPlayerRecord + 19 generated with rank 1)
            expect(props[0].trophies.length).toBe(20);
            expect(props[4].table).toEqual("pub");
            // Pub table has 19 winners (defaultPlayerRecord has rankPub: 5, so only 19 generated records)
            expect(props[4].trophies.length).toBe(19);
        }
    });

    it('omits a tally for a table with no trophies, whether missing or empty', () => {
        const partialTrophies = new Map(
            Array.from(defaultTrophiesList.entries()).filter(([table]) => table !== 'pub'),
        );
        partialTrophies.set('speedy', []);

        render(
            <Wrapper>
                <PlayerTrophies trophies={partialTrophies} />
            </Wrapper>,
        );

        const props = extractMockProps<PlayerTrophyTallyProps>('PlayerTrophyTally');
        expect(props).toHaveLength(3);
        expect(props.some((p) => p.table === 'pub')).toBe(false);
        expect(props.some((p) => p.table === 'speedy')).toBe(false);
    });

    it('renders nothing when all trophy lists are empty', () => {
        const emptyTrophies = new Map(
            TableNameSchema.options.map((table) => [table, []]),
        );
        render(
            <Wrapper><PlayerTrophies trophies={emptyTrophies} /></Wrapper>,
        );
        expect(document.querySelector('[class*="mantine-Stack"]')).toBeNull();
    });
});
