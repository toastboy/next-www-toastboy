import { render, screen } from '@testing-library/react';
import { TableNameSchema } from 'prisma/generated/schemas';

import { PlayerTrophyTally } from '@/components/PlayerTrophyTally/PlayerTrophyTally';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecord } from '@/tests/mocks';

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
