import { render, screen } from '@testing-library/react';

import { CX, CY, RING_RADIUS } from '@/components/PlayerForm/PlayerForm';
import { Wrapper } from '@/tests/components/lib/common';

import { GoalieIndicator } from './GoalieIndicator';

describe('GoalieIndicator', () => {
    it('renders the goalie indicator', () => {
        render(
            <Wrapper>
                <GoalieIndicator />
            </Wrapper>,
        );

        expect(screen.getByRole('img', { name: /goalie/i })).toBeInTheDocument();
    });

    it('is positioned at the bottom centre of the arc ring', () => {
        render(
            <Wrapper>
                <GoalieIndicator />
            </Wrapper>,
        );

        const indicator = screen.getByRole('img', { name: /goalie/i });
        expect(indicator).toHaveStyle({
            left: `${CX}%`,
            top: `${CY + RING_RADIUS}%`,
        });
    });
});
