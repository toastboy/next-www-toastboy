/**
 * Server action proxy type for the setAdminRoleAction action.
 * Enables dependency injection for components and stories without importing
 * the server-only action directly.
 *
 * @param userId - The ID of the user whose admin role is being updated.
 * @param isAdmin - Whether the user should be an admin.
 */
export type SetAdminRoleProxy = (
    userId: string,
    isAdmin: boolean,
) => Promise<void>;
