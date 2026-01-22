import playerRecordService from '@/services/PlayerRecord';

interface UpdatePlayerRecordsDeps {
    playerRecordService: Pick<typeof playerRecordService, 'deleteAll' | 'upsertForGameDay'>;
}

const defaultDeps: UpdatePlayerRecordsDeps = {
    playerRecordService,
};

export async function updatePlayerRecordsCore(deps: UpdatePlayerRecordsDeps = defaultDeps) {
    await deps.playerRecordService.deleteAll();
    await deps.playerRecordService.upsertForGameDay();
}
