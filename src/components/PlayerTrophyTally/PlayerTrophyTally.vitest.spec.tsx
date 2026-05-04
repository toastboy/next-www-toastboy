import { render, screen } from '@testing-library/react';
import { TableNameSchema } from 'prisma/zod/schemas';

import { PlayerTrophyTally } from '@/components/PlayerTrophyTally/PlayerTrophyTally';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecordList } from '@/tests/mocks/data/playerRecord';

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

        const iconCount = await screen.findAllByRole('img');
        expect(iconCount).toHaveLength(1);
        expect(screen.getByText('x 6')).toBeInTheDocument();
    });

    it('renders a star icon for the averages table', async () => {
        render(
            <Wrapper>
                <PlayerTrophyTally
                    table={TableNameSchema.enum.averages}
                    trophies={defaultPlayerRecordList.slice(0, 1)}
                />
            </Wrapper>,
        );

        expect(await screen.findByRole('img', { name: 'star' })).toBeInTheDocument();
    });

    it('renders a medal icon for the stalwart table', async () => {
        render(
            <Wrapper>
                <PlayerTrophyTally
                    table={TableNameSchema.enum.stalwart}
                    trophies={defaultPlayerRecordList.slice(0, 1)}
                />
            </Wrapper>,
        );

        expect(await screen.findByRole('img', { name: 'medal' })).toBeInTheDocument();
    });

    it('renders a clock icon for the speedy table', async () => {
        render(
            <Wrapper>
                <PlayerTrophyTally
                    table={TableNameSchema.enum.speedy}
                    trophies={defaultPlayerRecordList.slice(0, 1)}
                />
            </Wrapper>,
        );

        expect(await screen.findByRole('img', { name: 'clock' })).toBeInTheDocument();
    });

    it('renders a beer icon for the pub table', async () => {
        render(
            <Wrapper>
                <PlayerTrophyTally
                    table={TableNameSchema.enum.pub}
                    trophies={defaultPlayerRecordList.slice(0, 1)}
                />
            </Wrapper>,
        );

        expect(await screen.findByRole('img', { name: 'beer' })).toBeInTheDocument();
    });
});
