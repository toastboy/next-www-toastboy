/**
 * Server action proxy type for the getProgress action.
 * Returns a tuple of [lastRecordedGameDayId, mostRecentGameDayId],
 * or null if no game data is available.
 */
export type GetProgressProxy = () => Promise<[number, number] | null>;
