import { FamilyTreeNodeType } from '@/types';

/**
 * Default mock family tree data with the founding player at the root.
 * Player 1 ("Gary Player") is the founder who introduced players 2 and 3;
 * player 2 introduced player 4. Only players who are part of an introduction
 * chain are included.
 */
export const defaultFamilyTree: FamilyTreeNodeType = {
    id: 1,
    name: 'Gary Player',
    children: [
        {
            id: 2,
            name: 'Bob Smith',
            children: [
                {
                    id: 4,
                    name: 'Dave Jones',
                    children: [],
                },
            ],
        },
        {
            id: 3,
            name: 'Charlie Brown',
            children: [],
        },
    ],
};

/**
 * Creates a mock family tree node with optional overrides.
 *
 * @param overrides - Partial properties to override on the default root node.
 * @returns A FamilyTreeNodeType with the specified overrides.
 */
export const createMockFamilyTree = (
    overrides: Partial<FamilyTreeNodeType> = {},
): FamilyTreeNodeType => ({
    ...defaultFamilyTree,
    ...overrides,
});
