/**
 * Storybook stub for creating a player; mirrors server action signature without side effects.
 * @returns Promise resolving to a placeholder player record identifier.
 */
export async function createPlayer() {
    return { id: 0 };
}

/**
 * Storybook stub for issuing a player invite; prevents server calls during Storybook render.
 * @returns Promise resolving to a placeholder invite token.
 */
export async function addPlayerInvite() {
    return '';
}
