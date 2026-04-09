import { render } from '@testing-library/react';

import { FamilyTreeSkeleton } from '@/components/FamilyTree/FamilyTreeSkeleton';
import { Wrapper } from '@/tests/components/lib/common';

describe('FamilyTreeSkeleton', () => {
    it('renders with data-testid', () => {
        const { getByTestId } = render(
            <Wrapper>
                <FamilyTreeSkeleton />
            </Wrapper>,
        );

        expect(getByTestId('skeleton-family-tree')).toBeInTheDocument();
    });
});
