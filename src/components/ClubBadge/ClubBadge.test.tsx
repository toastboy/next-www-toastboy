import { render, screen } from '@testing-library/react';

import { ClubBadge } from '@/components/ClubBadge/ClubBadge';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultClub } from '@/tests/mocks';

describe('ClubBadge', () => {
    it('renders badge image', () => {
        render(
            <Wrapper>
                <ClubBadge club={defaultClub} />
            </Wrapper>,
        );

        const img = screen.getByRole('img', { name: defaultClub.clubName });
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', `/api/footy/club/${defaultClub.id}/badge`);
    });
});
