import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

// TODO: Tidy up types like this across the codebase
import type { CreateMoreGameDaysInput } from '@/types/CreateMoreGameDaysInput';

/**
 * Server action proxy type for the createMoreGameDays action.
 * Enables dependency injection for components and stories without importing
 * the server-only action directly.
 *
 * Creates multiple game day entries and revalidates related paths in the cache.
 *
 * @param data - Validated input containing rows of game day information to create.
 * @returns A promise that resolves to an array of created GameDay records, or null if
 * any creation failed.
 */
export type CreateMoreGameDaysProxy = (
    data: CreateMoreGameDaysInput,
) => Promise<(GameDayType | null)[]>;
