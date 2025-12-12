import { render, screen } from '@testing-library/react';
import { TableNameSchema } from 'prisma/generated/schemas';

import { PlayerTrophyTally } from '@/components/PlayerTrophyTally/PlayerTrophyTally';
import { defaultPlayerRecord } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('PlayerTrophyTally', () => {
    it('renders trophy tally when trophies exist', () => {
        render(
            <Wrapper>
                <PlayerTrophyTally
                    table={TableNameSchema.enum.points}
                    trophies={[defaultPlayerRecord]}
                />
            </Wrapper>,
        );

        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('renders nothing when no trophies', () => {
        const { container } = render(
            <Wrapper>
                <PlayerTrophyTally
                    table={TableNameSchema.enum.points}
                    trophies={[]}
                />
            </Wrapper>,
        );

        expect(container.firstChild).toBeEmptyDOMElement();
    });
});
