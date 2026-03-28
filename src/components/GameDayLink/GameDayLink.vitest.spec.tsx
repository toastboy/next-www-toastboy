import { render, screen } from '@testing-library/react';

import { GameDayLink } from '@/components/GameDayLink/GameDayLink';
import { formatDate } from '@/lib/dates';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultGameDay } from '@/tests/mocks/data/gameDay';

describe('GameDayLink', () => {
    it('renders link with Swedish-locale date', () => {
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
});
