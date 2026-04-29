import { render } from '@testing-library/react';

import { FamilyTree } from '@/components/FamilyTree/FamilyTree';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultFamilyTree } from '@/tests/mocks/data/familyTree';

describe('FamilyTree', () => {
    it('renders svg element', () => {
        const { container } = render(
            <Wrapper>
                <FamilyTree data={defaultFamilyTree} />
            </Wrapper>,
        );

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('renders with data-testid', () => {
        const { getByTestId } = render(
            <Wrapper>
                <FamilyTree data={defaultFamilyTree} />
            </Wrapper>,
        );

        expect(getByTestId('family-tree')).toBeInTheDocument();
    });

    it('renders with empty tree', () => {
        const emptyTree = { id: 1, name: 'Gary Player', children: [] };
        const { container } = render(
            <Wrapper>
                <FamilyTree data={emptyTree} />
            </Wrapper>,
        );

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('renders mugshot images for all player nodes', () => {
        const { container } = render(
            <Wrapper>
                <FamilyTree data={defaultFamilyTree} />
            </Wrapper>,
        );

        const images = container.querySelectorAll('image');
        /* 4 players: root (1) + 3 descendants */
        expect(images.length).toBe(4);

        const hrefs = Array.from(images).map((img) => img.getAttribute('href'));
        expect(hrefs.filter((h) => h?.match(/\/api\/footy\/player\/\d+\/mugshot/))).toHaveLength(4);
    });
});
