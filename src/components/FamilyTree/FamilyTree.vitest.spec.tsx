import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FamilyTree } from '@/components/FamilyTree/FamilyTree';
import * as familyTreeRadiusModule from '@/components/FamilyTree/familyTreeRadius';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultFamilyTree } from '@/tests/mocks/data/familyTree';
import type { FamilyTreeNodeType } from '@/types';

/*
 * A three-level tree used in tests that need more than one depth ring so the
 * two-pass radius computation and zoom-fitting code both exercise real paths.
 */
const deepTree: FamilyTreeNodeType = {
    id: 1,
    name: 'Founder',
    children: [
        {
            id: 2,
            name: 'Alice',
            children: [
                { id: 4, name: 'Dave', children: [] },
                { id: 5, name: 'Eve', children: [] },
            ],
        },
        {
            id: 3,
            name: 'Bob',
            children: [{ id: 6, name: 'Frank', children: [] }],
        },
    ],
};

describe('FamilyTree', () => {
    afterEach(() => {
        vi.restoreAllMocks();
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

    // -------------------------------------------------------------------------
    // Initial zoom fitting (getBBox → zoom.transform)
    // -------------------------------------------------------------------------

    describe('initial zoom fitting', () => {
        /*
         * Two jsdom limitations must be worked around:
         *
         * 1. clientWidth returns 0 — the component uses it for the container
         *    width, which feeds into the floor radius and the scale
         *    computation. A width of 0 makes the scale negative (because
         *    (0 − 2×pad) / b.width < 0), so the fitting block either
         *    produces a degenerate transform or is clamped by D3's zoom
         *    scaleExtent. Spy on the getter to return 500 instead.
         *
         * 2. SVGGraphicsElement.prototype.getBBox is implemented in jsdom
         *    but returns zeros, causing the guard (b.width > 0) to fail and
         *    the fitting block to be skipped entirely. Mock it to return a
         *    stable 500×500 box centred at the origin.
         */
        beforeEach(() => {
            vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(500);
            vi.spyOn(SVGGraphicsElement.prototype, 'getBBox').mockReturnValue({
                x: -250,
                y: -250,
                width: 500,
                height: 500,
                top: -250,
                right: 250,
                bottom: 250,
                left: -250,
                toJSON: () => ({}),
            });
        });

        it('calls getBBox on the content group after rendering', async () => {
            render(
                <Wrapper>
                    <FamilyTree data={deepTree} />
                </Wrapper>,
            );

            await waitFor(() => {
                expect(SVGGraphicsElement.prototype.getBBox).toHaveBeenCalled();
            });
        });

        it('applies a non-identity zoom transform to the content group', async () => {
            const { container } = render(
                <Wrapper>
                    <FamilyTree data={deepTree} />
                </Wrapper>,
            );

            /*
             * With clientWidth=500, getBBox={x:-250,y:-250,w:500,h:500} and
             * jsdom's innerHeight=768, the fitted scale is ≈0.92 and the
             * translation is clearly non-zero.
             */
            const transform = await waitFor(() => {
                const g = container.querySelector<SVGGElement>('svg > g');
                const t = g?.getAttribute('transform');
                expect(t).toBeTruthy();
                return t!;
            });

            /* D3 zoom.transform emits "translate(tx,ty) scale(k)". */
            expect(transform).toMatch(/translate\(/);
            expect(transform).toMatch(/scale\(/);
        });

        it('does not leave the zoom at the identity transform', async () => {
            const { container } = render(
                <Wrapper>
                    <FamilyTree data={deepTree} />
                </Wrapper>,
            );

            const transform = await waitFor(() => {
                const g = container.querySelector<SVGGElement>('svg > g');
                const t = g?.getAttribute('transform');
                expect(t).toBeTruthy();
                return t!;
            });

            /*
             * An identity transform is "translate(0,0) scale(1)". The
             * centred bounding box forces a non-zero translation even before
             * scale is considered.
             */
            expect(transform).not.toMatch(/translate\(\s*0[\s,]+0\s*\)\s*scale\(1\)/);
        });

        it('produces no NaN transforms when computeTreeRadius returns Infinity', async () => {
            /*
             * computeTreeRadius returns Infinity when two nodes share an angle
             * (zero angular gap → unsatisfiable constraint). Without the cap in
             * FamilyTree.tsx (Math.min(…, width * 4)), the subsequent
             * `d.y *= radius` would compute 0 × Infinity = NaN for the root
             * node, propagating NaN into every transform attribute.
             *
             * This test verifies that the cap prevents NaN from reaching the DOM.
             */
            vi.spyOn(familyTreeRadiusModule, 'computeTreeRadius').mockReturnValue(
                Infinity,
            );

            const { container } = render(
                <Wrapper>
                    <FamilyTree data={deepTree} />
                </Wrapper>,
            );

            await waitFor(() => {
                expect(SVGGraphicsElement.prototype.getBBox).toHaveBeenCalled();
            });

            const allTransforms = Array.from(
                container.querySelectorAll<SVGElement>('[transform]'),
            ).map((el) => el.getAttribute('transform') ?? '');

            expect(allTransforms.length).toBeGreaterThan(0);
            for (const t of allTransforms) {
                expect(t).not.toContain('NaN');
            }
        });
    });
});
