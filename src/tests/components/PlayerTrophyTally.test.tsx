import { render, screen } from '@testing-library/react';
import { TableNameSchema } from 'prisma/generated/schemas';

import { PlayerTrophyTally } from '@/components/PlayerTrophyTally/PlayerTrophyTally';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecordList } from '@/tests/mocks';

describe('PlayerTrophyTally', () => {
    it('renders nothing when there are no trophies', () => {
        render(
            <Wrapper>
                <PlayerTrophyTally
                    table={TableNameSchema.enum.points}
                    trophies={[]}
                />
            </Wrapper>,
        );

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('renders 3 trophies tally when 3 trophies were won', async () => {
        render(
            <Wrapper>
                <PlayerTrophyTally
                    table={TableNameSchema.enum.points}
                    trophies={defaultPlayerRecordList.slice(0, 3)}
                />
            </Wrapper>,
        );

        screen.debug();

        const iconCount = await screen.findAllByRole('img');
        expect(iconCount).toHaveLength(3);
    });

    it('renders trophy tally when more then 3 trophies were won', async () => {
        render(
            <Wrapper>
                <PlayerTrophyTally
                    table={TableNameSchema.enum.points}
                    trophies={defaultPlayerRecordList.slice(0, 6)}
                />
            </Wrapper>,
        );

        screen.debug();

        const iconCount = await screen.findAllByRole('img');
        expect(iconCount).toHaveLength(1);
        expect(screen.getByText('x 6')).toBeInTheDocument();
    });
});
