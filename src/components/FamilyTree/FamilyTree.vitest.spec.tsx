import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { FamilyTree } from '@/components/FamilyTree/FamilyTree';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultFamilyTree } from '@/tests/mocks/data/familyTree';

describe('FamilyTree', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

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

    it('shows tooltip with player name on node hover', async () => {
        const { container } = render(
            <Wrapper>
                <FamilyTree data={defaultFamilyTree} />
            </Wrapper>,
        );

        // D3 attaches cursor:pointer to each node <g>; root node (Gary Player) is first
        const nodes = container.querySelectorAll('[style*="cursor: pointer"]');
        fireEvent.mouseEnter(nodes[0]);

        await waitFor(() => {
            expect(screen.getByRole('tooltip')).toHaveTextContent('Gary Player');
        });
    });

    it('clears tooltip on node mouseleave', async () => {
        const { container } = render(
            <Wrapper>
                <FamilyTree data={defaultFamilyTree} />
            </Wrapper>,
        );

        const nodes = container.querySelectorAll('[style*="cursor: pointer"]');
        fireEvent.mouseEnter(nodes[0]);
        await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());

        fireEvent.mouseLeave(nodes[0]);
        await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    });

    it('navigates to the player page on node click', () => {
        vi.stubGlobal('location', { href: '' });
        const { container } = render(
            <Wrapper>
                <FamilyTree data={defaultFamilyTree} />
            </Wrapper>,
        );

        // Root node is Gary Player (id 1), first in depth-first traversal
        const nodes = container.querySelectorAll('[style*="cursor: pointer"]');
        fireEvent.click(nodes[0]);

        expect(window.location.href).toBe('/footy/player/1');
    });
});
