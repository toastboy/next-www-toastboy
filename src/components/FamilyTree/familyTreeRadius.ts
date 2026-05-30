/**
 * Pure helpers for the two-pass radius computation used by the FamilyTree
 * component. Kept separate so they can be unit-tested without a DOM.
 */

const TWO_PI = 2 * Math.PI;

/**
 * Returns the minimum angular gap (in radians) between any two adjacent
 * angles in the supplied array, including the wrap-around gap from the last
 * angle back to the first through 2π. Returns Infinity when fewer than two
 * angles are provided.
 *
 * Angles are normalised to [0, 2π) before comparison. Out-of-range values
 * (negative angles, angles > 2π) are folded into that range, and equivalent
 * angles — including 2π, which maps to 0 — become coincident after
 * normalisation and will therefore produce a minimum gap of 0.
 */
export function minAngularGap(angles: number[]): number {
    if (angles.length < 2) return Infinity;
    /* Normalise to [0, 2π): handles negatives, values > 2π, and 2π → 0. */
    const sorted = angles
        .map((a) => ((a % TWO_PI) + TWO_PI) % TWO_PI)
        .sort((a, b) => a - b);
    let min = Infinity;
    for (let i = 1; i < sorted.length; i++) {
        min = Math.min(min, sorted[i] - sorted[i - 1]);
    }
    /* Wrap-around gap: arc from the last angle back around to the first. */
    return Math.min(min, TWO_PI - sorted[sorted.length - 1] + sorted[0]);
}

/**
 * Returns the outer radius at which nodes sitting at normalised depth
 * `nodeY` (= depth / maxDepth, in (0, 1]) and separated by at most
 * `minGap` radians will have at least `mugshotSize + mugshotGap` pixels
 * of arc between them.
 *
 * Returns 0 when `nodeY <= 0` (the root has no angular constraint).
 * Returns `Infinity` when `minGap <= 0` — coincident or identical-angle
 * nodes make the constraint unsatisfiable at any finite radius. The caller
 * is responsible for capping this before using it in layout arithmetic.
 */
export function requiredRadiusForDepth(
    minGap: number,
    nodeY: number,
    mugshotSize: number,
    mugshotGap: number,
): number {
    if (nodeY <= 0) return 0;
    if (minGap <= 0) return Infinity;
    return (mugshotSize + mugshotGap) / (minGap * nodeY);
}

/**
 * Returns the smallest outer radius that prevents mugshot overlap at every
 * depth of a radial tidy tree whose nodes have already been assigned angular
 * positions in [0, 2π] by a unit-radius first-pass layout.
 *
 * @param depthGroups - pairs of [depth, nodes] as returned by d3.groups
 * @param maxDepth    - hierarchy.height
 * @param floorRadius - minimum radius regardless of density (e.g. half the
 *                      SVG width), used so sparse trees still fill the space
 * @param mugshotSize - node diameter in pixels
 * @param mugshotGap  - minimum pixel gap between adjacent node edges
 */
export function computeTreeRadius(
    depthGroups: [number, { x: number }[]][],
    maxDepth: number,
    floorRadius: number,
    mugshotSize: number,
    mugshotGap: number,
): number {
    let radius = Math.max(0, floorRadius);
    if (maxDepth <= 0) return radius;

    for (const [depth, nodes] of depthGroups) {
        if (depth === 0 || nodes.length < 2) continue;
        const gap = minAngularGap(nodes.map((n) => n.x));
        const nodeY = depth / maxDepth;
        radius = Math.max(
            radius,
            requiredRadiusForDepth(gap, nodeY, mugshotSize, mugshotGap),
        );
    }

    return radius;
}
