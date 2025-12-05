import { render, screen } from '@testing-library/react';

import GameDayLink from '@/components/GameDayLink/GameDayLink';
import { defaultGameDay } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('GameDayLink', () => {
    it('renders link with Swedish-locale date', async () => {
        render(<Wrapper><GameDayLink gameDay={defaultGameDay} /></Wrapper>);

        const link = screen.getByRole('link', {
            name: defaultGameDay.date.toLocaleDateString('sv')
        });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', `/footy/game/${defaultGameDay.id}`);
    });
});
