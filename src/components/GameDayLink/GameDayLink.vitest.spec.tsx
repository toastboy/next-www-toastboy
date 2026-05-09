import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GameDayLink } from '@/components/GameDayLink/GameDayLink';
import { formatDate } from '@/lib/dates';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultGameDay } from '@/tests/mocks/data/gameDay';

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

    it('renders tooltip when comment is present', async () => {
        const gameDayWithComment = {
            ...defaultGameDay,
            comment: 'This is a comment',
        };

        render(<Wrapper><GameDayLink gameDay={gameDayWithComment} /></Wrapper>);

        const user = userEvent.setup();
        await user.hover(screen.getByRole('link'));

        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent('This is a comment');
    });

    it('does not render tooltip when comment is absent', () => {
        const gameDayWithoutComment = {
            ...defaultGameDay,
            comment: null,
        };

        render(<Wrapper><GameDayLink gameDay={gameDayWithoutComment} /></Wrapper>);

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).not.toHaveAttribute('title');
    });
});
