import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TableNameSchema } from 'prisma/zod/schemas';

import { TableScore } from '@/components/TableScore/TableScore';
import { Wrapper } from '@/tests/components/lib/common';
import {
    defaultPlayerRecord,
    minimalPlayerRecord,
} from '@/tests/mocks/data/playerRecord';

describe('TableScore', () => {
    it('renders points score', () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.points}
                    playerRecord={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        expect(
            screen.getByText(String(defaultPlayerRecord.scorePoints)),
        ).toBeInTheDocument();
    });

    it('shows points tooltip with W/D/L breakdown on hover', async () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.points}
                    playerRecord={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        const user = userEvent.setup();
        await user.hover(
            screen.getByText(String(defaultPlayerRecord.scorePoints)),
        );
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(
            `P${defaultPlayerRecord.played ?? 0}`,
        );
        expect(tooltip).toHaveTextContent(`W${defaultPlayerRecord.won ?? 0}`);
        expect(tooltip).toHaveTextContent(`D${defaultPlayerRecord.drawn ?? 0}`);
        expect(tooltip).toHaveTextContent(`L${defaultPlayerRecord.lost ?? 0}`);
    });

    it('shows points tooltip with zeros when stats are missing', async () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.points}
                    playerRecord={minimalPlayerRecord}
                />
            </Wrapper>,
        );

        const user = userEvent.setup();
        await user.hover(screen.getByRole('paragraph'));
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent('P0');
        expect(tooltip).toHaveTextContent('W0');
        expect(tooltip).toHaveTextContent('D0');
        expect(tooltip).toHaveTextContent('L0');
    });

    it('renders averages with fixed decimal places', async () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.averages}
                    playerRecord={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        expect(defaultPlayerRecord.scoreAverages).toBeDefined();
        const expectedAverage = defaultPlayerRecord.scoreAverages.toFixed(3);
        expect(screen.getByText(expectedAverage)).toBeInTheDocument();

        const user = userEvent.setup();
        await user.hover(
            screen.getByText(
                String(defaultPlayerRecord.scoreAverages.toFixed(3)),
            ),
        );
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(
            `P${defaultPlayerRecord.played ?? 0}`,
        );
        expect(tooltip).toHaveTextContent(`W${defaultPlayerRecord.won ?? 0}`);
        expect(tooltip).toHaveTextContent(`D${defaultPlayerRecord.drawn ?? 0}`);
        expect(tooltip).toHaveTextContent(`L${defaultPlayerRecord.lost ?? 0}`);
    });

    it('shows averages tooltip with W/D/L breakdown on hover', async () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.averages}
                    playerRecord={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        const user = userEvent.setup();
        await user.hover(
            screen.getByText(defaultPlayerRecord.scoreAverages.toFixed(3)),
        );
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(
            `P${defaultPlayerRecord.played ?? 0}`,
        );
        expect(tooltip).toHaveTextContent(`W${defaultPlayerRecord.won ?? 0}`);
        expect(tooltip).toHaveTextContent(`D${defaultPlayerRecord.drawn ?? 0}`);
        expect(tooltip).toHaveTextContent(`L${defaultPlayerRecord.lost ?? 0}`);
    });

    it('shows averages tooltip with zeros when stats are missing', async () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.averages}
                    playerRecord={minimalPlayerRecord}
                />
            </Wrapper>,
        );

        const user = userEvent.setup();
        await user.hover(screen.getByRole('paragraph'));
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent('P0');
        expect(tooltip).toHaveTextContent('W0');
        expect(tooltip).toHaveTextContent('D0');
        expect(tooltip).toHaveTextContent('L0');
    });

    it('renders stalwart score as percentage', () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.stalwart}
                    playerRecord={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        expect(
            screen.getByText(`${defaultPlayerRecord.scoreStalwart}%`),
        ).toBeInTheDocument();
    });

    it('shows stalwart tooltip with played/games breakdown on hover', async () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.stalwart}
                    playerRecord={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        const user = userEvent.setup();
        await user.hover(
            screen.getByText(`${defaultPlayerRecord.scoreStalwart}%`),
        );
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(
            `Played ${defaultPlayerRecord.played} of ${defaultPlayerRecord.gamesPlayed}`,
        );
    });

    it('shows stalwart tooltip with zeros when stats are missing', async () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.stalwart}
                    playerRecord={minimalPlayerRecord}
                />
            </Wrapper>,
        );

        const user = userEvent.setup();
        await user.hover(screen.getByRole('paragraph'));
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent('Played 0 of 10');
    });

    it('renders speedy score as HH:MM:SS time', () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.speedy}
                    playerRecord={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        const date = new Date(0);
        date.setSeconds(defaultPlayerRecord.scoreSpeedy);
        expect(
            screen.getByText(date.toISOString().substring(11, 19)),
        ).toBeInTheDocument();
    });

    it('shows speedy tooltip with response count on hover', async () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.speedy}
                    playerRecord={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        const date = new Date(0);
        date.setSeconds(defaultPlayerRecord.scoreSpeedy);
        const user = userEvent.setup();
        await user.hover(
            screen.getByText(date.toISOString().substring(11, 19)),
        );
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(
            `${defaultPlayerRecord.responses} responses`,
        );
    });

    it('shows speedy tooltip with zeros when stats are missing', async () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.speedy}
                    playerRecord={minimalPlayerRecord}
                />
            </Wrapper>,
        );

        const user = userEvent.setup();
        await user.hover(screen.getByRole('paragraph'));
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent('0 responses');
    });

    it('renders a dash for speedy score when unset, not 00:00:00', () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.speedy}
                    playerRecord={minimalPlayerRecord}
                />
            </Wrapper>,
        );

        expect(screen.getByText('-')).toBeInTheDocument();
        expect(screen.queryByText('00:00:00')).not.toBeInTheDocument();
    });

    it('renders speedy score as 00:00:00 when the value is explicitly zero', () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.speedy}
                    playerRecord={{
                        ...defaultPlayerRecord,
                        scoreSpeedy: 0,
                    }}
                />
            </Wrapper>,
        );

        expect(screen.getByText('00:00:00')).toBeInTheDocument();
    });

    it('rounds a fractional speedy score to the nearest second rather than truncating', () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.speedy}
                    playerRecord={{
                        ...defaultPlayerRecord,
                        scoreSpeedy: 89.6,
                    }}
                />
            </Wrapper>,
        );

        expect(screen.getByText('00:01:30')).toBeInTheDocument();
        expect(screen.queryByText('00:01:29')).not.toBeInTheDocument();
    });

    it('renders pub score', () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.pub}
                    playerRecord={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        expect(
            screen.getByText(String(defaultPlayerRecord.scorePub)),
        ).toBeInTheDocument();
    });

    it('renders a dash for pub score when unset', () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.pub}
                    playerRecord={minimalPlayerRecord}
                />
            </Wrapper>,
        );

        expect(screen.getByText('-')).toBeInTheDocument();
    });
});
