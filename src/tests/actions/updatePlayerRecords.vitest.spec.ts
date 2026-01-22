import { describe, expect, it, vi } from 'vitest';

import { updatePlayerRecordsCore } from '@/lib/actions/updatePlayerRecords';

describe('updatePlayerRecordsCore', () => {
    it('deletes and upserts player records', async () => {
        const playerRecordService = {
            deleteAll: vi.fn(),
            upsertForGameDay: vi.fn(),
        };

        await updatePlayerRecordsCore({ playerRecordService });

        expect(playerRecordService.deleteAll).toHaveBeenCalled();
        expect(playerRecordService.upsertForGameDay).toHaveBeenCalled();
    });
});
