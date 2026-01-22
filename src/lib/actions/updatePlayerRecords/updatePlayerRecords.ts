import 'server-only';

import playerRecordService from '@/services/PlayerRecord';

interface UpdatePlayerRecordsDeps {
    playerRecordService: Pick<typeof playerRecordService, 'deleteAll' | 'upsertForGameDay'>;
}

const defaultDeps: UpdatePlayerRecordsDeps = {
    playerRecordService,
};

/**
 * Updates player records by first deleting all existing records and then
 * upserting new records for the current game day.
 *
 * @param deps - The dependencies required for updating player records. Defaults
 * to `defaultDeps` if not provided.
 * @returns A promise that resolves when the player records have been updated.
 */
export async function updatePlayerRecordsCore(deps: UpdatePlayerRecordsDeps = defaultDeps) {
    await deps.playerRecordService.deleteAll();
    await deps.playerRecordService.upsertForGameDay();
}
