import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TableNameSchema } from 'prisma/zod/schemas';

import { TableScore } from '@/components/TableScore/TableScore';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecord, minimalPlayerRecord } from '@/tests/mocks/data/playerRecord';

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

        expect(screen.getByText(String(defaultPlayerRecord.points))).toBeInTheDocument();
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
        await user.hover(screen.getByText(String(defaultPlayerRecord.points)));
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(`P${defaultPlayerRecord.played ?? 0}`);
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

        expect(defaultPlayerRecord.averages).toBeDefined();
        const expectedAverage = defaultPlayerRecord.averages.toFixed(3);
        expect(screen.getByText(expectedAverage)).toBeInTheDocument();

        const user = userEvent.setup();
        await user.hover(screen.getByText(String(defaultPlayerRecord.averages.toFixed(3))));
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(`P${defaultPlayerRecord.played ?? 0}`);
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
        await user.hover(screen.getByText(defaultPlayerRecord.averages.toFixed(3)));
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(`P${defaultPlayerRecord.played ?? 0}`);
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

        expect(screen.getByText(`${defaultPlayerRecord.stalwart}%`)).toBeInTheDocument();
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
        await user.hover(screen.getByText(`${defaultPlayerRecord.stalwart}%`));
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
        date.setSeconds(defaultPlayerRecord.speedy);
        expect(screen.getByText(date.toISOString().substring(11, 19))).toBeInTheDocument();
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
        date.setSeconds(defaultPlayerRecord.speedy);
        const user = userEvent.setup();
        await user.hover(screen.getByText(date.toISOString().substring(11, 19)));
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(`${defaultPlayerRecord.responses} responses`);
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

    it('renders pub score', () => {
        render(
            <Wrapper>
                <TableScore
                    table={TableNameSchema.enum.pub}
                    playerRecord={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        expect(screen.getByText(String(defaultPlayerRecord.pub))).toBeInTheDocument();
    });
});
