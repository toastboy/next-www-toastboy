import { render, screen } from '@testing-library/react';

import { RelativeTime } from '@/components/RelativeTime/RelativeTime';
import { Wrapper } from '@/tests/components/lib/common';

describe('RelativeTime', () => {
    it('renders relative time with tooltip', () => {
        const date = new Date('2024-01-01');
        render(
            <Wrapper>
                <RelativeTime date={date} />
            </Wrapper>,
        );

        const text = screen.getByText(/ago/);
        expect(text).toBeInTheDocument();
    });
});
