import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Wrapper } from '@/tests/components/lib/common';

import { GoalieIndicator } from './GoalieIndicator';

describe('GoalieIndicator', () => {
    it('renders the goalie indicator', () => {
        render(
            <Wrapper>
                <GoalieIndicator />
            </Wrapper>,
        );

        expect(
            screen.getByRole('img', { name: /goalie indicator/i }),
        ).toBeInTheDocument();
    });

    it('shows a "Goalie" tooltip on hover', async () => {
        render(
            <Wrapper>
                <GoalieIndicator />
            </Wrapper>,
        );

        const user = userEvent.setup();
        await user.hover(
            screen.getByRole('img', { name: /goalie indicator/i }),
        );

        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent('Goalie');
    });

    it('renders exactly two mirrored hand icons', () => {
        render(
            <Wrapper>
                <GoalieIndicator />
            </Wrapper>,
        );

        const indicator = screen.getByRole('img', {
            name: /goalie indicator/i,
        });
        expect(indicator.querySelectorAll('svg')).toHaveLength(2);
    });

    it('does not introduce its own focus stop, so it stays safe to render inline inside a link', () => {
        render(
            <Wrapper>
                <GoalieIndicator />
            </Wrapper>,
        );

        const indicator = screen.getByRole('img', {
            name: /goalie indicator/i,
        });
        expect(indicator).not.toHaveAttribute('tabindex');
        expect(['A', 'BUTTON', 'INPUT']).not.toContain(indicator.tagName);
    });
});
