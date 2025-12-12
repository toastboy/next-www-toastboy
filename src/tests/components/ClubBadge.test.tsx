jest.mock('services/Club', () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));

import { render, screen } from '@testing-library/react';

import { ClubBadge } from '@/components/ClubBadge/ClubBadge';
import { defaultClub } from '@/tests/mocks';

import { Wrapper } from './lib/common';

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
