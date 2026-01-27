/**
 * Server action proxy type for the deletePlayer action.
 * Enables dependency injection for components and stories without importing
 * the server-only action directly.
 *
 * This action initiates the process to delete the currently authenticated user account.
 * It sends a confirmation email and performs cleanup of player-associated data.
 */
export type DeletePlayerProxy = () => Promise<void>;
