import { z } from 'zod';

/**
 * Schema for a single node in the player family tree. Each node represents
 * a player (or the virtual root) and contains the player's id, display name,
 * and any children they introduced to the club.
 */
export const FamilyTreeNodeSchema: z.ZodType<FamilyTreeNodeType> = z.lazy(() =>
    z.object({
        /** Player id, or 0 for the virtual root node. */
        id: z.number(),
        /** Display name of the player, or the club name for the root. */
        name: z.string(),
        /** Child nodes — players introduced by this player. */
        children: z.array(FamilyTreeNodeSchema),
    }),
);

/**
 * Recursive type representing a node in the player introduction family tree.
 * Players with no `introducedBy` value are attached to a virtual root node.
 */
export interface FamilyTreeNodeType {
    /** Player id, or 0 for the virtual root node. */
    id: number;
    /** Display name of the player, or the club name for the root. */
    name: string;
    /** Child nodes — players introduced by this player. */
    children: FamilyTreeNodeType[];
}
