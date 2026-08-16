import { render, screen } from '@testing-library/react';

import { RulesContent } from '@/components/RulesContent/RulesContent';
import { Wrapper } from '@/tests/components/lib/common';

describe('RulesContent', () => {
    it('renders the rules heading and body copy', () => {
        render(
            <Wrapper>
                <RulesContent />
            </Wrapper>,
        );

        expect(
            screen.getByRole('heading', { name: 'Toastboy FC: Rules' }),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/After every game, we retire to a local pub/),
        ).toBeInTheDocument();
    });
});
