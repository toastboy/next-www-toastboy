/**
 * Server action proxy type for the updatePlayerRecords action.
 * Enables dependency injection for components and stories without importing
 * the server-only action directly.
 *
 * This action recalculates and updates player records (stats) across all
 * game days and seasons. It takes no parameters and returns nothing but
 * triggers a background recalculation process.
 */
export type UpdatePlayerRecordsProxy = () => Promise<void>;
