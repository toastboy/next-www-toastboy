import { describe, expect, it } from 'vitest';

import {
    computeTreeRadius,
    minAngularGap,
    requiredRadiusForDepth,
} from './familyTreeRadius';

const TWO_PI = 2 * Math.PI;
const SIZE = 20;
const GAP = 4;

// ---------------------------------------------------------------------------
// minAngularGap
// ---------------------------------------------------------------------------

describe('minAngularGap', () => {
    it('returns Infinity for an empty array', () => {
        expect(minAngularGap([])).toBe(Infinity);
    });

    it('returns Infinity for a single angle', () => {
        expect(minAngularGap([1])).toBe(Infinity);
    });

    it('returns the gap for two diametrically opposite angles', () => {
        // gap = π, wrap = π  → min = π
        expect(minAngularGap([0, Math.PI])).toBeCloseTo(Math.PI);
    });

    it('picks the smallest consecutive gap', () => {
        // gaps: 0.1, (TWO_PI - 0.2), wrap: 0.1  → min = 0.1
        expect(minAngularGap([0, 0.1, TWO_PI - 0.1])).toBeCloseTo(0.1);
    });

    it('correctly computes the wrap-around gap', () => {
        // consecutive gap = TWO_PI - 0.2, wrap = 0.2  → min = 0.2
        expect(minAngularGap([0.1, TWO_PI - 0.1])).toBeCloseTo(0.2);
    });

    it('handles unsorted input', () => {
        expect(minAngularGap([TWO_PI - 0.1, 0.1])).toBeCloseTo(0.2);
    });

    it('finds the minimum gap among many uniformly-spaced angles', () => {
        const n = 60;
        const angles = Array.from({ length: n }, (_, i) => (TWO_PI * i) / n);
        expect(minAngularGap(angles)).toBeCloseTo(TWO_PI / n);
    });

    it('treats 2π as the same position as 0', () => {
        // After normalisation 2π maps to 0, making [0, 2π] two coincident
        // nodes — the gap is correctly 0 (unsatisfiable, not silently ignored).
        expect(minAngularGap([0, TWO_PI])).toBe(0);
    });

    it('normalises angles > 2π, preventing a spurious negative wrap-around gap', () => {
        // Without normalisation: sorted [0, 3π], wrap = 2π − 3π + 0 = −π < 0.
        // With normalisation: 3π → π, result = gap between 0 and π = π.
        expect(minAngularGap([0, 3 * Math.PI])).toBeCloseTo(Math.PI);
    });

    it('normalises negative angles that straddle the 0/2π boundary', () => {
        // −0.5 normalises to ≈5.78; 6.5 normalises to ≈0.22.
        // Without normalisation: wrap = 2π − 6.5 + (−0.5) ≈ −0.72 < 0 (bug).
        // With normalisation: minimum gap across the boundary ≈ 0.72.
        expect(minAngularGap([-0.5, 6.5])).toBeCloseTo(0.72, 1);
    });

    it('gives the same result for equivalent angle sets shifted by 2π', () => {
        const base = [0, Math.PI / 3, (2 * Math.PI) / 3];
        const shifted = base.map((a) => a + TWO_PI);
        expect(minAngularGap(shifted)).toBeCloseTo(minAngularGap(base));
    });
});

// ---------------------------------------------------------------------------
// requiredRadiusForDepth
// ---------------------------------------------------------------------------

describe('requiredRadiusForDepth', () => {
    it('returns Infinity when minGap is zero (coincident nodes — unsatisfiable)', () => {
        expect(requiredRadiusForDepth(0, 0.5, SIZE, GAP)).toBe(Infinity);
    });

    it('returns Infinity for negative minGap', () => {
        expect(requiredRadiusForDepth(-0.1, 0.5, SIZE, GAP)).toBe(Infinity);
    });

    it('returns 0 when nodeY is zero (root has no angular constraint)', () => {
        expect(requiredRadiusForDepth(0.5, 0, SIZE, GAP)).toBe(0);
    });

    it('computes the correct radius', () => {
        // (SIZE + GAP) / (minGap × nodeY) = 24 / (0.1 × 0.5) = 480
        expect(requiredRadiusForDepth(0.1, 0.5, SIZE, GAP)).toBeCloseTo(480);
    });

    it('increases as minGap shrinks', () => {
        const r1 = requiredRadiusForDepth(0.2, 0.5, SIZE, GAP);
        const r2 = requiredRadiusForDepth(0.1, 0.5, SIZE, GAP);
        expect(r2).toBeGreaterThan(r1);
    });

    it('increases as nodeY shrinks (shallower depth needs larger total radius)', () => {
        const rShallow = requiredRadiusForDepth(0.1, 0.25, SIZE, GAP);
        const rDeep = requiredRadiusForDepth(0.1, 0.75, SIZE, GAP);
        expect(rShallow).toBeGreaterThan(rDeep);
    });
});

// ---------------------------------------------------------------------------
// computeTreeRadius
// ---------------------------------------------------------------------------

describe('computeTreeRadius', () => {
    const FLOOR = 200;

    it('returns the floor radius for a single-node (root-only) tree', () => {
        expect(
            computeTreeRadius([[0, [{ x: 0 }]]], 0, FLOOR, SIZE, GAP),
        ).toBe(FLOOR);
    });

    it('returns the floor when maxDepth is 0 regardless of groups', () => {
        const groups: [number, { x: number }[]][] = [
            [0, [{ x: 0 }, { x: Math.PI }]],
        ];
        expect(computeTreeRadius(groups, 0, FLOOR, SIZE, GAP)).toBe(FLOOR);
    });

    it('returns the floor for a deep skinny chain (one node per depth)', () => {
        // No depth has ≥ 2 nodes → no gap constraint → floor wins
        const groups: [number, { x: number }[]][] = Array.from(
            { length: 8 },
            (_, i) => [i, [{ x: Math.PI }]],
        );
        expect(computeTreeRadius(groups, 7, FLOOR, SIZE, GAP)).toBe(FLOOR);
    });

    it('returns the floor when computed radius is smaller', () => {
        // 2 nodes π apart → gap = π → required = 24 / (π × 1) ≈ 7.6 << FLOOR
        const groups: [number, { x: number }[]][] = [
            [0, [{ x: 0 }]],
            [1, [{ x: 0 }, { x: Math.PI }]],
        ];
        expect(computeTreeRadius(groups, 1, FLOOR, SIZE, GAP)).toBe(FLOOR);
    });

    it('never returns a negative radius when a negative floor is passed', () => {
        // A very narrow container could produce a negative floor before clamping;
        // the result must still be ≥ 0.
        const groups: [number, { x: number }[]][] = [
            [0, [{ x: 0 }]],
            [1, [{ x: 0 }, { x: Math.PI }]],
        ];
        expect(computeTreeRadius(groups, 1, -100, SIZE, GAP)).toBeGreaterThanOrEqual(0);
    });

    it('exceeds the floor when nodes are packed very tightly', () => {
        // 100 nodes at depth 1 (only depth), gap ≈ TWO_PI / 100
        // required ≈ 24 × 100 / TWO_PI ≈ 382, well above FLOOR = 200
        const n = 100;
        const nodes = Array.from({ length: n }, (_, i) => ({
            x: (TWO_PI * i) / n,
        }));
        const groups: [number, { x: number }[]][] = [
            [0, [{ x: 0 }]],
            [1, nodes],
        ];
        const radius = computeTreeRadius(groups, 1, FLOOR, SIZE, GAP);
        expect(radius).toBeGreaterThan(FLOOR);
        expect(radius).toBeCloseTo(((SIZE + GAP) * n) / TWO_PI, 0);
    });

    it('is constrained by the tightest depth, not the average', () => {
        // Depth 1: 2 nodes π apart (loose) — depth 2: 60 nodes tightly packed
        const depth2 = Array.from({ length: 60 }, (_, i) => ({
            x: (TWO_PI * i) / 60,
        }));
        const groups: [number, { x: number }[]][] = [
            [0, [{ x: 0 }]],
            [1, [{ x: 0 }, { x: Math.PI }]],
            [2, depth2],
        ];
        const radius = computeTreeRadius(groups, 2, 50, SIZE, GAP);
        // depth-2 constraint: (SIZE+GAP) / ((TWO_PI/60) × (2/2)) ≈ 229
        expect(radius).toBeGreaterThan(200);
    });

    it('handles the wrap-around gap being the binding constraint', () => {
        // Two nodes very close across the 2π boundary: at ε and 2π−ε
        const eps = 0.01;
        const groups: [number, { x: number }[]][] = [
            [0, [{ x: 0 }]],
            [1, [{ x: eps }, { x: TWO_PI - eps }]],
        ];
        const radius = computeTreeRadius(groups, 1, 0, SIZE, GAP);
        // wrap gap = 2ε = 0.02 → required = 24 / 0.02 = 1200
        expect(radius).toBeCloseTo((SIZE + GAP) / (2 * eps), 0);
    });

    it('returns Infinity when two nodes share the same angle', () => {
        // minAngularGap returns 0 → requiredRadiusForDepth returns Infinity
        // → computeTreeRadius propagates it so the caller can decide the cap
        const groups: [number, { x: number }[]][] = [
            [0, [{ x: 0 }]],
            [1, [{ x: Math.PI }, { x: Math.PI }]], // duplicate angle
        ];
        expect(computeTreeRadius(groups, 1, FLOOR, SIZE, GAP)).toBe(Infinity);
    });
});
