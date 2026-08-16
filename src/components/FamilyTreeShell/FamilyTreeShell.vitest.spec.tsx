import { render, screen } from '@testing-library/react';

import { FamilyTreeShell } from '@/components/FamilyTreeShell/FamilyTreeShell';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultFamilyTree } from '@/tests/mocks/data/familyTree';

vi.mock('@/components/FamilyTree/FamilyTree');

describe('FamilyTreeShell', () => {
    it('renders the heading, intro copy, and passes data through to FamilyTree', () => {
        render(
            <Wrapper>
                <FamilyTreeShell data={defaultFamilyTree} />
            </Wrapper>,
        );

        expect(
            screen.getByRole('heading', { name: 'Toastboy FC Family Tree' }),
        ).toBeInTheDocument();
        expect(screen.getByText(/starting with Rob/)).toBeInTheDocument();

        const tree = screen.getByTestId('family-tree');
        expect(tree.textContent).toContain(JSON.stringify(defaultFamilyTree));
    });
});
