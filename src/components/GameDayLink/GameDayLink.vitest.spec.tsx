import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GameDayLink } from '@/components/GameDayLink/GameDayLink';
import { formatDate } from '@/lib/dates';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockGameDay, defaultGameDay } from '@/tests/mocks/data/gameDay';

describe('GameDayLink', () => {
    it('renders link with ISO 8601 date', () => {
        render(<Wrapper><GameDayLink gameDay={defaultGameDay} /></Wrapper>);

        const link = screen.getByRole('link', {
            name: formatDate(defaultGameDay.date),
        });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', `/footy/game/${defaultGameDay.id}`);
    });

    it('renders link with ordinal-formatted label', () => {
        render(
            <Wrapper>
                <GameDayLink gameDay={defaultGameDay} format="ordinal" />
            </Wrapper>,
        );

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', `/footy/game/${defaultGameDay.id}`);
        expect(link).toHaveTextContent(/\d+(st|nd|rd|th|:a|:e)/i);
    });

    it('renders link with numeric day label', () => {
        render(
            <Wrapper>
                <GameDayLink gameDay={defaultGameDay} format="numeric" />
            </Wrapper>,
        );

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', `/footy/game/${defaultGameDay.id}`);
        expect(link).toHaveTextContent(defaultGameDay.date.getDate().toString());
    });

    it('renders left-arrow format as an icon inside a link', () => {
        render(
            <Wrapper>
                <GameDayLink gameDay={defaultGameDay} format="left-arrow" />
            </Wrapper>,
        );

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', `/footy/game/${defaultGameDay.id}`);
        // The link content is an SVG icon, not visible text.
        expect(link.querySelector('svg')).toBeInTheDocument();
    });

    it('renders right-arrow format as an icon inside a link', () => {
        render(
            <Wrapper>
                <GameDayLink gameDay={defaultGameDay} format="right-arrow" />
            </Wrapper>,
        );

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', `/footy/game/${defaultGameDay.id}`);
        // The link content is an SVG icon, not visible text.
        expect(link.querySelector('svg')).toBeInTheDocument();
    });

    it('exposes icon-only left-arrow link description via tooltip on hover', async () => {
        render(
            <Wrapper>
                <GameDayLink gameDay={defaultGameDay} format="left-arrow" />
            </Wrapper>,
        );

        const user = userEvent.setup();
        await user.hover(screen.getByRole('link'));

        // The tooltip provides the accessible description for the otherwise icon-only link.
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(formatDate(defaultGameDay.date));
    });

    it('exposes icon-only right-arrow link description via tooltip on hover', async () => {
        render(
            <Wrapper>
                <GameDayLink gameDay={defaultGameDay} format="right-arrow" />
            </Wrapper>,
        );

        const user = userEvent.setup();
        await user.hover(screen.getByRole('link'));

        // The tooltip provides the accessible description for the otherwise icon-only link.
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(formatDate(defaultGameDay.date));
    });

    it('tooltip includes both date and comment when comment is present', async () => {
        const gameDayWithComment = createMockGameDay({ comment: 'This is a comment' });

        render(<Wrapper><GameDayLink gameDay={gameDayWithComment} /></Wrapper>);

        const user = userEvent.setup();
        await user.hover(screen.getByRole('link'));

        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(formatDate(gameDayWithComment.date));
        expect(tooltip).toHaveTextContent('This is a comment');
    });

    it('tooltip shows only the date when comment is null', async () => {
        const gameDayNoComment = createMockGameDay({ comment: null });

        render(<Wrapper><GameDayLink gameDay={gameDayNoComment} /></Wrapper>);

        const user = userEvent.setup();
        await user.hover(screen.getByRole('link'));

        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent(formatDate(gameDayNoComment.date));
        // No stray comment text beyond the date.
        expect(tooltip.textContent?.trim()).toBe(formatDate(gameDayNoComment.date));
    });
});
